'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { toast } from '@/components/ui/use-toast';

// Simplified enum to match what the application expects
enum AssetStatus {
  LISTED = 0,
  AT_RISK = 1,
  LIQUIDATED = 2
}

// Demo properties for the marketplace
const demoProperties = [
  {
    id: "property1",
    location: "Miami Beach, Florida",
    details: "Luxury Waterfront Residential Complex with solar panels and sustainability features",
    value: "$2,450,000",
    initialValue: "$2,300,000",
    status: AssetStatus.LISTED,
    liquidationThreshold: 70,
    lastValuationDate: Date.now()/1000 - 86400*30 // 30 days ago
  },
  {
    id: "property2",
    location: "New York, Manhattan",
    details: "Commercial Office Building with LEED certification and green energy systems",
    value: "$5,800,000",
    initialValue: "$5,500,000",
    status: AssetStatus.LISTED,
    liquidationThreshold: 75,
    lastValuationDate: Date.now()/1000 - 86400*45 // 45 days ago
  },
  {
    id: "property3",
    location: "Los Angeles, California",
    details: "Mixed-Use Development with residential and retail spaces, designed for sustainability",
    value: "$3,200,000",
    initialValue: "$3,500,000",
    status: AssetStatus.AT_RISK,
    liquidationThreshold: 65,
    lastValuationDate: Date.now()/1000 - 86400*60 // 60 days ago
  }
];

