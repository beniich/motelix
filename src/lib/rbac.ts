import type { LucideIcon } from 'lucide-react';
import {
  Brain, Power, Crown, FileLock, Shield, Zap, Box, Wrench,
} from 'lucide-react';

export type UserRole = 'OPERATOR' | 'MANAGER';

export type ClearanceLevel = 'LEVEL-4-ARRIVAL' | 'LEVEL-5-PROPRIETOR';

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  clearance: ClearanceLevel;
}

export interface RestrictedTabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  requiredClearance: ClearanceLevel;
  description: string;
  securityLevel: string;
}

export const RESTRICTED_TABS: RestrictedTabConfig[] = [
  {
    id: 'strategy',
    label: 'Strategic Intelligence',
    icon: Brain,
    requiredClearance: 'LEVEL-5-PROPRIETOR',
    description: 'Access to strategic intelligence dashboards, market analytics and revenue projections.',
    securityLevel: 'ALPHA',
  },
  {
    id: 'master-switch',
    label: 'Master Global Switch',
    icon: Power,
    requiredClearance: 'LEVEL-5-PROPRIETOR',
    description: 'Global operational controls: hotel-wide mode changes, emergency shutdowns, system overrides.',
    securityLevel: 'OMEGA',
  },
  {
    id: 'billing',
    label: 'Elite Subscription Plans',
    icon: Crown,
    requiredClearance: 'LEVEL-5-PROPRIETOR',
    description: 'Premium subscription management, billing settings, payment provider integrations.',
    securityLevel: 'BETA',
  },
  {
    id: 'document-vault',
    label: 'Secure Document Vault',
    icon: FileLock,
    requiredClearance: 'LEVEL-5-PROPRIETOR',
    description: 'Confidential documents: contracts, legal files, ownership papers, classified reports.',
    securityLevel: 'GAMMA',
  },
  {
    id: 'admin-center',
    label: 'Master Data Admin',
    icon: Shield,
    requiredClearance: 'LEVEL-5-PROPRIETOR',
    description: 'Master data administration: user roles, permissions, system-wide configuration.',
    securityLevel: 'DELTA',
  },
  {
    id: 'security',
    label: 'Aurum Security Shield',
    icon: Shield,
    requiredClearance: 'LEVEL-5-PROPRIETOR',
    description: 'Security operations center: surveillance, threat detection, incident response.',
    securityLevel: 'OMEGA',
  },
  {
    id: 'energy',
    label: 'Aetheon Energy Microgrid',
    icon: Zap,
    requiredClearance: 'LEVEL-5-PROPRIETOR',
    description: 'Energy management: consumption, optimization, microgrid control systems.',
    securityLevel: 'EPSILON',
  },
  {
    id: 'digital-twin',
    label: 'Digital Twin Host',
    icon: Box,
    requiredClearance: 'LEVEL-5-PROPRIETOR',
    description: 'Digital twin infrastructure: 3D models, simulations, predictive maintenance.',
    securityLevel: 'ZETA',
  },
  {
    id: 'maintenance',
    label: '3D Structural Blueprint',
    icon: Wrench,
    requiredClearance: 'LEVEL-5-PROPRIETOR',
    description: 'Structural maintenance blueprints, facility integrity, engineering oversight.',
    securityLevel: 'ETA',
  },
];

export const isTabRestricted = (tabId: string): boolean => {
  return RESTRICTED_TABS.some((tab) => tab.id === tabId);
};

export const getTabRestriction = (tabId: string): RestrictedTabConfig | undefined => {
  return RESTRICTED_TABS.find((tab) => tab.id === tabId);
};

export const hasAccess = (user: CurrentUser | null, tabId: string): boolean => {
  if (!user) return false;
  const restriction = getTabRestriction(tabId);
  if (!restriction) return true; // Non-restricted = everyone has access
  return user.clearance === restriction.requiredClearance;
};
