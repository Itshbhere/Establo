import { 
  Connection, 
  PublicKey, 
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl
} from '@solana/web3.js';

import { 
  Program,
  AnchorProvider,
  web3, 
  BN
} from '@project-serum/anchor';

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount
} from '@solana/spl-token';

import { WalletContextState } from '@solana/wallet-adapter-react';
import idl from '../../lib/idl/green-stablecoin.json';

// Contract constants - Updated to use the actual deployed contract
const PROGRAM_ID = new PublicKey('C9W69g6fnYvFsbA3a9VEx9n1qqUA2V3YnFhm5p3nqrRc');
const USDT_MINT = new PublicKey('8H39WuuPeHL2QoyhKM7ynSuni1x72PRgvvVh7foorXMT');

export class StablecoinService {
  wallet: WalletContextState;
  connection: Connection;
  provider: AnchorProvider | null = null;
  program: Program | null = null;
  configPDA: PublicKey | null = null;
  mintAuthorityPDA: PublicKey | null = null;

  constructor(wallet: WalletContextState) {
    this.wallet = wallet;
    this.connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    if (wallet.publicKey) {
      this.initialize();
    }
  }

  async initialize() {
    try {
      // Create provider even if wallet is not connected yet
      const provider = new AnchorProvider(
        this.connection,
        this.wallet as any,
        { preflightCommitment: 'confirmed' }
      );
      
      // Create program
      const program = new Program(idl as any, PROGRAM_ID, provider);
      
      // Find PDAs
      const [configPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("config")],
        PROGRAM_ID
      );
      
      const [mintAuthorityPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("mint_authority")],
        PROGRAM_ID
      );
      
