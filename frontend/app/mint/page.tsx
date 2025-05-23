'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from '@/components/ui/use-toast';
import Decimal from 'decimal.js';
import StablecoinService from '@/src/services/stablecoin-service';
import { isLessThanOrEqual, toNumber, formatDecimal, isGreaterThan } from '@/src/utils/decimal-helpers';

// Simplified mint page that doesn't rely on too many RPC calls to avoid rate limiting

export default function MintPage() {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [stablecoinService, setStablecoinService] = useState<StablecoinService | null>(null);
  const [userBalance, setUserBalance] = useState<string>('0');
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [reserves, setReserves] = useState<{ usdt: number, realEstate: number } | null>(null);

  // Initialize the stablecoin service when the wallet is connected
  useEffect(() => {
    const initService = async () => {
      if (wallet && publicKey) {
        setConnecting(true);
        try {
          const service = new StablecoinService(wallet);
          setStablecoinService(service);
          
          // Load initial data
          await fetchUserBalance(service);
          await fetchUsdtBalance(service);
          await fetchReserves(service);
        } catch (error) {
          console.error("Failed to initialize service:", error);
          toast({
            title: "Connection Error",
            description: "Failed to connect to Solana network. Please try again.",
            variant: "destructive",
          });
        } finally {
          setConnecting(false);
        }
      }
    };
    
    initService();
  }, [wallet, publicKey]);

  const fetchUserBalance = async (service: StablecoinService) => {
    try {
      const balance = await service.getUserBalance();
      setUserBalance(balance.toString());
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  };

  const fetchUsdtBalance = async (service: StablecoinService) => {
    try {
      const balance = await service.getUserUsdtBalance();
      setUsdtBalance(balance.toString());
    } catch (error) {
      console.error("Failed to fetch USDT balance:", error);
    }
  };

  const fetchReserves = async (service: StablecoinService) => {
    try {
      const reserveData = await service.getReserves();
      setReserves(reserveData);
    } catch (error) {
      console.error("Failed to fetch reserves:", error);
    }
  };

  const handleMint = async () => {
    if (!publicKey || !amount || !stablecoinService) return;

    // Validate amount
    try {
      const amountNum = new Decimal(amount);
      if (amountNum.isNaN() || isLessThanOrEqual(amountNum, 0)) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid positive number",
          variant: "destructive",
        });
        return;
      }

      // Check if user has enough USDT
      const usdtBalanceNum = new Decimal(usdtBalance);
      if (isGreaterThan(amountNum, usdtBalanceNum)) {
        toast({
          title: "Insufficient USDT",
          description: "You don't have enough USDT to mint this amount",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      
      // Mint tokens
      toast({
        title: "Minting tokens",
        description: `Minting ${amount} EUSD tokens to your wallet...`,
      });
      
      try {
        const tx = await stablecoinService.mint(toNumber(amountNum));
        
        toast({
          title: "Success",
          description: `${amount} EUSD tokens have been minted to your wallet. Transaction: ${tx.slice(0, 8)}...`,
        });
        
        // Refresh user balance
        fetchUserBalance(stablecoinService);
        fetchUsdtBalance(stablecoinService);
        fetchReserves(stablecoinService);
        
        setAmount(''); // Reset after successful mint
      } catch (error: any) {
        console.error("Mint error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to mint tokens. Check if you have approved USDT for the contract.",
          variant: "destructive",
        });
      }
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
    if (usdtBalance && parseFloat(usdtBalance) > 0) {
      setAmount(usdtBalance);
    }
  };

  // Calculate backing percentages
  const getBackingPercentages = () => {
    if (!reserves) return { usdt: 70, realEstate: 30 }; // Default values
    
    const total = reserves.usdt + reserves.realEstate;
    if (total === 0) return { usdt: 70, realEstate: 30 };
    
    return {
      usdt: Math.round((reserves.usdt / total) * 100),
      realEstate: Math.round((reserves.realEstate / total) * 100)
    };
  };

  const backingPercentages = getBackingPercentages();

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
        <span className="gradient-text">Mint</span> EUSD Stablecoin
      </h1>

      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
          {!publicKey ? (
            <div className="text-center py-8">
              <p className="mb-6 text-establo-offwhite">Connect your wallet to mint EUSD stablecoin</p>
              <Button
                variant="gradient"
                className="w-full max-w-xs mx-auto"
                size="lg"
                disabled={true}
              >
                Connect Wallet First
              </Button>
            </div>
          ) : connecting ? (
            <div className="text-center py-8">
              <div className="animate-spin h-10 w-10 border-4 border-establo-purple border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-establo-offwhite">Connecting to Solana network...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded bg-establo-black/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-establo-offwhite">Available USDT</span>
                  <span className="font-mono font-medium">{parseFloat(usdtBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})} USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-establo-offwhite">Your EUSD Balance</span>
                  <span className="font-mono font-medium">{parseFloat(userBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})} EUSD</span>
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm text-establo-offwhite">EUSD</span>
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-xs text-establo-offwhite">Min: 1 EUSD</span>
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
                    <span className="font-mono text-sm">1 USDT = 1 EUSD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-establo-offwhite">Transaction Fee</span>
                    <span className="font-mono text-sm">~0.00005 SOL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-establo-offwhite">Backing Ratio</span>
                    <span className="font-mono text-sm">
                      {backingPercentages.usdt}% USDT / {backingPercentages.realEstate}% Real Estate
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-establo-offwhite">Backing Status</span>
                    <span className="font-mono text-sm">
                      ✅ Fully Backed
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="gradient"
                className="w-full"
                size="lg"
                onClick={handleMint}
                disabled={loading || !amount}
              >
                {loading ? 'Processing...' : 'Mint EUSD'}
              </Button>
            </>
          )}
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">
            How Minting Works
          </h2>
          <p className="mb-4 text-establo-offwhite">
            When you mint EUSD tokens, the contract ensures that your tokens are fully backed by our reserve system:
          </p>
          <ul className="list-disc pl-5 text-establo-offwhite space-y-2">
            <li><strong>70% USDT Backing:</strong> Your minted tokens are backed by 70% USDT, ensuring immediate liquidity and stability.</li>
            <li><strong>30% Real Estate Backing:</strong> The remaining 30% is backed by tokenized real estate assets, providing additional value and stability from real-world assets.</li>
            <li><strong>1:1 Exchange Rate:</strong> Each EUSD token is minted at a 1:1 exchange rate with USDT, maintaining stable value.</li>
            <li><strong>Fully Redeemable:</strong> You can redeem your EUSD tokens back to USDT at any time with zero fees.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 