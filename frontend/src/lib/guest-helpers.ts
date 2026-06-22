import type { Guest } from '@/lib/api-client';

export const LOYALTY_TIERS = {
  BRONZE: { label: 'Bronze', color: 'orange', minPoints: 0 },
  SILVER: { label: 'Silver', color: 'gray', minPoints: 500 },
  GOLD: { label: 'Gold', color: 'yellow', minPoints: 2000 },
  PLATINUM: { label: 'Platinum', color: 'blue', minPoints: 5000 },
  DIAMOND: { label: 'Diamond', color: 'violet', minPoints: 10000 },
} as const;

export type LoyaltyTier = keyof typeof LOYALTY_TIERS;

export function getLoyaltyTier(points: number): LoyaltyTier {
  if (points >= 10000) return 'DIAMOND';
  if (points >= 5000) return 'PLATINUM';
  if (points >= 2000) return 'GOLD';
  if (points >= 500) return 'SILVER';
  return 'BRONZE';
}

export function getNextTierProgress(points: number): {
  current: LoyaltyTier;
  next: LoyaltyTier | null;
  pointsToNext: number;
  percent: number;
} {
  const tiers: LoyaltyTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
  const current = getLoyaltyTier(points);
  const currentIndex = tiers.indexOf(current);
  const next = currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  
  if (!next) {
    return { current, next: null, pointsToNext: 0, percent: 100 };
  }
  
  const currentThreshold = LOYALTY_TIERS[current].minPoints;
  const nextThreshold = LOYALTY_TIERS[next].minPoints;
  const pointsToNext = nextThreshold - points;
  const percent = Math.min(100, Math.round(((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100));
  
  return { current, next, pointsToNext, percent };
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const maskedUser = user.length > 2 ? `${user.slice(0, 2)}***` : '***';
  return `${maskedUser}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return '****';
  return `${phone.slice(0, 4)}****${phone.slice(-2)}`;
}
