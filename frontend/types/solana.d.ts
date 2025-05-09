declare module '@solana/wallet-adapter-react' {
  import { Wallet, WalletError } from '@solana/wallet-adapter-base';
  import { Connection, PublicKey, Transaction, VersionedTransaction, SendOptions } from '@solana/web3.js';
  import React from 'react';

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

  export interface WalletContextState {
    autoConnect: boolean;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    select(walletName: WalletName): void;
    wallet: Wallet | null;
    wallets: Wallet[];
    publicKey: PublicKey | null;
    sendTransaction: (
      transaction: Transaction | VersionedTransaction,
      connection: Connection,
      options?: SendOptions & { signers?: Signer[] }
    ) => Promise<string>;
  }

  export type WalletName = string;
  export type Signer = { publicKey: PublicKey; secretKey: Uint8Array };

  export function useAnchorWallet(): AnchorWallet | undefined;
  export function useConnection(): { connection: Connection };
  export function useWallet(): WalletContextState;
}

declare module '@project-serum/anchor' {
  import { AccountInfo, Commitment, Connection, PublicKey, Transaction, TransactionSignature } from '@solana/web3.js';
  
  export class BN {
    constructor(value: string | number | BN, base?: number);
    toString(): string;
  }

  export interface IdlAccount {
    name: string;
    isMut: boolean;
    isSigner: boolean;
  }

  export interface IdlInstruction {
    name: string;
    accounts: IdlAccount[];
    args: IdlField[];
  }

  export interface IdlField {
    name: string;
    type: any;
  }

  export class Program {
    constructor(idl: any, programId: PublicKey, provider: AnchorProvider);
    account: {
      [name: string]: {
        fetch: (address: PublicKey) => Promise<any>;
      };
    };
    methods: {
      [name: string]: (...args: any[]) => {
        accounts: (accounts: any) => {
          signers: (signers: any[]) => {
            transaction: () => Promise<Transaction>;
            view: () => Promise<any>;
          };
          transaction: () => Promise<Transaction>;
          view: () => Promise<any>;
        };
      };
    };
  }

  export class AnchorProvider {
    constructor(connection: Connection, wallet: any, opts: { preflightCommitment: Commitment });
  }

  export const web3: {
    SystemProgram: any;
    Keypair: any;
  };
}

declare module 'decimal.js' {
  export default class Decimal {
    constructor(value: string | number | Decimal);
    toString(): string;
    add(n: Decimal | string | number): Decimal;
    sub(n: Decimal | string | number): Decimal;
    mul(n: Decimal | string | number): Decimal;
    div(n: Decimal | string | number): Decimal;
    pow(n: Decimal | string | number): Decimal;
    floor(): Decimal;
    isNaN(): boolean;
    lte(n: Decimal | string | number): boolean;
  }
}

// Add declarations for the toast component
declare module '@/components/ui/use-toast' {
  export interface ToastProps {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }
  
  export const toast: (props: ToastProps) => void;
} 