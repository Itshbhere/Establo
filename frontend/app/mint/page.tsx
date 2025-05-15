'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStablecoin } from '@/lib/hooks/useStablecoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { toast } from '@/components/ui/use-toast';
import Decimal from 'decimal.js';

export default function MintPage() {
  const { publicKey } = useWallet();
  const { balance, reserves, loading, mintTokens } = useStablecoin();
  const [amount, setAmount] = useState<string>('');

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

      await mintTokens(amount, publicKey);
      setAmount(''); // Reset after successful mint
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMax = () => {
    // In a real app, this would be based on USDT balance
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
              <span className="font-mono font-medium">{balance} ESTB</span>
            </div>
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
                  {reserves.isFullyBacked ? '✅ Fully Backed' : '⚠️ Partially Backed'}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="gradient"
            className="w-full"
            size="lg"
            onClick={handleMint}
            disabled={!publicKey || loading || !amount}
          >
            {loading ? 'Processing...' : !publicKey ? 'Connect Wallet First' : 'Mint Establo'}
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">
            <span className="gradient-text">How it Works</span>
          </h2>

          <div className="space-y-4">
            <div className="rounded-md bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-4">
              <h3 className="mb-2 text-lg font-medium">1. Deposit USDT</h3>
              <p className="text-sm text-establo-offwhite">
                Connect your wallet and deposit USDT to mint Establo tokens at a 1:1 ratio.
              </p>
            </div>

            <div className="rounded-md bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-4">
              <h3 className="mb-2 text-lg font-medium">2. Receive Establo Tokens</h3>
              <p className="text-sm text-establo-offwhite">
                Your ESTB tokens will be immediately added to your wallet and ready to use.
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