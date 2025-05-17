#!/bin/bash

# Update package lists
echo "Updating package lists..."
sudo apt-get update

# Install required packages
echo "Installing required packages..."
sudo apt-get install -y curl build-essential gcc pkg-config libssl-dev libudev-dev

# Install Rust using rustup
echo "Installing Rust..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

# Install Solana CLI
echo "Installing Solana CLI..."
sh -c "$(curl -sSfL https://release.solana.com/v1.16.1/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Add Solana to the PATH
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# Install Anchor CLI
echo "Installing Anchor CLI..."
cargo install --git https://github.com/coral-xyz/anchor --tag v0.28.0 anchor-cli

echo ""
echo "Setup complete! Please run the following commands to start developing:"
echo "1. source ~/.bashrc"
echo "2. cd /path/to/your/project/backend"
echo "3. anchor build"
echo ""
echo "To deploy to Solana's devnet:"
echo "1. solana config set --url devnet"
echo "2. solana-keygen new (if you don't have a key already)"
echo "3. solana airdrop 2 (to get some SOL for transactions)"
echo "4. anchor deploy" 