      this.provider = provider;
      this.program = program;
      this.configPDA = configPDA;
      this.mintAuthorityPDA = mintAuthorityPDA;
    } catch (error) {
      console.error("Error initializing service:", error);
      throw new Error("Failed to initialize stablecoin service");
    }
  }

  // Get total supply
  async getTotalSupply(): Promise<number> {
    if (!this.program || !this.configPDA) {
      await this.initialize();
      if (!this.program || !this.configPDA) {
        return 0; // Return 0 if initialization fails
      }
    }
    
    try {
      const config = await this.program.account.config.fetch(this.configPDA as PublicKey);
      return config.totalSupply.toNumber();
    } catch (error) {
      console.error("Error fetching total supply:", error);
      return 0;
    }
  }

  // Get reserve details
  async getReserves() {
    if (!this.program || !this.configPDA) {
      await this.initialize();
      if (!this.program || !this.configPDA) {
        return { usdt: 0, realEstate: 0 }; // Return empty data if initialization fails
      }
    }
    
    try {
      const config = await this.program.account.config.fetch(this.configPDA as PublicKey);
      
      // Get USDT reserve account
      const usdtReserve = await getAssociatedTokenAddress(
        USDT_MINT,
        this.configPDA,
        true
      );
      
      // Get USDT reserve balance
      try {
        const usdtAccount = await getAccount(this.connection, usdtReserve);
        const usdtBalance = Number(usdtAccount.amount);
        
        return {
          usdt: usdtBalance,
          realEstate: config.realEstateValue.toNumber()
        };
      } catch (error) {
        // If USDT account doesn't exist yet
        return { 
          usdt: 0, 
          realEstate: config.realEstateValue.toNumber() 
        };
      }
    } catch (error) {
      console.error("Error fetching reserves:", error);
      return { usdt: 0, realEstate: 0 };
    }
  }

  // Get real estate backing details
  async getRealEstateDetails() {
    if (!this.program || !this.configPDA) {
      await this.initialize();
      if (!this.program || !this.configPDA) {
        return { cid: "", value: 0 }; // Return empty data if initialization fails
      }
    }
    
    try {
      const config = await this.program.account.config.fetch(this.configPDA as PublicKey);
      return {
        cid: config.realEstateCid,
        value: config.realEstateValue.toNumber()
      };
    } catch (error) {
      console.error("Error fetching real estate details:", error);
      return { cid: "", value: 0 };
    }
  }

  // Get user balance
  async getUserBalance(): Promise<number> {
    if (!this.program || !this.configPDA) {
      await this.initialize();
      if (!this.program || !this.configPDA) {
        throw new Error("Failed to initialize service");
      }
    }
    
    if (!this.wallet.publicKey) {
      return 0; // Return 0 if wallet is not connected
    }
    
    try {
      const config = await this.program.account.config.fetch(this.configPDA as PublicKey);
      const mint = config.mint;
      
      // Get user token account
      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        this.wallet.publicKey
      );
      
      try {
        const account = await getAccount(this.connection, userTokenAccount);
        return Number(account.amount) / Math.pow(10, config.decimals);
      } catch (error) {
        // Token account doesn't exist yet
        return 0;
      }
    } catch (error) {
      console.error("Error fetching user balance:", error);
      return 0;
    }
  }

  // Mint stablecoin
  async mint(amount: number): Promise<string> {
    if (!this.program || !this.wallet.publicKey || !this.configPDA || !this.mintAuthorityPDA) {
      throw new Error("Program not initialized or wallet not connected");
    }
    
    try {
      const config = await this.program.account.config.fetch(this.configPDA as PublicKey);
      const mint = config.mint;
      const decimals = config.decimals;
      
      // Calculate amount in raw units (respecting decimals)
      const rawAmount = new BN(amount * Math.pow(10, decimals));
      
      // Get user token account
      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        this.wallet.publicKey
      );
      
      // Check if token account exists, create if not
      try {
        await getAccount(this.connection, userTokenAccount);
      } catch (error) {
        // Token account doesn't exist, create it
        const ix = createAssociatedTokenAccountInstruction(
          this.wallet.publicKey,
          userTokenAccount,
          this.wallet.publicKey,
          mint
        );
        
        const tx = new Transaction().add(ix);
        await this.wallet.sendTransaction(tx, this.connection);
      }
      
      // Create USDT reserve account (for example purposes, in production this would be handled differently)
      const usdtReserve = await getAssociatedTokenAddress(
        USDT_MINT,
        this.configPDA,
        true
      );
      
      // Mint stablecoin
      const tx = await this.program.methods
        .mint(rawAmount)
        .accounts({
          config: this.configPDA,
          mint: mint,
          recipientTokenAccount: userTokenAccount,
          usdtReserve: usdtReserve,
          mintAuthority: this.mintAuthorityPDA,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .transaction();
      
      const signature = await this.wallet.sendTransaction(tx, this.connection);
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error) {
      console.error("Error minting tokens:", error);
      throw error;
    }
  }

  // Burn stablecoin
  async burn(amount: number): Promise<string> {
    if (!this.program || !this.wallet.publicKey || !this.configPDA) {
      throw new Error("Program not initialized or wallet not connected");
    }
    
    try {
      const config = await this.program.account.config.fetch(this.configPDA as PublicKey);
      const mint = config.mint;
      const decimals = config.decimals;
      
      // Calculate amount in raw units (respecting decimals)
      const rawAmount = new BN(amount * Math.pow(10, decimals));
      
      // Get user token account
      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        this.wallet.publicKey
      );
      
      // Get USDT user token account
      const userUsdtAccount = await getAssociatedTokenAddress(
        USDT_MINT,
        this.wallet.publicKey
      );
      
      // Check if USDT token account exists, create if not
      try {
        await getAccount(this.connection, userUsdtAccount);
      } catch (error) {
        // Token account doesn't exist, create it
        const ix = createAssociatedTokenAccountInstruction(
          this.wallet.publicKey,
          userUsdtAccount,
          this.wallet.publicKey,
          USDT_MINT
        );
        
        const tx = new Transaction().add(ix);
        await this.wallet.sendTransaction(tx, this.connection);
      }
      
      // Create USDT reserve account
      const usdtReserve = await getAssociatedTokenAddress(
        USDT_MINT,
        this.configPDA,
        true
      );
      
      // Burn stablecoin
      const tx = await this.program.methods
        .burn(rawAmount)
        .accounts({
          config: this.configPDA,
          mint: mint,
          userTokenAccount: userTokenAccount,
          userUsdtAccount: userUsdtAccount,
          usdtReserve: usdtReserve,
          user: this.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .transaction();
      
      const signature = await this.wallet.sendTransaction(tx, this.connection);
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error) {
      console.error("Error burning tokens:", error);
      throw error;
    }
  }

  // Transfer tokens
  async transfer(recipient: string, amount: number): Promise<string> {
    if (!this.program || !this.wallet.publicKey || !this.configPDA) {
      throw new Error("Program not initialized or wallet not connected");
    }
    
    try {
      const config = await this.program.account.config.fetch(this.configPDA as PublicKey);
      const mint = config.mint;
      const decimals = config.decimals;
      const daoTokenAccount = config.daoTokenAccount;
      
      // Calculate amount in raw units (respecting decimals)
      const rawAmount = new BN(amount * Math.pow(10, decimals));
      
      // Get user token accounts
      const senderTokenAccount = await getAssociatedTokenAddress(
        mint,
        this.wallet.publicKey
      );
      
      // Convert recipient string to PublicKey
      const recipientPubkey = new PublicKey(recipient);
      
      // Get recipient token account
      const recipientTokenAccount = await getAssociatedTokenAddress(
        mint,
        recipientPubkey
      );
      
      // Check if recipient token account exists, create if not
      try {
        await getAccount(this.connection, recipientTokenAccount);
      } catch (error) {
        // Token account doesn't exist, create it
        const ix = createAssociatedTokenAccountInstruction(
          this.wallet.publicKey,
          recipientTokenAccount,
          recipientPubkey,
          mint
        );
        
        const tx = new Transaction().add(ix);
        await this.wallet.sendTransaction(tx, this.connection);
      }
      
      // Transfer tokens
      const tx = await this.program.methods
        .transfer(rawAmount)
        .accounts({
          config: this.configPDA,
          sender: this.wallet.publicKey,
          senderTokenAccount: senderTokenAccount,
          recipientTokenAccount: recipientTokenAccount,
          daoTokenAccount: daoTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .transaction();
      
      const signature = await this.wallet.sendTransaction(tx, this.connection);
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error) {
      console.error("Error transferring tokens:", error);
      throw error;
    }
  }

  // Get DAO contributions
  async getDaoContributions(): Promise<number> {
    if (!this.program || !this.configPDA) {
      await this.initialize();
      if (!this.program || !this.configPDA) {
        return 0; // Return 0 if initialization fails
      }
    }
    
    try {
      const config = await this.program.account.config.fetch(this.configPDA as PublicKey);
      return config.daoContributions.toNumber() / Math.pow(10, config.decimals);
    } catch (error) {
      console.error("Error fetching DAO contributions:", error);
      return 0;
    }
  }

  // Update real estate
  async updateRealEstate(newCid: string, newValue: number): Promise<string> {
    if (!this.program || !this.wallet.publicKey || !this.configPDA) {
      throw new Error("Program not initialized or wallet not connected");
    }
    
    try {
      // Update real estate
      const tx = await this.program.methods
        .updateRealEstate(newCid, new BN(newValue))
        .accounts({
          config: this.configPDA,
          admin: this.wallet.publicKey
        })
        .transaction();
      
      const signature = await this.wallet.sendTransaction(tx, this.connection);
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error) {
      console.error("Error updating real estate:", error);
      throw error;
    }
  }

  // Get USDT balance of the user
  async getUserUsdtBalance(): Promise<number> {
    if (!this.program) {
      await this.initialize();
    }
    
    if (!this.wallet.publicKey) {
      return 0; // Return 0 if wallet is not connected
    }
    
    try {
      // Get USDT user token account
      const userUsdtAccount = await getAssociatedTokenAddress(
        USDT_MINT,
        this.wallet.publicKey
      );
      
      try {
        const account = await getAccount(this.connection, userUsdtAccount);
        return Number(account.amount) / Math.pow(10, 6); // USDT has 6 decimals
      } catch (error) {
        // Token account doesn't exist yet
        return 0;
      }
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
      return 0;
    }
  }
}

export default StablecoinService; 