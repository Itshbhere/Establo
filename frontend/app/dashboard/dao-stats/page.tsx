'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import StablecoinService from '@/src/services/stablecoin-service';
import { StatCard } from '@/components/ui/StatCards';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DaoStatsPage() {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [stablecoinService, setStablecoinService] = useState<StablecoinService | null>(null);
  const [daoContributions, setDaoContributions] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [reserves, setReserves] = useState<{ usdt: number, realEstate: number } | null>(null);
  const [realEstate, setRealEstate] = useState<{ cid: string, value: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
        await fetchData(service);
      } catch (error) {
        console.error("Failed to initialize service:", error);
        setError("Failed to connect to Solana network. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    initService();
  }, [wallet, publicKey]);

  const fetchData = async (service: StablecoinService) => {
    try {
      // Fetch DAO contributions
      const contributions = await service.getDaoContributions();
      setDaoContributions(contributions);
      
      // Fetch total supply
      const supply = await service.getTotalSupply();
      setTotalSupply(supply);
      
      // Fetch reserves
      const reserveData = await service.getReserves();
      setReserves(reserveData);
      
      // Fetch real estate details
      const estateData = await service.getRealEstateDetails();
      setRealEstate(estateData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to fetch blockchain data. Please try again later.");
    }
  };

  const handleRefresh = async () => {
    if (!stablecoinService) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await fetchData(stablecoinService);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
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

  // Format number with commas and specified decimal places
  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
        <span className="gradient-text">DAO & Backing</span> Statistics
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-establo-purple border-t-transparent rounded-full mb-4"></div>
          <p className="text-establo-offwhite">Loading blockchain data...</p>
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
        <>
          {/* Stats Overview */}
          <div className="grid gap-6 mb-12 md:grid-cols-4">
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <h3 className="text-sm font-medium text-establo-offwhite">Total Supply</h3>
              </div>
              <p className="text-3xl font-bold text-blue-500">{formatNumber(totalSupply)} EUSD</p>
            </div>
            
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-establo-purple"></div>
                <h3 className="text-sm font-medium text-establo-offwhite">DAO Contributions</h3>
              </div>
              <p className="text-3xl font-bold text-establo-purple">{formatNumber(daoContributions)} EUSD</p>
            </div>
            
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <h3 className="text-sm font-medium text-establo-offwhite">USDT Reserve</h3>
              </div>
              <p className="text-3xl font-bold text-green-500">{formatNumber(reserves?.usdt || 0)} USDT</p>
            </div>
            
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <h3 className="text-sm font-medium text-establo-offwhite">Real Estate Value</h3>
              </div>
              <p className="text-3xl font-bold text-amber-500">${formatNumber(realEstate?.value || 0)}</p>
            </div>
          </div>

          {/* Backing Ratio Card */}
          <div className="mb-12 overflow-hidden rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Backing Ratio</h2>
            
            <div className="mb-6">
              <div className="mb-2 flex justify-between">
                <span className="text-establo-offwhite">USDT Backing</span>
                <span className="font-medium">{backingPercentages.usdt}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-establo-black/50">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-establo-purple to-establo-purple-light" 
                  style={{ width: `${backingPercentages.usdt}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="mb-2 flex justify-between">
                <span className="text-establo-offwhite">Real Estate Backing</span>
                <span className="font-medium">{backingPercentages.realEstate}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-establo-black/50">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-establo-purple-dark to-establo-purple" 
                  style={{ width: `${backingPercentages.realEstate}%` }}
                ></div>
              </div>
            </div>

            <p className="mt-4 text-sm text-establo-offwhite">
              EUSD maintains a target backing ratio of 70% USDT and 30% tokenized real estate. 
              This hybrid backing model ensures both stability and growth potential.
            </p>
          </div>

          {/* Real Estate Card */}
          <div className="mb-12 overflow-hidden rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Real Estate Backing</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="aspect-video overflow-hidden rounded-lg bg-establo-black/50">
                  {/* Link to IPFS content if available */}
                  {realEstate?.cid ? (
                    <a 
                      href={realEstate.cid.startsWith('ipfs://') ? 
                        `https://gateway.ipfs.io/ipfs/${realEstate.cid.slice(7)}` : 
                        realEstate.cid} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-light/20 hover:from-establo-purple-dark/30 hover:to-establo-purple-light/30 transition-all"
                    >
                      <span className="text-center text-establo-offwhite">View Real Estate Asset Documentation</span>
                    </a>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-light/20">
                      <span className="text-center text-establo-offwhite">Real Estate Asset</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">Property Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-establo-offwhite">Asset Value:</span>
                    <span className="font-medium">${realEstate?.value?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-establo-offwhite">Tokenization Status:</span>
                    <span className="font-medium text-establo-purple">Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-establo-offwhite">Asset Type:</span>
                    <span className="font-medium">Commercial Property</span>
                  </div>
                  {realEstate?.cid && (
                    <div className="flex justify-between">
                      <span className="text-establo-offwhite">Content ID:</span>
                      <span className="font-mono text-xs text-establo-purple-light truncate max-w-[200px]" title={realEstate.cid}>
                        {realEstate.cid}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="mt-4 text-sm text-establo-offwhite">
                  This property contributes to the 30% real estate backing of EUSD stablecoin, 
                  providing price stability and growth potential through real-world asset integration.
                </p>
              </div>
            </div>
          </div>

          {/* DAO Treasury */}
          <div className="overflow-hidden rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">DAO Treasury</h2>
            
            <div className="mb-6">
              <div className="mb-2 flex justify-between">
                <span className="text-establo-offwhite">Total Contributions</span>
                <span className="font-medium">{formatNumber(daoContributions)} EUSD</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-establo-black/50">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-establo-purple to-establo-purple-light" 
                  style={{ width: `${Math.min((daoContributions / 100000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-establo-offwhite">
                <span>0 EUSD</span>
                <span>100,000 EUSD (Goal)</span>
              </div>
            </div>
            
            <p className="mb-4 text-sm text-establo-offwhite">
              The Establo DAO treasury collects 0.5% of all transfer fees. These contributions are used to:
            </p>
            
            <ul className="list-disc pl-5 text-establo-offwhite space-y-1 text-sm">
              <li>Acquire additional real estate assets</li>
              <li>Provide liquidity in DeFi protocols</li>
              <li>Fund ecosystem development and growth</li>
              <li>Manage and maintain existing real estate holdings</li>
            </ul>
            
            <div className="mt-6 flex justify-center">
              <Link href="/transfer" className="inline-block">
                <Button variant="gradient">Make a Transfer to Support the DAO</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 