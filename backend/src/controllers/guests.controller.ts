import type { Request, Response } from 'express';
import { prisma } from '../infrastructure/database/prisma.client.js';
import { getTenantIdOrThrow } from '../shared/utils/tenant.js';
import { z } from 'zod';

const guestSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  documentType: z.enum(['PASSPORT', 'ID_CARD', 'DRIVING_LICENSE']).optional(),
  documentNumber: z.string().optional(),
  preferences: z.string().optional(),
  vip: z.boolean().optional(),
});

// GET /api/guests?search=&vip=&page=&pageSize=
export async function listGuests(req: Request, res: Response) {
  const { search, vip, page = '1', pageSize = '20' } = req.query as Record<string, string>;
  const hotelId = await getTenantIdOrThrow(req);

  const skip = (Number(page) - 1) * Number(pageSize);
  const where: Record<string, unknown> = { hotelId };

  if (vip === 'true') where.vip = true;
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.guest.findMany({
      where,
      skip,
      take: Number(pageSize),
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { reservations: true } } },
    }),
    prisma.guest.count({ where }),
  ]);

  res.json({
    items,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      totalPages: Math.ceil(total / Number(pageSize)),
      hasNext: skip + items.length < total,
      hasPrev: Number(page) > 1,
    },
  });
}

// GET /api/guests/:id
export async function getGuest(req: Request, res: Response) {
  const guest = await prisma.guest.findFirst({
    where: { id: req.params.id, hotelId: await getTenantIdOrThrow(req) },
    include: {
      reservations: {
        orderBy: { checkIn: 'desc' },
        take: 10,
        include: { room: { select: { number: true, type: true } } },
      },
    },
  });
  if (!guest) return res.status(404).json({ error: 'Client introuvable' });
  res.json(guest);
}

// POST /api/guests
export async function createGuest(req: Request, res: Response) {
  const parsed = guestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const guest = await prisma.guest.create({
    data: { ...parsed.data, hotelId: await getTenantIdOrThrow(req) },
  });
  res.status(201).json(guest);
}

// PATCH /api/guests/:id
export async function updateGuest(req: Request, res: Response) {
  const parsed = guestSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await prisma.guest.findFirst({
    where: { id: req.params.id, hotelId: await getTenantIdOrThrow(req) },
  });
  if (!existing) return res.status(404).json({ error: 'Client introuvable' });

  const guest = await prisma.guest.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(guest);
}

// DELETE /api/guests/:id
export async function deleteGuest(req: Request, res: Response) {
  const existing = await prisma.guest.findFirst({
    where: { id: req.params.id, hotelId: await getTenantIdOrThrow(req) },
  });
  if (!existing) return res.status(404).json({ error: 'Client introuvable' });

  // Check active reservations
  const active = await prisma.reservation.count({
    where: {
      guestId: req.params.id,
      status: { in: ['CONFIRMED', 'CHECKED_IN'] },
    },
  });
  if (active > 0) {
    return res.status(409).json({ error: 'Ce client a des réservations actives' });
  }

  await prisma.guest.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
