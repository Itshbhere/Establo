'use client';

import { useEffect, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey, Transaction, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { StablecoinIdl } from '../idl/stablecoin';
import { STABLECOIN_PROGRAM_ID, STABLECOIN_CONFIG_SEED, TOKEN_DECIMALS } from '../constants';
import { toast } from '@/components/ui/use-toast';
import Decimal from 'decimal.js';

export const useStablecoin = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [configPDA, setConfigPDA] = useState<PublicKey | null>(null);
  const [mintAddress, setMintAddress] = useState<PublicKey | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const [reserves, setReserves] = useState<{ usdt: string, realEstate: string, isFullyBacked: boolean }>({
    usdt: '0',
    realEstate: '0',
    isFullyBacked: false
  });

  // Initialize the Anchor program
  const getProgram = () => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }
    
    const provider = new AnchorProvider(
      connection,
      wallet,
      { preflightCommitment: 'processed' }
    );
    
    return new Program(
      StablecoinIdl as any,
      STABLECOIN_PROGRAM_ID,
      provider
    );
  };

  // Find PDA for config account
  useEffect(() => {
    if (!wallet) return;

    (async () => {
      try {
        const [configPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from(STABLECOIN_CONFIG_SEED)],
          STABLECOIN_PROGRAM_ID
        );
        setConfigPDA(configPDA);

        // Get program instance
        const program = getProgram();
        
        // Fetch config account
        const config = await program.account.config.fetch(configPDA);
        setMintAddress(config.mint);
        
        // Update reserves info
        fetchReserves();
        
        // Get token balance if mint is defined
        if (config.mint) {
          await fetchBalance(config.mint);
        }
      } catch (error) {
        console.error('Error initializing stablecoin program:', error);
      }
    })();
  }, [wallet, connection]);

  // Refresh balance periodically or after transactions
  const fetchBalance = async (mintAddress: PublicKey) => {
    if (!wallet || !mintAddress) return;
    
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        wallet.publicKey
      );
      
      try {
        const accountInfo = await connection.getTokenAccountBalance(tokenAccount);
        const decimals = accountInfo.value.decimals;
        const amount = new Decimal(accountInfo.value.amount.toString())
          .div(new Decimal(10).pow(decimals))
          .toString();
        setBalance(amount);
      } catch (error) {
        // Token account doesn't exist yet
        setBalance('0');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Fetch reserve status
  const fetchReserves = async () => {
    if (!wallet || !configPDA) return;
    
    try {
      const program = getProgram();
      const reserveInfo = await program.methods.getReserves()
        .accounts({
          config: configPDA,
        })
        .view();
      
      if (reserveInfo) {
        const [usdtReserve, realEstateValue, isFullyBacked] = reserveInfo;
        setReserves({
          usdt: new Decimal(usdtReserve.toString())
            .div(new Decimal(10).pow(TOKEN_DECIMALS))
            .toString(),
          realEstate: new Decimal(realEstateValue.toString())
            .div(new Decimal(10).pow(TOKEN_DECIMALS))
            .toString(),
          isFullyBacked
        });
      }
    } catch (error) {
      console.error('Error fetching reserves:', error);
    }
  };

  // Mint tokens (admin only)
  const mintTokens = async (amount: string, recipient: PublicKey) => {
    if (!wallet || !configPDA || !mintAddress) {
      throw new Error('Wallet not connected or contract not initialized');
    }
    
    setLoading(true);
    
    try {
      const program = getProgram();
      
      // Calculate amount with decimals
      const mintAmount = new Decimal(amount)
        .mul(new Decimal(10).pow(TOKEN_DECIMALS))
        .floor()
        .toString();
      
      // Get or create recipient token account
      const recipientTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        recipient
      );
      
      // Build transaction
      const tx = await program.methods.mint(new anchor.BN(mintAmount))
        .accounts({
          config: configPDA,
          admin: wallet.publicKey,
          mint: mintAddress,
          recipientTokenAccount,
          mintAuthority: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .transaction();
      
      // Send transaction
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Success",
        description: `Minted ${amount} EUSD to ${recipient.toString().slice(0, 8)}...`,
      });
      
      // Refresh balances
      fetchBalance(mintAddress);
      fetchReserves();
    } catch (error: any) {
      console.error('Error minting tokens:', error);
      toast({
        title: "Error",
        description: `Failed to mint tokens: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Transfer tokens
  const transferTokens = async (amount: string, recipient: PublicKey) => {
    if (!wallet || !configPDA || !mintAddress) {
      throw new Error('Wallet not connected or contract not initialized');
    }
    
    setLoading(true);
    
    try {
      const program = getProgram();
      
      // Calculate amount with decimals
      const transferAmount = new Decimal(amount)
        .mul(new Decimal(10).pow(TOKEN_DECIMALS))
        .floor()
        .toString();
      
      // Get sender token account
      const senderTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        wallet.publicKey
      );
      
      // Get or create recipient token account
      const recipientTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        recipient
      );
      
      // Find DAO token account from config
      const config = await program.account.config.fetch(configPDA);
      const daoTokenAccount = config.daoTokenAccount;
      
      // Build transaction
      const tx = await program.methods.transfer(new anchor.BN(transferAmount))
        .accounts({
          config: configPDA,
          sender: wallet.publicKey,
          senderTokenAccount,
          recipientTokenAccount,
          daoTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .transaction();
      
      // Send transaction
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Success",
        description: `Transferred ${amount} EUSD to ${recipient.toString().slice(0, 8)}...`,
      });
      
      // Refresh balance
      fetchBalance(mintAddress);
    } catch (error: any) {
      console.error('Error transferring tokens:', error);
      toast({
        title: "Error",
        description: `Failed to transfer tokens: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Burn tokens (admin only)
  const burnTokens = async (amount: string) => {
    if (!wallet || !configPDA || !mintAddress) {
      throw new Error('Wallet not connected or contract not initialized');
    }
    
    setLoading(true);
    
    try {
      const program = getProgram();
      
      // Calculate amount with decimals
      const burnAmount = new Decimal(amount)
        .mul(new Decimal(10).pow(TOKEN_DECIMALS))
        .floor()
        .toString();
      
      // Get token account
      const tokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        wallet.publicKey
      );
      
      // Build transaction
      const tx = await program.methods.burn(new anchor.BN(burnAmount))
        .accounts({
          config: configPDA,
          admin: wallet.publicKey,
          mint: mintAddress,
          tokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .transaction();
      
      // Send transaction
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Success",
        description: `Burned ${amount} EUSD`,
      });
      
      // Refresh balances
      fetchBalance(mintAddress);
      fetchReserves();
    } catch (error: any) {
      console.error('Error burning tokens:', error);
      toast({
        title: "Error",
        description: `Failed to burn tokens: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    configPDA,
    mintAddress,
    balance,
    reserves,
    loading,
    mintTokens,
    transferTokens,
    burnTokens,
    fetchBalance,
    fetchReserves
  };
}; 