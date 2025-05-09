'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useStablecoin } from '@/lib/hooks/useStablecoin';
import { useRWAMarketplace } from '@/lib/hooks/useRWAMarketplace';
import { toast } from '@/components/ui/use-toast';
import Decimal from 'decimal.js';

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const { balance, reserves, loading: stablecoinLoading, transferTokens } = useStablecoin();
  const { properties, loading: rwaLoading } = useRWAMarketplace();
  
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'wallet' | 'assets' | 'transactions'>('wallet');
  
  // Mock data for transactions (would be fetched from blockchain in a real app)
  const transactions = [
    { 
      type: 'Send', 
      amount: '100.00 ESTB', 
      date: '2023-06-12 14:30', 
      address: '8Hj9...3Zr1', 
      status: 'Completed' 
    },
    { 
      type: 'Mint', 
      amount: '500.00 ESTB', 
      date: '2023-06-10 09:15', 
      address: 'You', 
      status: 'Completed' 
    },
    { 
      type: 'Receive', 
      amount: '50.00 ESTB', 
      date: '2023-06-05 16:20', 
      address: '2ThP...9wQz', 
      status: 'Completed' 
    },
  ];
  
  const handleTransfer = async () => {
    if (!publicKey || !recipientAddress || !transferAmount) return;
    
    try {
      // Validate amount
      const amountNum = new Decimal(transferAmount);
      if (amountNum.isNaN() || amountNum.lte(0)) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid positive number",
          variant: "destructive",
        });
        return;
      }
      
      // Validate address
      let recipientPublicKey: PublicKey;
      try {
        recipientPublicKey = new PublicKey(recipientAddress);
      } catch (e) {
        toast({
          title: "Invalid address",
          description: "Please enter a valid Solana address",
          variant: "destructive",
        });
        return;
      }
      
      await transferTokens(transferAmount, recipientPublicKey);
      
      // Reset form
      setRecipientAddress('');
      setTransferAmount('');
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  if (!publicKey) {
    return (
      <div className="container py-12 text-center">
        <h1 className="mb-8 text-4xl font-bold md:text-5xl">
          <span className="gradient-text">Dashboard</span>
        </h1>
        
        <div className="mx-auto max-w-lg rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-10 shadow-lg">
          <p className="mb-6 text-lg text-establo-offwhite">
            Please connect your wallet to access your dashboard.
          </p>
          
          <Button variant="gradient" size="lg" className="mx-auto" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
        <span className="gradient-text">Dashboard</span>
      </h1>
      
      <div className="grid gap-8 md:grid-cols-12">
        {/* Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-purple-gradient p-1">
                <div className="h-full w-full rounded-full bg-establo-black flex items-center justify-center">
                  <span className="text-xl font-bold text-establo-white">
                    {publicKey.toString().substring(0, 2)}
                  </span>
                </div>
              </div>
              <p className="mb-1 text-lg font-semibold text-establo-white">
                Your Wallet
              </p>
              <p className="text-sm text-establo-offwhite">
                {publicKey.toString().substring(0, 4)}...
                {publicKey.toString().substring(publicKey.toString().length - 4)}
              </p>
            </div>
            
            <div className="mb-4 border-t border-establo-purple/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-establo-offwhite">Establo Balance:</span>
                <span className="font-mono font-medium">{balance} ESTB</span>
              </div>
            </div>
            
            <div className="mb-6 rounded bg-gradient-to-r from-establo-purple-dark/10 to-establo-purple-light/10 p-3">
              <h3 className="mb-2 text-sm font-semibold">Stablecoin Backing</h3>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-establo-offwhite">USDT Reserve:</span>
                <span>${reserves.usdt}</span>
              </div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-establo-offwhite">Real Estate Value:</span>
                <span>${reserves.realEstate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-establo-offwhite">Status:</span>
                <span className={reserves.isFullyBacked ? 'text-green-400' : 'text-yellow-400'}>
                  {reserves.isFullyBacked ? 'Fully Backed' : 'Partially Backed'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="gradient" size="sm" className="w-full" asChild>
                <Link href="/mint">Mint Tokens</Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/rwa-marketplace">View Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="mb-6">
            <div className="mb-2 flex space-x-1 rounded-lg border border-establo-purple/20 bg-establo-black/30 p-1">
              <button
                className={`flex-1 rounded-md py-2 text-sm font-medium ${
                  activeTab === 'wallet'
                    ? 'bg-gradient-to-r from-establo-purple-dark to-establo-purple-light text-white'
                    : 'text-establo-offwhite hover:text-white'
                }`}
                onClick={() => setActiveTab('wallet')}
              >
                Wallet
              </button>
              <button
                className={`flex-1 rounded-md py-2 text-sm font-medium ${
                  activeTab === 'assets'
                    ? 'bg-gradient-to-r from-establo-purple-dark to-establo-purple-light text-white'
                    : 'text-establo-offwhite hover:text-white'
                }`}
                onClick={() => setActiveTab('assets')}
              >
                Your Assets
              </button>
              <button
                className={`flex-1 rounded-md py-2 text-sm font-medium ${
                  activeTab === 'transactions'
                    ? 'bg-gradient-to-r from-establo-purple-dark to-establo-purple-light text-white'
                    : 'text-establo-offwhite hover:text-white'
                }`}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
            </div>
          </div>
          
          {/* Wallet Tab Content */}
          {activeTab === 'wallet' && (
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold">Send Tokens</h2>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm text-establo-offwhite">
                  Recipient Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Solana address"
                  className="w-full rounded-md border border-establo-purple/30 bg-establo-black/50 px-4 py-2 font-mono text-sm text-establo-white placeholder:text-establo-offwhite/50 focus:border-establo-purple focus:outline-none"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="mb-1 block text-sm text-establo-offwhite">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full rounded-md border border-establo-purple/30 bg-establo-black/50 px-4 py-2 font-mono text-sm text-establo-white placeholder:text-establo-offwhite/50 focus:border-establo-purple focus:outline-none"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-xs text-establo-offwhite">ESTB</span>
                  </div>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-xs text-establo-offwhite">Fee: 0.5%</span>
                  <button 
                    className="text-xs text-establo-purple hover:text-establo-purple-light"
                    onClick={() => setTransferAmount(balance)}
                  >
                    Max
                  </button>
                </div>
              </div>
              
              <Button 
                variant="gradient" 
                className="w-full" 
                disabled={stablecoinLoading || !recipientAddress || !transferAmount}
                onClick={handleTransfer}
              >
                {stablecoinLoading ? 'Processing...' : 'Send Tokens'}
              </Button>
              
              <div className="mt-6 rounded-md bg-gradient-to-r from-establo-purple-dark/10 to-establo-purple-light/10 p-4">
                <h3 className="mb-2 text-lg font-medium">Transaction Information</h3>
                <ul className="space-y-1 text-sm text-establo-offwhite">
                  <li>• Transactions are processed on the Solana blockchain</li>
                  <li>• A 0.5% fee is applied to all transfers</li>
                  <li>• Fees contribute to the DAO treasury</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Assets Tab Content */}
          {activeTab === 'assets' && (
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold">Your Properties</h2>
              
              {rwaLoading ? (
                <div className="py-6 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-establo-purple border-t-transparent"></div>
                  <p className="mt-2 text-sm text-establo-offwhite">Loading your assets...</p>
                </div>
              ) : properties.filter(p => publicKey.equals(p.owner)).length > 0 ? (
                <div className="space-y-4">
                  {properties
                    .filter(p => publicKey.equals(p.owner))
                    .map(property => (
                      <div key={property.publicKey.toString()} className="rounded-md border border-establo-purple/20 p-4 hover:bg-establo-purple/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{property.location}</h3>
                            <p className="text-sm text-establo-offwhite">
                              Value: ${property.value}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/rwa-marketplace/${property.publicKey.toString()}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-md bg-establo-black/30 p-6 text-center">
                  <p className="mb-4 text-establo-offwhite">You don't own any properties yet.</p>
                  <Button variant="gradient" size="sm" asChild>
                    <Link href="/rwa-marketplace">
                      Browse Marketplace
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Transactions Tab Content */}
          {activeTab === 'transactions' && (
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold">Transaction History</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-establo-purple/20 text-left text-sm text-establo-offwhite">
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Address</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={index} className="border-b border-establo-purple/10 text-sm">
                        <td className="py-3">{tx.type}</td>
                        <td className="py-3 font-mono">{tx.amount}</td>
                        <td className="py-3">{tx.date}</td>
                        <td className="py-3 font-mono">{tx.address}</td>
                        <td className="py-3">
                          <span className="inline-block rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-establo-offwhite">
                  Showing last 3 transactions.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  View More
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  change, 
  positive 
}: { 
  title: string, 
  value: string, 
  change?: string, 
  positive?: boolean 
}) {
  return (
    <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-4 shadow-lg">
      <h3 className="mb-1 text-sm text-establo-offwhite">{title}</h3>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  )
}

function TransactionRow({ 
  type, 
  amount, 
  date, 
  status 
}: { 
  type: string, 
  amount: string, 
  date: string, 
  status: string 
}) {
  return (
    <tr className="border-b border-establo-purple/10 text-sm">
      <td className="py-3">
        <div className={`inline-block rounded-full px-3 py-1 text-xs 
        ${type === 'Mint' 
          ? 'bg-establo-purple/20 text-establo-purple-light' 
          : type === 'Redeem' 
          ? 'bg-red-500/20 text-red-400' 
          : 'bg-blue-500/20 text-blue-400'}`}>
          {type}
        </div>
      </td>
      <td className="py-3 font-mono">{amount}</td>
      <td className="py-3">{date}</td>
      <td className="py-3">
        <span className="inline-block rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
          {status}
        </span>
      </td>
    </tr>
  )
}

function PropertyCard({ 
  name, 
  location, 
  value, 
  contribution 
}: { 
  name: string, 
  location: string, 
  value: string, 
  contribution: string 
}) {
  return (
    <div className="flex gap-4 rounded-md bg-establo-black/30 p-4">
      <div className="h-16 w-16 shrink-0 rounded-md bg-gradient-to-br from-establo-purple-dark to-establo-purple-light"></div>
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="mb-1 text-sm text-establo-offwhite">{location}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{value}</span>
          <span className="text-xs text-establo-offwhite">
            Contributes {contribution}
          </span>
        </div>
      </div>
    </div>
  )
}