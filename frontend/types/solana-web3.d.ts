declare module '@solana/web3.js' {
  export class Connection {
    constructor(endpoint: string, commitment?: string);
    getBalance(publicKey: PublicKey): Promise<number>;
    getTokenAccountBalance(tokenAccount: PublicKey): Promise<any>;
    confirmTransaction(signature: string, commitment?: string): Promise<any>;
    getProgramAccounts(programId: PublicKey, options?: any): Promise<any[]>;
  }

  export class PublicKey {
    constructor(value: string | number[] | Uint8Array | Buffer);
    static findProgramAddressSync(seeds: (Buffer | Uint8Array)[], programId: PublicKey): [PublicKey, number];
    static findProgramAddress(seeds: (Buffer | Uint8Array)[], programId: PublicKey): Promise<[PublicKey, number]>;
    equals(publicKey: PublicKey): boolean;
    toBase58(): string;
    toBuffer(): Buffer;
    toString(): string;
    toBytes(): Uint8Array;
  }

  export class Transaction {
    add(...instructions: TransactionInstruction[]): Transaction;
    sign(...signers: Account[]): Transaction;
    serialize(config?: any): Buffer;
  }

  export class VersionedTransaction {
    constructor(message: any, signatures?: Uint8Array[]);
    serialize(): Uint8Array;
  }

  export class Account {
    constructor(secretKey?: Uint8Array);
    publicKey: PublicKey;
    secretKey: Uint8Array;
    sign(message: Uint8Array): Uint8Array;
  }

  export class TransactionInstruction {
    constructor(options: {
      keys: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[];
      programId: PublicKey;
      data?: Buffer;
    });
    keys: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[];
    programId: PublicKey;
    data: Buffer;
  }

  export interface SendOptions {
    skipPreflight?: boolean;
    preflightCommitment?: string;
    maxRetries?: number;
  }

  export const SystemProgram: {
    programId: PublicKey;
    createAccount(params: any): TransactionInstruction;
    transfer(params: any): TransactionInstruction;
  };

  export const SYSVAR_RENT_PUBKEY: PublicKey;

  export function clusterApiUrl(cluster: string): string;

  export const Keypair: {
    generate(): Account;
    fromSecretKey(secretKey: Uint8Array): Account;
    fromSeed(seed: Uint8Array): Account;
  };
} 