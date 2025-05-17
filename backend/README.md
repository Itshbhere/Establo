# Establo: Green Stablecoin and RWA Marketplace

This project implements a green stablecoin backed by USDT (70%) and tokenized real estate (30%), along with an RWA marketplace for tokenizing real estate assets.

## Building with Anchor (Recommended)

The project is built using the Anchor framework. Due to compatibility issues with Windows PowerShell, it is strongly recommended to use WSL (Windows Subsystem for Linux) for development.

### Setup WSL for Solana Development

1. Install WSL2 if you haven't already:
   ```
   wsl --install
   ```

2. Launch Ubuntu from the Start menu

3. Navigate to the project directory in WSL:
   ```
   cd /mnt/d/Learning\ Stuff/Projects/Establo/Establo/backend
   ```

4. Give execute permissions to the setup script:
   ```
   chmod +x setup_wsl.sh
   ```

5. Run the setup script to install Rust, Solana, and Anchor:
   ```
   ./setup_wsl.sh
   ```

6. Source your bash profile to update environment variables:
   ```
   source ~/.bashrc
   ```

### Build the Project with Anchor

Once WSL is set up, you can build the project:

```
# Make sure you're in the backend directory
cd /mnt/d/Learning\ Stuff/Projects/Establo/Establo/backend

# Build the project
anchor build
```

The build artifacts will be generated in the `target/deploy` directory.

### Testing

To run tests:

```
anchor test
```

### Deployment

To deploy to Solana devnet:

```
# Configure Solana CLI to use devnet
solana config set --url devnet

# Create a keypair if you don't have one
solana-keygen new

# Get some devnet SOL
solana airdrop 2

# Deploy the program
anchor deploy
```

## Features

1. **Green Stablecoin**
   - Backed by USDT (70%) and tokenized real estate (30%)
   - 0.5% transaction fee supporting SDG initiatives
   - Anchor-based smart contract

2. **RWA Marketplace**
   - Tokenize real estate assets
   - Manage valuations and liquidations
   - Support for the stablecoin backing

## Technical Stack

- Solana blockchain
- Anchor framework
- Rust programming language
- SPL Token standard
- Metaplex for NFT metadata

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) 1.68.0 or later
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) v1.16.0 or later
- [Anchor](https://www.anchor-lang.com/) v0.28.0 or later
- Node.js and npm/yarn (for testing)

## Project Structure

- `src/` - The Rust source code for the smart contract
  - `lib.rs` - Main module and stablecoin implementation
  - `rwa_marketplace.rs` - Implementation of the RWA marketplace
  - `instruction.rs` - Instruction definitions for the program
  - `processor.rs` - Instruction processor
  - `error.rs` - Custom error definitions
  - `entrypoint.rs` - Program entrypoint
- `tests/` - Rust and JavaScript tests for the smart contract

## Building the Project

To build the Solana program, run:

```bash
anchor build
```

This will compile the Rust code and generate the necessary artifacts for deployment.

## Testing

### Rust Tests

To run the Rust tests:

```bash
cargo test
```

### JavaScript Integration Tests

To run the JavaScript integration tests:

```bash
anchor test
```

## Deploying to Solana Devnet

1. Set your Solana CLI to devnet:

```bash
solana config set --url devnet
```

2. Generate a new keypair if you don't have one:

```bash
solana-keygen new
```

3. Get some SOL from the devnet faucet:

```bash
solana airdrop 2
```

4. Deploy the program:

```bash
anchor deploy
```

5. Update your program ID in `Anchor.toml` and `lib.rs` if needed.

## Program Details

The program consists of two main components:

### Stablecoin

- Dual-backed by USDT (70%) and tokenized real estate (30%)
- Supports transfer, mint, and burn operations
- Implements a 0.5% DAO fee on transfers

### RWA Marketplace

- Tokenizes real estate as NFTs
- Connects real estate value to stablecoin reserves
- Implements valuation updates and liquidation protection
- Enables transparent ownership and transfers

## Security Considerations

- Real-world asset valuations require trusted oracles or authorized evaluators
- Liquidation mechanisms protect the protocol from undercollateralization
- Admin keys should be kept secure and possibly managed through a DAO structure 