'use client';

import { FC, useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { Button } from '@/components/ui/button';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const WalletButton: FC = () => {
  const { wallet, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  
  const handleConnect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  if (!wallet || !base58) {
    return (
      <Button 
        onClick={handleConnect} 
        variant="gradient" 
        size="sm"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="gradient" 
        size="sm"
        onClick={disconnect}
      >
        {base58.slice(0, 4)}...{base58.slice(-4)}
      </Button>
    </div>
  );
};

export { WalletButton };
export default WalletButton; 