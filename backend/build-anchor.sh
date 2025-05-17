#!/bin/bash

# This script will build the project using Anchor

# Source cargo environment
source $HOME/.cargo/env

# Make sure Solana is in PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Build the project
echo "Building with Anchor..."
anchor build

echo "Build complete! Check target/deploy directory for build artifacts."
echo "To run tests, use: anchor test" 