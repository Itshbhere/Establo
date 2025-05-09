'use client';

import { useEffect, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey, Keypair, Transaction, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { RWAMarketplaceIdl } from '../idl/rwa-marketplace';
import { 
  RWA_MARKETPLACE_PROGRAM_ID, 
  STABLECOIN_PROGRAM_ID,
  MARKETPLACE_SEED, 
  PROPERTY_SEED, 
  TOKEN_DECIMALS,
  AssetStatus
} from '../constants';
import { toast } from '@/components/ui/use-toast';
import Decimal from 'decimal.js';

// Metadata program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export interface Property {
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

export const useRWAMarketplace = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [marketplacePDA, setMarketplacePDA] = useState<PublicKey | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [liquidationThreshold, setLiquidationThreshold] = useState<number>(90);

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
      RWAMarketplaceIdl as any,
      RWA_MARKETPLACE_PROGRAM_ID,
      provider
    );
  };

  // Find PDA for marketplace account
  useEffect(() => {
    if (!wallet) return;

    (async () => {
      try {
        const [marketplacePDA] = PublicKey.findProgramAddressSync(
          [Buffer.from(MARKETPLACE_SEED)],
          RWA_MARKETPLACE_PROGRAM_ID
        );
        setMarketplacePDA(marketplacePDA);

        // Get program instance
        const program = getProgram();
        
        // Fetch marketplace account
        try {
          const marketplace = await program.account.marketplace.fetch(marketplacePDA);
          
          // Check if wallet is admin
          setIsAdmin(marketplace.admin.equals(wallet.publicKey));
          
          // Set liquidation threshold
          setLiquidationThreshold(marketplace.liquidationThreshold);
          
          // Fetch properties
          await fetchProperties();
        } catch (e) {
          console.log('Marketplace not initialized yet or error fetching:', e);
        }
      } catch (error) {
        console.error('Error initializing RWA marketplace program:', error);
      }
    })();
  }, [wallet, connection]);

  // Fetch all RWA properties
  const fetchProperties = async () => {
    if (!wallet || !connection) return;
    
    try {
      setLoading(true);
      const program = getProgram();
      
      // Get all property accounts
      const accounts = await connection.getProgramAccounts(RWA_MARKETPLACE_PROGRAM_ID, {
        filters: [
          {
            memcmp: {
              offset: 8, // Skip the discriminator
              bytes: '3YGXqNveAS9ZEG1mQXGMrpRzrCGfJrLEVf2zzSS9rJwt', // Filter by marketplace PDA (this should be more specific in a real app)
            },
          },
        ],
      });
      
      // Parse accounts
      const properties: Property[] = [];
      for (const account of accounts) {
        try {
          // Check if this is a property account by its size or structure
          if (account.account.data.length > 200) { // Rough check, should be more precise
            const property = await program.account.realEstateProperty.fetch(account.pubkey);
            
            properties.push({
              publicKey: account.pubkey,
              owner: property.owner,
              mint: property.mint,
              value: new Decimal(property.value.toString())
                .div(new Decimal(10).pow(TOKEN_DECIMALS))
                .toString(),
              initialValue: new Decimal(property.initialValue.toString())
                .div(new Decimal(10).pow(TOKEN_DECIMALS))
                .toString(),
              lastValuationDate: property.lastValuationDate,
              location: property.location,
              details: property.details,
              status: property.status.listed 
                ? AssetStatus.LISTED 
                : property.status.atRisk 
                  ? AssetStatus.AT_RISK 
                  : AssetStatus.LIQUIDATED,
              liquidationThreshold: property.liquidationThreshold
            });
          }
        } catch (error) {
          console.error('Error parsing property account:', error);
        }
      }
      
      setProperties(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // List a new RWA property
  const listProperty = async (
    name: string,
    symbol: string,
    value: string,
    location: string,
    details: string,
    imageUrl: string,
    customLiquidationThreshold?: number
  ) => {
    if (!wallet || !marketplacePDA) {
      throw new Error('Wallet not connected or marketplace not initialized');
    }
    
    setLoading(true);
    
    try {
      const program = getProgram();
      
      // Calculate value with decimals
      const assetValue = new Decimal(value)
        .mul(new Decimal(10).pow(TOKEN_DECIMALS))
        .floor()
        .toString();
      
      // Create a new mint for the property NFT
      const mintKeypair = Keypair.generate();
      
      // Find property PDA
      const [propertyPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(PROPERTY_SEED), mintKeypair.publicKey.toBuffer()],
        RWA_MARKETPLACE_PROGRAM_ID
      );
      
      // Token account for owner
      const tokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        wallet.publicKey
      );
      
      // Metadata accounts
      const metadataAddress = (await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      ))[0];
      
      const masterEditionAddress = (await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
          Buffer.from('edition'),
        ],
        TOKEN_METADATA_PROGRAM_ID
      ))[0];
      
      // Create metadata URI
      const metadataUri = JSON.stringify({
        name,
        symbol,
        description: details,
        image: imageUrl,
        attributes: [
          {
            trait_type: "Location",
            value: location
          },
          {
            trait_type: "Value",
            value: `$${value}`
          }
        ]
      });
      
      // Find stablecoin config PDA
      const [stablecoinConfigPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('config')],
        STABLECOIN_PROGRAM_ID
      );
      
      // Get optional liquidation threshold
      const thresholdOption = customLiquidationThreshold 
        ? { some: customLiquidationThreshold } 
        : { none: {} };
      
      // Build transaction
      const tx = await program.methods.listRwa(
        metadataUri,
        name,
        symbol,
        new anchor.BN(assetValue),
        location,
        details,
        thresholdOption
      )
        .accounts({
          marketplace: marketplacePDA,
          property: propertyPDA,
          owner: wallet.publicKey,
          mint: mintKeypair.publicKey,
          tokenAccount,
          metadata: metadataAddress,
          masterEdition: masterEditionAddress,
          stablecoinConfig: stablecoinConfigPDA,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          metadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .signers([mintKeypair])
        .transaction();
      
      // Send transaction
      const signature = await wallet.sendTransaction(tx, connection, { signers: [mintKeypair] });
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Success",
        description: `Listed property "${name}" for $${value}`,
      });
      
      // Refresh properties
      fetchProperties();
    } catch (error: any) {
      console.error('Error listing property:', error);
      toast({
        title: "Error",
        description: `Failed to list property: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update property valuation
  const updateValuation = async (propertyPubkey: PublicKey, newValue: string) => {
    if (!wallet || !marketplacePDA) {
      throw new Error('Wallet not connected or marketplace not initialized');
    }
    
    setLoading(true);
    
    try {
      const program = getProgram();
      
      // Calculate value with decimals
      const valueAmount = new Decimal(newValue)
        .mul(new Decimal(10).pow(TOKEN_DECIMALS))
        .floor()
        .toString();
      
      // Find property data
      const property = await program.account.realEstateProperty.fetch(propertyPubkey);
      
      // Find stablecoin config PDA
      const [stablecoinConfigPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('config')],
        STABLECOIN_PROGRAM_ID
      );
      
      // Build transaction
      const tx = await program.methods.updateValuation(new anchor.BN(valueAmount))
        .accounts({
          marketplace: marketplacePDA,
          property: propertyPubkey,
          owner: property.owner,
          authority: wallet.publicKey,
          stablecoinConfig: stablecoinConfigPDA,
        })
        .transaction();
      
      // Send transaction
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Success",
        description: `Updated property valuation to $${newValue}`,
      });
      
      // Refresh properties
      fetchProperties();
    } catch (error: any) {
      console.error('Error updating valuation:', error);
      toast({
        title: "Error",
        description: `Failed to update valuation: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Transfer property to new owner
  const transferProperty = async (propertyPubkey: PublicKey, newOwner: PublicKey) => {
    if (!wallet || !marketplacePDA) {
      throw new Error('Wallet not connected or marketplace not initialized');
    }
    
    setLoading(true);
    
    try {
      const program = getProgram();
      
      // Find property data
      const property = await program.account.realEstateProperty.fetch(propertyPubkey);
      
      // Get token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(
        property.mint,
        wallet.publicKey
      );
      
      const toTokenAccount = await getAssociatedTokenAddress(
        property.mint,
        newOwner
      );
      
      // Build transaction
      const tx = await program.methods.transferRwa()
        .accounts({
          property: propertyPubkey,
          currentOwner: wallet.publicKey,
          newOwner,
          fromTokenAccount,
          toTokenAccount,
          mint: property.mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .transaction();
      
      // Send transaction
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Success",
        description: `Transferred property to ${newOwner.toString().slice(0, 8)}...`,
      });
      
      // Refresh properties
      fetchProperties();
    } catch (error: any) {
      console.error('Error transferring property:', error);
      toast({
        title: "Error",
        description: `Failed to transfer property: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Liquidate an at-risk property (admin only)
  const liquidateProperty = async (propertyPubkey: PublicKey) => {
    if (!wallet || !marketplacePDA || !isAdmin) {
      throw new Error('Wallet not connected, marketplace not initialized, or not admin');
    }
    
    setLoading(true);
    
    try {
      const program = getProgram();
      
      // Find property data
      const property = await program.account.realEstateProperty.fetch(propertyPubkey);
      
      // Get token accounts
      const ownerTokenAccount = await getAssociatedTokenAddress(
        property.mint,
        property.owner
      );
      
      const adminTokenAccount = await getAssociatedTokenAddress(
        property.mint,
        wallet.publicKey
      );
      
      // Find stablecoin config PDA
      const [stablecoinConfigPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('config')],
        STABLECOIN_PROGRAM_ID
      );
      
      // Build transaction
      const tx = await program.methods.liquidateRwa()
        .accounts({
          marketplace: marketplacePDA,
          property: propertyPubkey,
          admin: wallet.publicKey,
          owner: property.owner,
          ownerTokenAccount,
          adminTokenAccount,
          mint: property.mint,
          stablecoinConfig: stablecoinConfigPDA,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .transaction();
      
      // Send transaction
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Success",
        description: `Liquidated property`,
      });
      
      // Refresh properties
      fetchProperties();
    } catch (error: any) {
      console.error('Error liquidating property:', error);
      toast({
        title: "Error",
        description: `Failed to liquidate property: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set the default liquidation threshold (admin only)
  const setDefaultLiquidationThreshold = async (threshold: number) => {
    if (!wallet || !marketplacePDA || !isAdmin) {
      throw new Error('Wallet not connected, marketplace not initialized, or not admin');
    }
    
    if (threshold < 1 || threshold > 100) {
      throw new Error('Threshold must be between 1 and 100');
    }
    
    setLoading(true);
    
    try {
      const program = getProgram();
      
      // Build transaction
      const tx = await program.methods.setLiquidationThreshold(threshold)
        .accounts({
          marketplace: marketplacePDA,
          admin: wallet.publicKey,
        })
        .transaction();
      
      // Send transaction
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setLiquidationThreshold(threshold);
      
      toast({
        title: "Success",
        description: `Updated liquidation threshold to ${threshold}%`,
      });
    } catch (error: any) {
      console.error('Error setting liquidation threshold:', error);
      toast({
        title: "Error",
        description: `Failed to set liquidation threshold: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    marketplacePDA,
    properties,
    loading,
    isAdmin,
    liquidationThreshold,
    fetchProperties,
    listProperty,
    updateValuation,
    transferProperty,
    liquidateProperty,
    setDefaultLiquidationThreshold
  };
}; 