'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from '@/components/ui/use-toast';
import Decimal from 'decimal.js';
import StablecoinService from '@/src/services/stablecoin-service';
import { isLessThanOrEqual, isGreaterThan, toNumber } from '@/src/utils/decimal-helpers';

export default function TransferPage() {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [stablecoinService, setStablecoinService] = useState<StablecoinService | null>(null);
  const [userBalance, setUserBalance] = useState<string>('0');
  const [daoFee, setDaoFee] = useState<number>(0.5); // 0.5% fee

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

  const handleTransfer = async () => {
    if (!publicKey || !amount || !recipient || !stablecoinService) return;

    // Validate amount and recipient
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

      // Basic validation for Solana address (should be 44 characters)
      if (!recipient.trim() || recipient.trim().length !== 44) {
        toast({
          title: "Invalid recipient",
          description: "Please enter a valid Solana address",
          variant: "destructive",
        });
        return;
      }

      // Check if user has enough balance
      const balanceNum = new Decimal(userBalance);
      if (isGreaterThan(amountNum, balanceNum)) {
        toast({
          title: "Insufficient balance",
          description: "You don't have enough tokens to transfer",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      
      // Calculate fee
      const feeAmount = amountNum.mul(daoFee).div(100);
      const amountAfterFee = amountNum.sub(feeAmount);
      
      // Transfer tokens
      toast({
        title: "Transferring tokens",
        description: `Transferring ${amountAfterFee.toString()} EUSD tokens to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      });
      
      try {
        const tx = await stablecoinService.transfer(recipient, toNumber(amountNum));
        
        toast({
          title: "Success",
          description: `${amountAfterFee.toString()} EUSD tokens have been transferred. Transaction: ${tx.slice(0, 8)}...`,
        });
        
        // Refresh user balance
        fetchUserBalance(stablecoinService);
        
        // Reset form
        setAmount('');
        setRecipient('');
      } catch (error: any) {
        console.error("Transfer error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to transfer tokens. Check connection and try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to transfer tokens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMax = () => {
    setAmount(userBalance);
  };

  // Calculate amount after fee
  const calculateAmountAfterFee = () => {
    if (!amount) return '0';
    try {
      const amountNum = new Decimal(amount);
      const feeAmount = amountNum.mul(daoFee).div(100);
      const amountAfterFee = amountNum.sub(feeAmount);
      return amountAfterFee.toString();
    } catch (error) {
      return '0';
    }
  };

  const amountAfterFee = calculateAmountAfterFee();

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
        <span className="gradient-text">Transfer</span> EUSD Stablecoin
      </h1>

      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6 shadow-lg">
          {!publicKey ? (
            <div className="text-center py-8">
              <p className="mb-6 text-establo-offwhite">Connect your wallet to transfer EUSD stablecoin</p>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-establo-offwhite">Your EUSD Balance</span>
                  <span className="font-mono font-medium">{parseFloat(userBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})} EUSD</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-6">
                  <label htmlFor="recipient" className="mb-2 block text-sm text-establo-offwhite">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    id="recipient"
                    placeholder="Solana address (e.g., 4Zw7rBeED2Ehg2SY5zH5qcwD9BvLg7WNUKaSCLGTGVvf)"
                    className="w-full rounded-md border border-establo-purple/30 bg-establo-black/50 px-4 py-2 font-mono text-sm text-establo-white placeholder:text-establo-offwhite/50 focus:border-establo-purple focus:outline-none"
                    value={recipient}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="amount" className="mb-2 block text-sm text-establo-offwhite">
                    Amount to Transfer
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
                    <span className="text-sm text-establo-offwhite">Transfer Fee ({daoFee}%)</span>
                    <span className="font-mono text-sm">
                      {amount ? (new Decimal(amount).mul(daoFee).div(100)).toString() : '0'} EUSD
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-establo-offwhite">Recipient Will Receive</span>
                    <span className="font-mono text-sm">
                      {amountAfterFee} EUSD
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-establo-offwhite">DAO Contribution</span>
                    <span className="font-mono text-sm">
                      {amount ? (new Decimal(amount).mul(daoFee).div(100)).toString() : '0'} EUSD
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-establo-offwhite">Network Fee</span>
                    <span className="font-mono text-sm">~0.00005 SOL</span>
                  </div>
                </div>
              </div>

              <Button
                variant="gradient"
                className="w-full"
                size="lg"
                onClick={handleTransfer}
                disabled={loading || !amount || !recipient}
              >
                {loading ? 'Processing...' : 'Transfer EUSD'}
              </Button>
            </>
          )}
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">
            About Transfer Fees
          </h2>
          <p className="mb-4 text-establo-offwhite">
            When you transfer EUSD tokens, a small fee is applied to support the DAO and ecosystem:
          </p>
          <ul className="list-disc pl-5 text-establo-offwhite space-y-2">
            <li><strong>0.5% DAO Fee:</strong> A small fee of 0.5% is applied to each transfer and contributed to the Establo DAO.</li>
            <li><strong>Sustainable Economics:</strong> This fee helps fund ecosystem development, liquidity provisions, and real estate acquisitions.</li>
            <li><strong>Transparent & Automated:</strong> All fees are transparently calculated and automatically sent to the DAO treasury.</li>
            <li><strong>No Mint/Burn Fees:</strong> There are no fees for minting or burning EUSD tokens, only for transfers between wallets.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 