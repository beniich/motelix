import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/database/prisma.client.js';
import { signAccessToken } from './jwt.js';
import { setAuthCookie, clearAuthCookie } from '../../../utils/cookies.js';
import { logAudit } from '../../audit/audit.service.js';
import { asyncHandler } from '../../../shared/errors/asyncHandler.js';
import { ApiError } from '../../../shared/errors/errorHandler.js';

const loginSchema = z.object({
  email: z.string().email().transform((e) => e.toLowerCase()),
  password: z.string().min(1),
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { hotel: { select: { id: true, name: true } } },
  });
  
  // 🔒 Log tentative échouée (user not found)
  if (!user || !user.isActive) {
    await logAudit({
      actor: email, // on log l'email tenté
      action: 'user.login_failed',
      resource: 'user',
      metadata: { 
        reason: !user ? 'user_not_found' : 'user_inactive',
        email, 
        ip: req.ip,
      },
    }, req);
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  
  const valid = await bcrypt.compare(password, user.passwordHash);
  
  // 🔒 Log tentative échouée (bad password)
  if (!valid) {
    await logAudit({
      actor: user.id,
      action: 'user.login_failed',
      resource: 'user',
      resourceId: user.id,
      metadata: { reason: 'invalid_password', email, ip: req.ip },
    }, req);
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  
  const token = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    hotelId: user.hotelId,
  });
  
  setAuthCookie(res, token);
  
  // 🔒 Log succès
  await logAudit({
    actor: user.id,
    action: 'user.login',
    resource: 'user',
    resourceId: user.id,
    metadata: { 
      method: 'password', 
      ip: req.ip,
      userAgent: req.get('user-agent'),
    },
  }, req);
  
  return res.json({
    accessToken: token, // backward compat for mobile
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      hotelId: user.hotelId,
      hotel: user.hotel,
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // 🔒 Log logout AVANT de clear le cookie
  if (req.user) {
    await logAudit({
      actor: req.user.userId,
      action: 'user.logout',
      resource: 'user',
      resourceId: req.user.userId,
      metadata: { ip: req.ip },
    }, req);
  }
  
  clearAuthCookie(res);
  return res.json({ ok: true });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');
  
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: { hotel: { select: { id: true, name: true } } },
  });
  
  if (!user) throw new ApiError(404, 'User not found');
  
  res.json({ user });
});

// Endpoint dédié mobile
export const loginMobile = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { hotel: { select: { id: true, name: true } } },
  });
  
  if (!user || !user.isActive) {
    await logAudit({
      actor: email,
      action: 'user.login_failed',
      resource: 'user',
      metadata: { reason: 'mobile_user_not_found', email, ip: req.ip },
    }, req);
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    await logAudit({
      actor: user.id,
      action: 'user.login_failed',
      resource: 'user',
      resourceId: user.id,
      metadata: { reason: 'mobile_invalid_password', email, ip: req.ip },
    }, req);
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  
  const token = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    hotelId: user.hotelId,
  });
  
  await logAudit({
    actor: user.id,
    action: 'user.login_mobile',
    resource: 'user',
    resourceId: user.id,
    metadata: { method: 'password', ip: req.ip, userAgent: req.get('user-agent') },
  }, req);
  
  const { passwordHash: _, ...userWithoutHash } = user;
  return res.json({ token, user: userWithoutHash });
});
