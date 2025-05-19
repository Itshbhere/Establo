'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import StablecoinService from '@/src/services/stablecoin-service';
import Link from 'next/link';

export default function DaoImpactCard() {
  const wallet = useWallet();
  const [daoContributions, setDaoContributions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDaoData = async () => {
      try {
        const service = new StablecoinService(wallet);
        const contributions = await service.getDaoContributions();
        setDaoContributions(contributions);
      } catch (error) {
        console.error("Failed to fetch DAO data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDaoData();
  }, [wallet]);

  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-dark/90 p-10 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="mb-2 text-3xl font-bold">DAO Impact</h2>
          <p className="max-w-lg text-white/90">
            The Establo DAO has collected{' '}
            {loading ? (
              <span className="animate-pulse">loading...</span>
            ) : (
              <span className="font-bold">{daoContributions.toLocaleString()} EUSD</span>
            )}{' '}
            in contributions from transfer fees, funding real estate acquisitions and ecosystem growth.
          </p>
          <Link
            href="/dashboard/dao-stats"
            className="mt-4 inline-block rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            View DAO Statistics
          </Link>
        </div>
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-white/20 p-2">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-establo-black">
              <span className="font-mono text-xs">DAO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
