declare module '@solana/wallet-adapter-react' {
  import { Wallet, WalletError, WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
  import { Connection, PublicKey, Transaction, VersionedTransaction, SendOptions } from '@solana/web3.js';
  import React, { FC, ReactNode } from 'react';

  export interface WalletContextState {
    autoConnect: boolean;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    select(walletName: WalletName): void;
    wallet: Wallet | null;
    wallets: Wallet[];
    publicKey: PublicKey | null;
    disconnect(): Promise<void>;
    sendTransaction: (
      transaction: Transaction | VersionedTransaction,
      connection: Connection,
      options?: SendOptions & { signers?: Signer[] }
    ) => Promise<string>;
  }

  export interface AnchorWallet {
    publicKey: PublicKey;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
    sendTransaction(
      transaction: Transaction,
      connection: Connection,
      options?: SendOptions & { signers?: Signer[] }
    ): Promise<string>;
  }

  export type Signer = { publicKey: PublicKey; secretKey: Uint8Array };

  export function useAnchorWallet(): AnchorWallet | undefined;
  export function useConnection(): { connection: Connection };
  export function useWallet(): WalletContextState;

  export interface ConnectionProviderProps {
    children: ReactNode;
    endpoint: string;
    config?: any;
  }

  export interface WalletProviderProps {
    children: ReactNode;
    wallets: Wallet[];
    autoConnect?: boolean;
    onError?: (error: WalletError) => void;
    localStorageKey?: string;
  }

  export const ConnectionProvider: FC<ConnectionProviderProps>;
  export const WalletProvider: FC<WalletProviderProps>;
}

declare module '@solana/wallet-adapter-base' {
  import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
  
  export enum WalletAdapterNetwork {
    Mainnet = 'mainnet-beta',
    Testnet = 'testnet',
    Devnet = 'devnet'
  }
  
  export type WalletName = string;
  export type WalletReadyState = 'installed' | 'loadable' | 'notDetected' | 'unsupported';
  
  export interface Wallet {
    name: WalletName;
    url: string;
    icon: string;
    readyState: WalletReadyState;
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
  }
  
  export class WalletError extends Error {
    error: any;
    name: string;
    constructor(message?: string, error?: any);
  }
}

declare module '@solana/wallet-adapter-wallets' {
  import { Wallet } from '@solana/wallet-adapter-base';
  
  export class PhantomWalletAdapter implements Wallet {
    name: string;
    url: string;
    icon: string;
    readyState: 'installed' | 'loadable' | 'notDetected' | 'unsupported';
    publicKey: import('@solana/web3.js').PublicKey | null;
    connecting: boolean;
    connected: boolean;
    
    constructor(config?: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transactions: T[]): Promise<T[]>;
  }
  
  export class SolflareWalletAdapter implements Wallet {
    name: string;
    url: string;
    icon: string;
    readyState: 'installed' | 'loadable' | 'notDetected' | 'unsupported';
    publicKey: import('@solana/web3.js').PublicKey | null;
    connecting: boolean;
    connected: boolean;
    
    constructor(config?: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transactions: T[]): Promise<T[]>;
  }
  
  export class BackpackWalletAdapter implements Wallet {
    name: string;
    url: string;
    icon: string;
    readyState: 'installed' | 'loadable' | 'notDetected' | 'unsupported';
    publicKey: import('@solana/web3.js').PublicKey | null;
    connecting: boolean;
    connected: boolean;
    
    constructor(config?: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transactions: T[]): Promise<T[]>;
  }
  
  export class LedgerWalletAdapter implements Wallet {
    name: string;
    url: string;
    icon: string;
    readyState: 'installed' | 'loadable' | 'notDetected' | 'unsupported';
    publicKey: import('@solana/web3.js').PublicKey | null;
    connecting: boolean;
    connected: boolean;
    
    constructor(config?: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transactions: T[]): Promise<T[]>;
  }
  
  export class TorusWalletAdapter implements Wallet {
    name: string;
    url: string;
    icon: string;
    readyState: 'installed' | 'loadable' | 'notDetected' | 'unsupported';
    publicKey: import('@solana/web3.js').PublicKey | null;
    connecting: boolean;
    connected: boolean;
    
    constructor(config?: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends import('@solana/web3.js').Transaction | import('@solana/web3.js').VersionedTransaction>(transactions: T[]): Promise<T[]>;
  }
}

declare module '@solana/wallet-adapter-react-ui' {
  import { FC, ReactNode } from 'react';
  
  export interface WalletModalProviderProps {
    children: ReactNode;
    className?: string;
    logo?: ReactNode;
  }
  
  export interface WalletModalContextState {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  }
  
  export const WalletModalProvider: FC<WalletModalProviderProps>;
  export function useWalletModal(): WalletModalContextState;
}

declare module '@solana/wallet-adapter-react-ui/styles.css' {
  const styles: any;
  export default styles;
} 