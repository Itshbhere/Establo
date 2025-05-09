import { PublicKey } from '@solana/web3.js';

// Program IDs
export const STABLECOIN_PROGRAM_ID = new PublicKey('2tPFAWN8KNcMfWyMQ2Y522dPptcbaZHYE8bM9y7NzZva');
export const RWA_MARKETPLACE_PROGRAM_ID = new PublicKey('3YGXqNveAS9ZEG1mQXGMrpRzrCGfJrLEVf2zzSS9rJwt');

// PDAs
export const STABLECOIN_CONFIG_SEED = 'config';
export const MARKETPLACE_SEED = 'marketplace';
export const PROPERTY_SEED = 'property';

// Token Decimals
export const TOKEN_DECIMALS = 6;

// Backing Ratios
export const USDT_BACKING_RATIO = 70; // 70%
export const REAL_ESTATE_BACKING_RATIO = 30; // 30%

// Transaction Status
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Asset Status
export enum AssetStatus {
  LISTED = 'Listed',
  AT_RISK = 'AtRisk',
  LIQUIDATED = 'Liquidated'
} 