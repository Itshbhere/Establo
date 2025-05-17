'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStablecoin } from '@/lib/hooks/useStablecoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from '@/components/ui/use-toast';
import Decimal from 'decimal.js';
import EstabloService from '../../src/services/establo-service';

// We only have two tokens - SOL and EUSD
const TOKENS = ['SOL', 'EUSD'];

export default function MintPage() {
    const { publicKey } = useWallet();
    const { loading, mintTokens } = useStablecoin();
    const [amount, setAmount] = useState<string>('');
    const [isSwapped, setIsSwapped] = useState(false);

    // Initialize with SOL at the top and EUSD at the bottom
    const [fromToken, setFromToken] = useState('SOL');
    const [toToken, setToToken] = useState('EUSD');

    // When the swap button is pressed, we exchange the tokens
    const handleSwap = () => {
        setIsSwapped(!isSwapped);
        setFromToken(toToken);
        setToToken(fromToken);
    };

    // Automatically update the opposite token whenever one changes
    useEffect(() => {
        if (fromToken === 'SOL') {
            setToToken('EUSD');
        } else {
            setToToken('SOL');
        }
    }, [fromToken]);

    const getConversionRate = (token: string) => {
        if (token === 'SOL') return 105;
        if (token === 'EUSD') return 1;
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
                                <div className="bg-[#2a2a2a] text-white ml-2 rounded-full px-4 py-1 text-sm">
                                    {fromToken}
                                </div>
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
                                <div className="bg-[#6B1CA8] text-white ml-2 rounded-full px-4 py-1 text-sm">
                                    {toToken}
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                ${convertedAmount}
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleMint}
                        disabled={!publicKey || loading || !amount}
                        className="w-full mt-1 gradient text-white font-semibold rounded-xl py-6 text-center"
                    >
                        {loading ? 'Processing...' : !publicKey ? 'Connect Wallet First' : 'Swap'}
                    </Button>
                </div>

                <p className="text-xs text-gray-400 mt-6 text-center max-w-sm">
                    Swap between SOL and EUSD on the Solana blockchain with minimal fees.
                </p>
            </div>
        </div>
    );
}
