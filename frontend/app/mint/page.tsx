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
      setAmount('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-establo-black text-white flex flex-col items-center justify-center px-4">
      {/* Gradient Circles */}
      <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-establo-purple/20 blur-3xl z-0"></div>
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-establo-purple/20 blur-3xl z-0"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">
          Swap anytime,<br />anywhere.
        </h1>

        <div className="bg-[#111111] rounded-2xl p-2 shadow-xl">
          {/* Swap Box Container */}
          <div className="relative space-y-1">
            {/* Sell Section */}
            <div className="bg-[#1c1c1c] rounded-xl p-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Sell</span>
              </div>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-2xl font-semibold placeholder:text-gray-500 outline-none w-full"
                />
                <Button
                  variant="outline"
                  className="bg-[#2a2a2a] text-white ml-2 rounded-full px-4 py-1 text-sm flex items-center gap-1"
                >
                  <img src="/icons/eth.svg" alt="ETH" className="w-5 h-5" />
                  ETH
                </Button>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                ${Number(amount) * 2500 ? (Number(amount) * 2500).toLocaleString() : 0}
              </div>
            </div>

            {/* Arrow - perfectly between */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl z-10">
              <div className="bg-[#1c1c1c] p-2 rounded-2xl border-4 border-[#111111] shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-down-icon lucide-arrow-down">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Buy Section */}
            <div className="bg-[#131313] rounded-xl p-4 border border-white/10">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Buy</span>
              </div>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  placeholder="0"
                  value={amount ? (Number(amount) * 2500).toFixed(0) : ''}
                  readOnly
                  className="bg-transparent text-2xl font-semibold placeholder:text-gray-500 outline-none w-full"
                />
                <Button
                  variant="outline"
                  className="bg-[#2a2a2a] text-white ml-2 rounded-full px-4 py-1 text-sm flex items-center gap-1"
                >
                  <img src="/icons/usdc.svg" alt="USDC" className="w-5 h-5" />
                  USDC
                </Button>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                ${Number(amount) * 2500 ? (Number(amount) * 2500).toLocaleString() : 0}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleMint}
            disabled={!publicKey || loading || !amount}
            className="w-full mt-1 gradient text-white font-semibold rounded-xl py-6 text-center"
          >
            {loading ? 'Processing...' : !publicKey ? 'Connect Wallet First' : 'Get started'}
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center max-w-sm">
          The largest onchain marketplace. Buy and sell crypto on Ethereum and 12+ other chains.
        </p>
      </div>
    </div>
  );
}
