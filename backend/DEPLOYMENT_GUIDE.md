# Establo Smart Contract Deployment Guide

## Option 1: Deploy using Solana Playground

Solana Playground is an online IDE that simplifies the build and deployment process for Solana programs.

1. Go to [Solana Playground](https://beta.solpg.io/)
2. Create a new project (click on "New Project" and select "Anchor" as the framework)
3. Replace the default code with your Establo smart contract code:
   - Copy all files from the `src` directory to the corresponding locations in Playground
   - Update the Anchor.toml file in Playground with your project's configuration
   - Update Cargo.toml with the necessary dependencies

4. Build the program:
   - Click on the "Build" button in the Playground interface

5. Deploy the program:
   - Select the desired network (devnet/testnet) in the dropdown
   - Click on the "Deploy" button
   - The Playground will handle the transaction and provide you with the program ID

6. Test your deployment:
   - Use the Playground's integrated testing tools or connect your frontend

## Option 2: Deploy Locally with Docker

If the WSL2 setup isn't working properly, you can use Docker for a consistent environment:

```bash
# Pull and run a Docker container with Solana and Anchor installed
docker run --rm -it -v $(pwd):/workspace -w /workspace projectserum/build:v0.26.0

# Inside the container
cd backend
cargo build-bpf
```

## Frontend Integration

After successful deployment, update your frontend configuration with:

1. The Program ID from the deployment
2. The network endpoint (devnet/testnet/mainnet)
3. Any custom IDL if using Anchor 