import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/database/prisma.client.js';
import { signAccessToken } from './jwt.js';
import { setAuthCookie, clearAuthCookie } from '../../../utils/cookies.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Identifiants invalides' });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      passwordHash: true,
      role: true,
      hotelId: true,
      isActive: true,
    },
  });

  // Message générique pour éviter l'énumération d'utilisateurs
  const invalidCreds = { error: 'Email ou mot de passe incorrect' };

  if (!user || !user.isActive) {
    return res.status(401).json(invalidCreds);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json(invalidCreds);
  }

  const token = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    hotelId: user.hotelId,
  });

  setAuthCookie(res, token);

  return res.json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      hotelId: user.hotelId,
    },
  });
}

export async function logout(_req: Request, res: Response) {
  clearAuthCookie(res);
  return res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  // requireAuth a déjà vérifié le token
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      hotelId: true,
      hotel: { select: { id: true, name: true } },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  return res.json({ user });
}

// Endpoint dédié mobile — renvoie le JWT dans le body (pas en cookie httpOnly)
// Les apps mobiles ne peuvent pas accéder aux cookies httpOnly (sandbox iOS/Android)
export async function loginMobile(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Identifiants invalides' });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      passwordHash: true,
      role: true,
      hotelId: true,
      isActive: true,
      hotel: { select: { id: true, name: true } },
    },
  });

  const invalidCreds = { error: 'Email ou mot de passe incorrect' };

  if (!user || !user.isActive) {
    return res.status(401).json(invalidCreds);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json(invalidCreds);
  }

  const { passwordHash: _, ...userWithoutHash } = user;
  const token = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    hotelId: user.hotelId,
  });

  // Renvoie le token dans le body pour stockage sécurisé côté mobile
  return res.json({ token, user: userWithoutHash });
}
