
import React from 'react';
import { PlanTier } from './types';

export const COLORS = {
  primary: '#0F172A',
  secondary: '#3B82F6',
  accent: '#10B981',
};

export const PLAN_PRICES = {
  [PlanTier.BASIC]: 15000,   // Kwanza (Kz)
  [PlanTier.PREMIUM]: 35000,
  [PlanTier.PRO]: 75000,
};

export const DISCOUNTS = {
  MONTHLY: 0,
  QUARTERLY: 0.05, // 5%
  ANNUAL: 0.15,    // 15%
};

export const WHATSAPP_NUMBER = "244900000000"; // Exemplo Angola
