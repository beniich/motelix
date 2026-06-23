/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-namespace */
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError } from '../../../shared/errors/errorHandler.js';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

/**
 * Extracts tenantId (hotelId) from the authenticated user.
 * All queries in protected routes must be scoped to this tenant.
 */
export const requireTenant: RequestHandler = (req, _res, next) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');
  req.tenantId = req.user.hotelId;
  next();
};

/**
 * Verifies that the target hotelId (from URL params or body) matches the user's hotel.
 * SUPER_ADMIN can bypass this check.
 */
export function assertSameHotel(req: Request, targetHotelId: string) {
  if (req.user?.role === 'SUPER_ADMIN') return;
  if (req.user?.hotelId !== targetHotelId) {
    throw new ApiError(403, 'Accès interdit : hôtel différent');
  }
}
