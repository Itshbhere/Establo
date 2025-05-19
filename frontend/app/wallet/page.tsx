'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import StablecoinService from '@/src/services/stablecoin-service';
import { StatCard } from '@/components/ui/StatCards';

export default function WalletPage() {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [loading, setLoading] = useState<boolean>(true);
  const [stablecoinService, setStablecoinService] = useState<StablecoinService | null>(null);
  const [eusdBalance, setEusdBalance] = useState<string>('0');
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);

  // Initialize the stablecoin service when the wallet is connected
  useEffect(() => {
    const initService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create service regardless of wallet connection
        const service = new StablecoinService(wallet);
        setStablecoinService(service);
        
        // Try to load initial data
        await fetchBalances(service);
      } catch (error) {
        console.error("Failed to initialize service:", error);
        setError("Failed to connect to Solana network. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    initService();
  }, [wallet, publicKey]);

  const fetchBalances = async (service: StablecoinService) => {
    try {
      // Fetch EUSD balance
      const eusdBalance = await service.getUserBalance();
      setEusdBalance(eusdBalance.toString());
      
      // Fetch USDT balance
      const usdtBalance = await service.getUserUsdtBalance();
      setUsdtBalance(usdtBalance.toString());
    } catch (error) {
      console.error("Failed to fetch balances:", error);
      setError("Failed to fetch wallet balances. Please try again later.");
    }
  };

  // Format number with commas and specified decimal places
  const formatNumber = (value: string, decimals: number = 2): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const handleRefresh = async () => {
    if (!stablecoinService) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await fetchBalances(stablecoinService);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
        <span className="gradient-text">Wallet</span> Overview
      </h1>

      {!publicKey ? (
        <div className="mx-auto max-w-xl text-center p-8 rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5">
          <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-establo-offwhite mb-6">
            Connect your Solana wallet to view your balances and interact with EUSD stablecoin.
          </p>
          <Button
            variant="gradient"
            size="lg"
            disabled={true}
          >
            Connect Wallet to Continue
          </Button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-establo-purple border-t-transparent rounded-full mb-4"></div>
          <p className="text-establo-offwhite">Loading your wallet data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-establo-offwhite mb-4">{error}</p>
          <Button 
            variant="gradient" 
            onClick={handleRefresh}
            className="mx-auto"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">
          {/* Wallet Address */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center rounded-full bg-establo-black/50 px-4 py-2 border border-establo-purple/20">
              <div className="h-8 w-8 rounded-full bg-purple-gradient flex items-center justify-center mr-3">
                <span className="text-xs font-semibold">{publicKey.toString().substring(0, 2)}</span>
              </div>
              <span className="font-mono text-sm">
                {publicKey.toString().substring(0, 10)}...
                {publicKey.toString().substring(publicKey.toString().length - 6)}
              </span>
            </div>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2">
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">EUSD Balance</h2>
                <div className="h-10 w-10 rounded-full bg-establo-purple/10 flex items-center justify-center">
                  <span className="text-xs font-bold">EUSD</span>
                </div>
              </div>
              <div className="font-mono text-3xl mb-4">{formatNumber(eusdBalance, 6)} EUSD</div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/transfer" className="w-full">
                  <Button variant="secondary" className="w-full" size="sm">Transfer</Button>
                </Link>
                <Link href="/burn" className="w-full">
                  <Button variant="outline" className="w-full" size="sm">Redeem</Button>
                </Link>
              </div>
            </div>
            
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">USDT Balance</h2>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold">USDT</span>
                </div>
              </div>
              <div className="font-mono text-3xl mb-4">{formatNumber(usdtBalance, 6)} USDT</div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/mint" className="w-full">
                  <Button variant="gradient" className="w-full" size="sm">Mint EUSD</Button>
                </Link>
                <Button variant="outline" className="w-full" size="sm" disabled>Get USDT</Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link href="/mint" className="w-full">
                <Button variant="gradient" className="w-full h-16">
                  <div className="flex flex-col">
                    <span className="font-bold">Mint EUSD</span>
                    <span className="text-xs">USDT → EUSD</span>
                  </div>
                </Button>
              </Link>
              <Link href="/burn" className="w-full">
                <Button variant="gradient" className="w-full h-16">
                  <div className="flex flex-col">
                    <span className="font-bold">Redeem EUSD</span>
                    <span className="text-xs">EUSD → USDT</span>
                  </div>
                </Button>
              </Link>
              <Link href="/transfer" className="w-full">
                <Button variant="gradient" className="w-full h-16">
                  <div className="flex flex-col">
                    <span className="font-bold">Transfer EUSD</span>
                    <span className="text-xs">Send to Others</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Transaction History - Placeholder */}
          <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
            <div className="py-8 text-center text-establo-offwhite">
              <p className="mb-2">Connect to a Solana block explorer to view transaction history</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://explorer.solana.com/address/${publicKey.toString()}?cluster=devnet`, '_blank')}
              >
                View on Explorer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 