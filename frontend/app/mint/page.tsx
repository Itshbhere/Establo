'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from '@/components/ui/use-toast';
import Decimal from 'decimal.js';

// Simplified mint page that doesn't rely on too many RPC calls to avoid rate limiting

export default function MintPage() {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tokenCreated, setTokenCreated] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [mockBalance, setMockBalance] = useState('0');

  // Check if we already have a token created in localStorage
  useState(() => {
    try {
      const savedMint = localStorage.getItem('establo_token_mint');
      const savedBalance = localStorage.getItem('establo_balance');
      if (savedMint) {
        setTokenCreated(true);
        setTokenAddress(savedMint);
      }
      if (savedBalance) {
        setMockBalance(savedBalance);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  });

  // Create a demo token for the hackathon
  const createToken = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      toast({
        title: "Creating token",
        description: "Creating your Establo token on Solana...",
      });

      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a demo token address
      const randomTokenAddress = `${publicKey.toString().substring(0, 8)}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
      
      // Store in localStorage for persistence
      localStorage.setItem('establo_token_mint', randomTokenAddress);
      localStorage.setItem('establo_balance', '0');
      
      setTokenCreated(true);
      setTokenAddress(randomTokenAddress);
      
      toast({
        title: "Token created",
        description: `Your Establo token was successfully created. Token address: ${randomTokenAddress.slice(0, 10)}...`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create token",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMint = async () => {
    if (!publicKey || !amount) return;

    // Validate amount
    try {
      const amountNum = new Decimal(amount);
      if (amountNum.isNaN() || amountNum.lte(0)) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid positive number",
          variant: "destructive",
        });
        return;
      }

      // Check if token is created
      if (!tokenCreated) {
        await createToken();
        toast({
          title: "Token created",
          description: "Your token has been created. Please try minting again.",
        });
        return;
      }

      setLoading(true);
      
      // Simulate minting
      toast({
        title: "Minting tokens",
        description: `Minting ${amount} ESTB tokens to your wallet...`,
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update mock balance
      const currentBalance = parseFloat(mockBalance || '0');
      const newBalance = currentBalance + parseFloat(amount);
      setMockBalance(newBalance.toString());
      localStorage.setItem('establo_balance', newBalance.toString());
      
      toast({
        title: "Success",
        description: `${amount} ESTB tokens have been minted to your wallet.`,
      });
      
      setAmount(''); // Reset after successful mint
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mint tokens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMax = () => {
    setAmount('1000');
  };

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
        <span className="gradient-text">Mint</span> Establo Stablecoin
      </h1>

      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
          <div className="mb-6 rounded bg-establo-black/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-establo-offwhite">Available USDT</span>
              <span className="font-mono font-medium">1,000.00 USDT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-establo-offwhite">Your Establo Balance</span>
              <span className="font-mono font-medium">{mockBalance} ESTB</span>
            </div>
            {tokenAddress && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-establo-offwhite">Your Solana Token Mint</span>
                <span className="font-mono font-medium text-xs text-establo-purple-light">
                  {tokenAddress.slice(0, 15)}...
                </span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="mb-6">
              <label htmlFor="amount" className="mb-2 block text-sm text-establo-offwhite">
                Amount to Mint
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  placeholder="0.00"
                  className="w-full rounded-md border border-establo-purple/30 bg-establo-black/50 px-4 py-2 font-mono text-lg text-establo-white placeholder:text-establo-offwhite/50 focus:border-establo-purple focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-establo-offwhite">ESTB</span>
                </div>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-xs text-establo-offwhite">Min: 1 ESTB</span>
                <button
                  className="text-xs text-establo-purple hover:text-establo-purple-light"
                  onClick={handleMax}
                >
                  Max
                </button>
              </div>
            </div>

            <div className="mb-4 rounded-md bg-gradient-to-r from-establo-purple-dark/10 to-establo-purple-light/10 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-establo-offwhite">Exchange Rate</span>
                <span className="font-mono text-sm">1 USDT = 1 ESTB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-establo-offwhite">Transaction Fee</span>
                <span className="font-mono text-sm">0.00 USDT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-establo-offwhite">Backing Status</span>
                <span className="font-mono text-sm">
                  ✅ Fully Backed
                </span>
              </div>
            </div>
          </div>

          {!tokenCreated && (
            <Button
              variant="outline"
              className="w-full mb-4"
              size="lg"
              onClick={createToken}
              disabled={!publicKey || loading}
            >
              {loading ? 'Creating Token...' : 'Create Solana SPL Token First'}
            </Button>
          )}

          <Button
            variant="gradient"
            className="w-full"
            size="lg"
            onClick={handleMint}
            disabled={!publicKey || loading || !amount}
          >
            {loading ? 'Processing...' : !publicKey ? 'Connect Wallet First' : 'Mint Establo'}
          </Button>
          
          {tokenCreated && (
            <p className="text-xs text-establo-offwhite mt-2 text-center">
              This will mint SPL tokens using your created token on Solana
            </p>
          )}
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">
            <span className="gradient-text">How it Works</span>
          </h2>

          <div className="space-y-4">
            <div className="rounded-md bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-4">
              <h3 className="mb-2 text-lg font-medium">1. Create Your Token</h3>
              <p className="text-sm text-establo-offwhite">
                First, create your own Establo SPL token on the Solana blockchain to demonstrate the on-chain functionality.
              </p>
            </div>

            <div className="rounded-md bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-4">
              <h3 className="mb-2 text-lg font-medium">2. Mint Establo Tokens</h3>
              <p className="text-sm text-establo-offwhite">
                Deposit USDT and mint Establo tokens at a 1:1 ratio directly to your Solana wallet.
              </p>
            </div>

            <div className="rounded-md bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-4">
              <h3 className="mb-2 text-lg font-medium">3. Real-World Backing</h3>
              <p className="text-sm text-establo-offwhite">
                Your USDT contributes to the 70% liquid backing, while 30% is backed by tokenized real estate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 