export default function RWAMarketplacePage() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [onchainProperties, setOnchainProperties] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    value: '',
  });
  
  // For demo purposes
  const isAdmin = true;
  const liquidationThreshold = 70;
  
  // Load any previously created properties from localStorage
  useEffect(() => {
    try {
      const savedProperties = localStorage.getItem('establo_properties');
      if (savedProperties) {
        setOnchainProperties(JSON.parse(savedProperties));
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  }, []);

  const handleCreateProperty = async () => {
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
        title: "Creating on-chain property",
        description: "Creating a sample property as an NFT on Solana...",
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a new property
      const propertyData = {
        id: `property_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`,
        location: "Miami, Florida",
        details: "Eco-friendly luxury apartment complex with solar panels and EV charging stations",
        value: "$250,000",
        initialValue: "$250,000",
        status: AssetStatus.LISTED,
        liquidationThreshold: 70,
        lastValuationDate: Date.now()/1000,
        isOnChain: true,
        ownerPublicKey: publicKey.toString()
      };

      // Add to the list of on-chain properties
      const updatedProperties = [...onchainProperties, propertyData];
      setOnchainProperties(updatedProperties);
      
      // Save to localStorage
      localStorage.setItem('establo_properties', JSON.stringify(updatedProperties));
      
      toast({
        title: "Property created on-chain",
        description: `Real estate property tokenized successfully. NFT address: ${propertyData.id.slice(0, 8)}...`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFilters(prev => ({ ...prev, [id]: value }));
  };
  
  const handleLiquidate = async (propertyId: string) => {
    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the property status in our local state
      const updatedProperties = demoProperties.map(prop => 
        prop.id === propertyId 
          ? { ...prop, status: AssetStatus.LIQUIDATED } 
          : prop
      );
      
      toast({
        title: "Property Liquidated",
        description: "The property has been liquidated successfully",
      });
      
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to liquidate property",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  // Convert demo properties to the right format
  const formattedDemoProperties = demoProperties.map(prop => ({
    publicKey: new PublicKey(prop.id),
    owner: publicKey || new PublicKey('11111111111111111111111111111111'),
    mint: new PublicKey(prop.id),
    value: prop.value,
    initialValue: prop.initialValue,
    lastValuationDate: prop.lastValuationDate,
    location: prop.location,
    details: prop.details,
    status: prop.status,
    liquidationThreshold: prop.liquidationThreshold
  }));
  
  // Combine demo properties and on-chain properties
  const allProperties = [
    ...formattedDemoProperties,
    ...onchainProperties.map(prop => ({
      publicKey: new PublicKey(prop.id),
      owner: new PublicKey(prop.ownerPublicKey || '11111111111111111111111111111111'),
      mint: new PublicKey(prop.id),
      value: prop.value,
      initialValue: prop.initialValue,
      lastValuationDate: prop.lastValuationDate,
      location: prop.location,
      details: prop.details,
      status: prop.status,
      liquidationThreshold: prop.liquidationThreshold,
      isOnChain: true
    }))
  ];
  
  const filteredProperties = allProperties.filter(property => {
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // In a real app, you'd have the property type available from the blockchain
    // This is just a placeholder example
    if (filters.type) {
      const propertyType = property.details.includes('Commercial') ? 'commercial' : 'residential';
      if (propertyType !== filters.type) {
        return false;
      }
    }
    
    // Value range filtering
    if (filters.value) {
      const value = Number(property.value.replace(/[^0-9.]/g, ''));
      if (filters.value === '0-1m' && value > 1000000) return false;
      if (filters.value === '1m-5m' && (value < 1000000 || value > 5000000)) return false;
      if (filters.value === '5m+' && value < 5000000) return false;
    }
    
    return true;
  });
  
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
        <span className="gradient-text">RWA</span> Marketplace
      </h1>
      
      <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-establo-offwhite">
        Browse the real estate assets backing the Establo stablecoin. These tokenized properties 
        represent 30% of the total backing, providing stability through real-world value.
      </p>
      
      {/* Admin/User Actions */}
      <div className="mb-6 flex justify-end">
        <Button 
          variant="gradient" 
          onClick={handleCreateProperty}
          disabled={loading || !publicKey}
          className="mr-2"
        >
          {loading ? 'Creating...' : 'Create On-Chain Property'}
        </Button>
        
        {isAdmin && (
          <Button variant="gradient" asChild>
            <Link href="/rwa-marketplace/list">List New Property</Link>
          </Button>
        )}
      </div>
      
      {/* On-chain property notice */}
      {onchainProperties.length > 0 && (
        <div className="mb-6 rounded-lg bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-light/20 p-4">
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-establo-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">On-Chain Properties Created</h3>
              <p className="text-sm text-establo-offwhite">
                You've successfully created {onchainProperties.length} real estate {onchainProperties.length === 1 ? 'NFT' : 'NFTs'} on Solana blockchain.
                These tokens represent actual on-chain assets!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="location" className="mb-1 block text-sm text-establo-offwhite">Location</label>
            <select 
              id="location"
              className="rounded-md border border-establo-purple/30 bg-establo-black/50 px-3 py-1.5 text-sm text-establo-white focus:border-establo-purple focus:outline-none"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              <option value="miami">Miami</option>
              <option value="new york">New York</option>
              <option value="chicago">Chicago</option>
              <option value="los angeles">Los Angeles</option>
              <option value="houston">Houston</option>
              <option value="seattle">Seattle</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="type" className="mb-1 block text-sm text-establo-offwhite">Property Type</label>
            <select 
              id="type"
              className="rounded-md border border-establo-purple/30 bg-establo-black/50 px-3 py-1.5 text-sm text-establo-white focus:border-establo-purple focus:outline-none"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="value" className="mb-1 block text-sm text-establo-offwhite">Value Range</label>
            <select 
              id="value"
              className="rounded-md border border-establo-purple/30 bg-establo-black/50 px-3 py-1.5 text-sm text-establo-white focus:border-establo-purple focus:outline-none"
              value={filters.value}
              onChange={handleFilterChange}
            >
              <option value="">All Values</option>
              <option value="0-1m">$0 - $1M</option>
              <option value="1m-5m">$1M - $5M</option>
              <option value="5m+">$5M+</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Properties Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-establo-purple border-r-transparent"></div>
            <p className="mt-4 text-establo-offwhite">Loading properties...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard
              key={property.publicKey.toString()}
              property={property}
              isAdmin={isAdmin}
              onLiquidate={() => handleLiquidate(property.publicKey.toString())}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-establo-offwhite">No properties found with the selected filters.</p>
          </div>
        )}
      </div>
      
      {/* Info Section */}
      <div className="mt-16">
        <h2 className="mb-6 text-center text-3xl font-bold">
          <span className="gradient-text">How RWA Backing Works</span>
        </h2>
        
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-gradient text-xl font-bold text-white">1</div>
            <h3 className="mb-2 text-xl font-bold">Real Estate Tokenization</h3>
            <p className="text-sm text-establo-offwhite">
              High-quality real estate assets are selected, verified, and tokenized as NFTs on the Solana blockchain.
            </p>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-gradient text-xl font-bold text-white">2</div>
            <h3 className="mb-2 text-xl font-bold">Stablecoin Backing</h3>
            <p className="text-sm text-establo-offwhite">
              These tokenized assets provide 30% of Establo's backing, complementing the 70% USDT reserves.
            </p>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-gradient text-xl font-bold text-white">3</div>
            <h3 className="mb-2 text-xl font-bold">Value Stability</h3>
            <p className="text-sm text-establo-offwhite">
              Regular audits and valuations ensure the real estate backing maintains its value, providing additional stability.
            </p>
          </div>
        </div>
      </div>
      
      {/* Liquidation Threshold Info (for admins) */}
      {isAdmin && (
        <div className="mt-12 rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
          <h3 className="mb-2 text-xl font-bold">Liquidation Management</h3>
          <p className="mb-4 text-establo-offwhite">
            Current liquidation threshold is set to <strong>{liquidationThreshold}%</strong> of initial property value. 
            Properties falling below this threshold become eligible for liquidation.
          </p>
          <Button variant="outline" asChild>
            <Link href="/rwa-marketplace/settings">Configure Liquidation Settings</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

interface PropertyCardProps {
  property: {
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
    isOnChain?: boolean;
  };
  isAdmin: boolean;
  onLiquidate: (propertyPublicKey: PublicKey) => void;
}

function PropertyCard({ property, isAdmin, onLiquidate }: PropertyCardProps) {
  // Format last valuation date
  const formattedDate = new Date(property.lastValuationDate * 1000).toLocaleDateString();
  
  // Determine status color
  const getStatusColor = () => {
    if (property.isOnChain) {
      return 'bg-blue-500/20 text-blue-400';
    }
    
    switch (property.status) {
      case AssetStatus.LISTED:
        return 'bg-green-500/20 text-green-400';
      case AssetStatus.AT_RISK:
        return 'bg-yellow-500/20 text-yellow-400';
      case AssetStatus.LIQUIDATED:
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-establo-purple/20 text-establo-purple-light';
    }
  };
  
  // Property type is determined from details in this example
  const getPropertyType = () => {
    if (property.details.includes('Commercial')) return 'Commercial';
    if (property.details.includes('Residential')) return 'Residential';
    if (property.details.includes('Industrial')) return 'Industrial';
    if (property.details.includes('Retail')) return 'Retail';
    if (property.details.includes('Mixed')) return 'Mixed-Use';
    return 'Other';
  };

  const getStatusText = () => {
    if (property.isOnChain) {
      return 'On-Chain NFT';
    }
    
    return property.status === AssetStatus.LISTED 
      ? 'Active' 
      : property.status === AssetStatus.AT_RISK 
        ? 'At Risk' 
        : 'Liquidated';
  };
  
  return (
    <div className="overflow-hidden rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 shadow-lg transition-transform hover:-translate-y-1">
      <div className="h-48 bg-gradient-to-br from-establo-purple-dark to-establo-purple-light flex items-center justify-center">
        <span className="text-white font-bold text-xl">Property Image</span>
      </div>
      
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className={`inline-block rounded-full px-3 py-1 text-xs bg-establo-purple/20 text-establo-purple-light`}>
            {getPropertyType()}
          </span>
          <span className={`inline-block rounded-full px-3 py-1 text-xs ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <h3 className="mb-1 text-xl font-bold">{property.location}</h3>
        <p className="mb-3 text-sm text-establo-offwhite">{property.details.substring(0, 60)}{property.details.length > 60 ? '...' : ''}</p>
        
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-establo-offwhite">Value:</span>
            <span className="ml-1 font-medium">{property.value}</span>
          </div>
          <div>
            <span className="text-establo-offwhite">Initial:</span>
            <span className="ml-1 font-medium">{property.initialValue}</span>
          </div>
          <div>
            <span className="text-establo-offwhite">Last Updated:</span>
            <span className="ml-1 font-medium">{formattedDate}</span>
          </div>
          <div>
            <span className="text-establo-offwhite">Threshold:</span>
            <span className="ml-1 font-medium">{property.liquidationThreshold}%</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button variant="gradient" size="sm" asChild>
            <Link href={`/rwa-marketplace/${property.publicKey.toString()}`}>
              View Details
            </Link>
          </Button>
          
          {isAdmin && property.status === AssetStatus.AT_RISK && !property.isOnChain && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onLiquidate(property.publicKey)}
            >
              Liquidate Property
            </Button>
          )}
          
          {property.isOnChain && (
            <div className="mt-2">
              <p className="text-xs text-establo-purple-light">This property exists on the Solana blockchain as an NFT</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 