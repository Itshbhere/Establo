declare module '@solana/spl-token' {
  import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

  export const TOKEN_PROGRAM_ID: PublicKey;
  export const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey;

  export function getAssociatedTokenAddress(
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve?: boolean,
    programId?: PublicKey,
    associatedTokenProgramId?: PublicKey
  ): Promise<PublicKey>;

  export function createAssociatedTokenAccountInstruction(
    payer: PublicKey,
    associatedToken: PublicKey,
    owner: PublicKey,
    mint: PublicKey,
    programId?: PublicKey,
    associatedTokenProgramId?: PublicKey
  ): TransactionInstruction;

  export function getAccount(
    connection: any,
    address: PublicKey,
    commitment?: string,
    programId?: PublicKey
  ): Promise<any>;

  export function createTransferInstruction(
    source: PublicKey,
    destination: PublicKey,
    owner: PublicKey,
    amount: number | bigint,
    multiSigners?: any[],
    programId?: PublicKey
  ): TransactionInstruction;

  export function mintTo(
    connection: any,
    payer: any,
    mint: PublicKey,
    destination: PublicKey,
    authority: PublicKey | any,
    amount: number | bigint,
    multiSigners?: any[],
    confirmOptions?: any,
    programId?: PublicKey
  ): Promise<any>;
} 