import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';
import { AssetStatus } from './constants';

interface Property {
  publicKey: PublicKey;
  owner: PublicKey;
  mint: PublicKey;
  value: string;
  initialValue: string;
  lastValuationDate: number;
  location: string;
  details: string;
  status: AssetStatus;
  liquidationThreshold: number;
}

interface StoreState {
  // User State
  isAdmin: boolean;
  balance: string;
  
  // Stablecoin State
  mintAddress: PublicKey | null;
  reserves: {
    usdt: string;
    realEstate: string;
    isFullyBacked: boolean;
  };
  
  // RWA Marketplace State
  properties: Property[];
  selectedProperty: Property | null;
  liquidationThreshold: number;
  
  // UI State
  loading: boolean;
  
  // Actions
  setIsAdmin: (isAdmin: boolean) => void;
  setBalance: (balance: string) => void;
  setMintAddress: (mintAddress: PublicKey | null) => void;
  setReserves: (reserves: { usdt: string; realEstate: string; isFullyBacked: boolean }) => void;
  setProperties: (properties: Property[]) => void;
  setSelectedProperty: (property: Property | null) => void;
  setLiquidationThreshold: (threshold: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Initial state
  isAdmin: false,
  balance: '0',
  mintAddress: null,
  reserves: {
    usdt: '0',
    realEstate: '0',
    isFullyBacked: false,
  },
  properties: [],
  selectedProperty: null,
  liquidationThreshold: 90,
  loading: false,
  
  // Actions
  setIsAdmin: (isAdmin) => set(() => ({ isAdmin })),
  setBalance: (balance) => set(() => ({ balance })),
  setMintAddress: (mintAddress) => set(() => ({ mintAddress })),
  setReserves: (reserves) => set(() => ({ reserves })),
  setProperties: (properties) => set(() => ({ properties })),
  setSelectedProperty: (selectedProperty) => set(() => ({ selectedProperty })),
  setLiquidationThreshold: (liquidationThreshold) => set(() => ({ liquidationThreshold })),
  setLoading: (loading) => set(() => ({ loading })),
})); 