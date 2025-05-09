declare module '@radix-ui/react-toast' {
  import * as React from 'react';

  interface ToastProps extends React.ComponentPropsWithoutRef<'div'> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    forceMount?: true;
    type?: 'foreground' | 'background';
    duration?: number;
  }

  interface ToastViewportProps extends React.ComponentPropsWithoutRef<'ol'> {
    forceMount?: true;
    hotkey?: string[];
    label?: string;
  }

  interface ToastTitleProps extends React.ComponentPropsWithoutRef<'div'> {}
  interface ToastDescriptionProps extends React.ComponentPropsWithoutRef<'div'> {}
  interface ToastActionProps extends React.ComponentPropsWithoutRef<'button'> {
    altText: string;
  }
  interface ToastCloseProps extends React.ComponentPropsWithoutRef<'button'> {}

  export const Provider: React.FC<React.PropsWithChildren<{}>>;
  export const Viewport: React.ForwardRefExoticComponent<ToastViewportProps & React.RefAttributes<HTMLOListElement>>;
  export const Root: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLLIElement>>;
  export const Title: React.ForwardRefExoticComponent<ToastTitleProps & React.RefAttributes<HTMLDivElement>>;
  export const Description: React.ForwardRefExoticComponent<ToastDescriptionProps & React.RefAttributes<HTMLDivElement>>;
  export const Action: React.ForwardRefExoticComponent<ToastActionProps & React.RefAttributes<HTMLButtonElement>>;
  export const Close: React.ForwardRefExoticComponent<ToastCloseProps & React.RefAttributes<HTMLButtonElement>>;
}

declare module 'class-variance-authority' {
  export type ClassValue = string | number | boolean | undefined | null | Record<string, unknown> | ClassValue[];

  export type VariantProps<T extends (...args: any) => any> = Omit<
    Parameters<T>[0],
    'class' | 'className'
  >;

  export function cva(base: string, config?: any): (...args: any[]) => string;
}

declare module 'lucide-react' {
  import * as React from 'react';
  
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }
  
  export const X: React.FC<IconProps>;
  export const ChevronDown: React.FC<IconProps>;
  export const ChevronRight: React.FC<IconProps>;
  export const Circle: React.FC<IconProps>;
}

declare module 'clsx' {
  export type ClassValue = string | number | boolean | undefined | null | Record<string, unknown> | ClassValue[];
  
  export function clsx(...inputs: ClassValue[]): string;
}

declare module 'tailwind-merge' {
  export function twMerge(...inputs: string[]): string;
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