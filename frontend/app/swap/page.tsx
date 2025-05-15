'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStablecoin } from '@/lib/hooks/useStablecoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from '@/components/ui/use-toast';
import Decimal from 'decimal.js';

const TOKENS = ['ETH', 'BTC', 'USDC'];

export default function MintPage() {
    const { publicKey } = useWallet();
    const { loading, mintTokens } = useStablecoin();
    const [amount, setAmount] = useState<string>('');
    const [isSwapped, setIsSwapped] = useState(false);

    const [fromToken, setFromToken] = useState('ETH');
    const [toToken, setToToken] = useState('');

    const handleSwap = () => {
        setIsSwapped(!isSwapped);
        setFromToken(toToken);
        setToToken(fromToken);
    };

    const getConversionRate = (token: string) => {
        if (token === 'ETH') return 2500;
        if (token === 'BTC') return 65000;
        if (token === 'USDC') return 1;
        return 0;
    };

    const handleMint = async () => {
        if (!publicKey || !amount || !fromToken || !toToken) return;

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

    const conversionRate = getConversionRate(fromToken);
    const convertedAmount = amount ? (Number(amount) * conversionRate).toFixed(2) : '';

    const availableFromTokens = TOKENS.filter((token) => token !== toToken);
    const availableToTokens = TOKENS.filter((token) => token !== fromToken);

    return (
        <div className="relative min-h-screen overflow-hidden bg-establo-black text-white flex flex-col items-center justify-center px-4">
            <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-establo-purple/20 blur-3xl z-0"></div>
            <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-establo-purple/20 blur-3xl z-0"></div>

            <div className="relative z-10 w-full max-w-md">
                <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">
                    Swap anytime,<br />anywhere.
                </h1>

                <div className="bg-[#111111] rounded-2xl p-2 shadow-xl">
                    <div className="relative space-y-1">
                        {/* From Box */}
                        <div
                            className={`rounded-xl p-4 ${isSwapped ? 'bg-[#1c1c1c]' : ' bg-[#131313] border border-white/10'
                                }`}
                        >
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>{isSwapped ? 'To' : 'From'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-transparent text-2xl font-semibold placeholder:text-gray-500 outline-none w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                />
                                <select
                                    value={fromToken}
                                    onChange={(e) => setFromToken(e.target.value)}
                                    className="bg-[#2a2a2a] text-white ml-2 rounded-full px-4 py-1 text-sm"
                                >
                                    {availableFromTokens.map((token) => (
                                        <option key={token} value={token}>{token}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                ${convertedAmount}
                            </div>
                        </div>

                        {/* Swap Arrow */}
                        <div
                            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl z-10 cursor-pointer"
                            onClick={handleSwap}
                        >
                            <div className="bg-[#1c1c1c] p-2 rounded-2xl border-4 border-[#111111] shadow-md transition-transform duration-300 ease-in-out">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`lucide lucide-arrow-down transition-transform duration-300 ${isSwapped ? 'rotate-180' : ''
                                        }`}
                                >
                                    <path d="M12 5v14" />
                                    <path d="m19 12-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* To Box */}
                        <div
                            className={`rounded-xl p-4 ${isSwapped ? ' bg-[#131313] border border-white/10' : 'bg-[#1c1c1c]'
                                }`}
                        >
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>{isSwapped ? 'From' : 'To'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <input
                                    type="text"
                                    placeholder="0"
                                    readOnly
                                    value={convertedAmount}
                                    className="bg-transparent text-2xl font-semibold placeholder:text-gray-500 outline-none w-full"
                                />
                                <select
                                    value={toToken}
                                    onChange={(e) => setToToken(e.target.value)}
                                    className="bg-[#6B1CA8] text-white ml-2 rounded-full px-4 py-1 text-sm"
                                >
                                    <option value="">Select token</option>
                                    {availableToTokens.map((token) => (
                                        <option key={token} value={token}>{token}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                ${convertedAmount}
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleMint}
                        disabled={!publicKey || loading || !amount || !fromToken || !toToken}
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
