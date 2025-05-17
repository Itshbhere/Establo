# Frontend Integration Guide

After deploying your Establo smart contract to Solana (either using Solana Playground or Docker), follow these steps to integrate it with your frontend.

## Step 1: Get Deployment Information

After successful deployment, you'll need:
- Program ID (the address of your deployed contract)
- IDL file (Interface Description Language - describes your program's interface)

## Step 2: Configure Your Frontend

Update your frontend configuration to use the deployed contract:

```javascript
// Example configuration file
export const SOLANA_CLUSTER = 'devnet'; // or 'mainnet-beta', 'testnet'
export const PROGRAM_ID = 'YOUR_DEPLOYED_PROGRAM_ID'; // Replace with your actual program ID
```

## Step 3: Use Solana Web3.js and Anchor with React

Here's a simple example of how to set up your React application to interact with the smart contract:

```javascript
import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from './idl.json'; // Your exported IDL file

// Set up connection to the cluster
const connection = new Connection('https://api.devnet.solana.com');
const programId = new PublicKey('YOUR_DEPLOYED_PROGRAM_ID');

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [program, setProgram] = useState(null);

  useEffect(() => {
    // Initialize connection to the wallet
    const initWallet = async () => {
      // For this example, using Phantom
      const { solana } = window;
      if (solana?.isPhantom) {
        await solana.connect();
        setWallet(solana);
      }
    };

    initWallet();
  }, []);

  useEffect(() => {
    if (!wallet) return;

    // Create provider
    const provider = new Provider(
      connection,
      wallet,
      { preflightCommitment: 'processed' }
    );

    // Create program instance
    const program = new Program(idl, programId, provider);
    setProgram(program);
  }, [wallet]);

  // Example function to call a smart contract method
  const transferTokens = async (recipient, amount) => {
    if (!program) return;
    
    try {
      // Replace with your actual account addresses
      const recipientTokenAccount = new PublicKey('RECIPIENT_TOKEN_ACCOUNT');
      const daoTokenAccount = new PublicKey('DAO_TOKEN_ACCOUNT');
      const configAccount = new PublicKey('CONFIG_ACCOUNT');
      
      // Call the transfer instruction
      await program.rpc.transfer(
        new BN(amount),
        {
          accounts: {
            config: configAccount,
            sender: wallet.publicKey,
            senderTokenAccount: await getAssociatedTokenAddress(
              new PublicKey('YOUR_MINT'), 
              wallet.publicKey
            ),
            recipientTokenAccount: recipientTokenAccount,
            daoTokenAccount: daoTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
        }
      );
      
      console.log('Transfer successful');
    } catch (error) {
      console.error('Error transferring tokens:', error);
    }
  };

  return (
    <div>
      {/* Your UI components */}
    </div>
  );
};

export default App;
```

## Step 4: Test the Integration

1. Make sure you have Solana devnet SOL in your wallet
2. Create token accounts for your stablecoin
3. Test basic operations like transfer, mint, burn, etc.
4. Monitor transaction status using Solana Explorer

## Common Integration Issues

1. **IDL Mismatch**: Make sure your IDL matches your deployed program
2. **Account Initialization**: Ensure all necessary accounts are properly initialized
3. **PDA Derivation**: Verify you're using the same seeds for PDA derivation
4. **Transaction Fees**: Make sure you have enough SOL to pay for transaction fees
5. **RPC Endpoints**: Use reliable RPC providers like QuickNode or Serum for production

## Resources

- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Anchor Documentation](https://project-serum.github.io/anchor/getting-started/introduction.html)
- [Solana Cookbook](https://solanacookbook.com/) 