import * as anchor from "@project-serum/anchor";
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  createMint,
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddressSync,
  createInitializeAccountInstruction,
  createAssociatedTokenAccountInstruction,
  getMinimumBalanceForRentExemptAccount,
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";
import { Wallet } from "@project-serum/anchor";
import { BN } from "bn.js"; // ⚡ safest — BN is actually from bn.js

// ========= Config =========
const PROGRAM_ID = new PublicKey(
  "76sgJHKdFqnRQ4sheZzjbNFdqFKvS4akdTbeAhsNB3BA"
);
const CLUSTER_URL = "https://api.devnet.solana.com";
// const CLUSTER_URL = "https://solana-devnet.rpcpool.com"; // alternative

// Get IDL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const idlPath = path.join(__dirname, "./marketplace.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
// import idl from '../target/idl/zktc.json' assert {type : "json"};
if (!idl.version || !idl.instructions || !idl.accounts) {
  throw new Error(
    "❌ IDL is invalid: missing version, instructions, or accounts"
  );
}

console.log("✅ IDL is valid, version:", idl.version);

// Load wallet
const secretKeyPath = path.join(__dirname, "../new4_program-keypair.json"); // NFT buyer

// const secretKeyPath = path.join(__dirname, "../new_program-keypair.json"); // NFT lister
const secretKeyString = fs.readFileSync(secretKeyPath, "utf8");
const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
const payer = Keypair.fromSecretKey(secretKey);
const wallet = new Wallet(payer);

// ========= Provider / Program =========
const connection = new Connection(CLUSTER_URL, "confirmed");
const provider = new anchor.AnchorProvider(connection, wallet, {
  preflightCommitment: "confirmed",
});
anchor.setProvider(provider);
const program = new anchor.Program(idl, PROGRAM_ID, provider);
/////////////

const name = "MyMarket"; // <= must be < 33 chars
const fee = 250; // 2.5% (in basis points)

// Derive PDA addresses (must match seeds in your Rust)
const [marketplacePda] = PublicKey.findProgramAddressSync(
  [Buffer.from("marketplace"), Buffer.from(name)],
  program.programId
);

const [rewardsMintPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("rewards"), marketplacePda.toBuffer()],
  program.programId
);

const [treasuryPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("treasury"), marketplacePda.toBuffer()],
  program.programId
);
async function initializeMarketplace() {
  console.log("Marketplace PDA:", marketplacePda.toBase58());
  console.log("Rewards Mint PDA:", rewardsMintPda.toBase58());
  console.log("Treasury PDA:", treasuryPda.toBase58());

  // Call initialize
  const tx = await program.methods
    .initialize(name, fee)
    .accounts({
      admin: wallet.publicKey,
      marketplace: marketplacePda,
      rewardsMint: rewardsMintPda,
      treasury: treasuryPda,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    })
    .rpc();

  console.log("✅ Marketplace initialized!");
  console.log("🔗 Tx:", tx);
}

// initializeMarketplace().catch(console.error);

// ✅ Marketplace initialized!
// 🔗 Tx: 63T1dBQKvJ8CRuh3ansBzb73iwM7EkojaWtsNtp3XUPyR36tm1cg5U7mPNk7kDcb7n8JkTMLZHMsuSxqzjHVUHSX/////////////
/////////////

// Listing PDA
const nftMint = new PublicKey("CFSa2tjMU8Qkgt8LChdXRaU4rNGmM1yBs1dhbwzm17Mc"); // the NFT being listed

const [listingPda] = PublicKey.findProgramAddressSync(
  [marketplacePda.toBuffer(), nftMint.toBuffer()],
  program.programId
);

// Vault ATA (belongs to listing PDA as authority)
const vaultAta = getAssociatedTokenAddressSync(
  nftMint,
  listingPda,
  true // allowOwnerOffCurve
);
// maker ata must be nft holder
const makerAta = getAssociatedTokenAddressSync(nftMint, wallet.publicKey);
// Maker’s ATA
// (async () => {
//   const tx = await program.methods
//     .list(new BN(1_000_000_000)) // price in lamports (example: 1 SOL)
//     .accounts({
//       maker: payer.publicKey,
//       marketplace: marketplacePda,
//       makerMint: nftMint,
//       makerAta: makerAta,
//       vault: vaultAta,
//       listing: listingPda,
//       metadata: await PublicKey.findProgramAddressSync(
//         [
//           Buffer.from("metadata"),
//           new PublicKey(
//             "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
//           ).toBuffer(),
//           nftMint.toBuffer(),
//         ],
//         new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s") // metadata program
//       )[0],
//       masterEdition: await PublicKey.findProgramAddressSync(
//         [
//           Buffer.from("metadata"),
//           new PublicKey(
//             "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
//           ).toBuffer(),
//           nftMint.toBuffer(),
//           Buffer.from("edition"),
//         ],
//         new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
//       )[0],
//       metadataProgram: new PublicKey(
//         "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
//       ),
//       associatedTokenProgram: anchor.web3.ASSOCIATED_TOKEN_PROGRAM_ID,
//       systemProgram: anchor.web3.SystemProgram.programId,
//       tokenProgram: new PublicKey(
//         "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//       ), // SPL Token program
//     })
//     .signers([payer])
//     .rpc();

//   console.log("✅ NFT Listed, tx:", tx);
// })();
// ✅ NFT Listed, tx: 2VDNJLZrNHgq4yWaazykDiKkqhSBgkPhWkQdMWfiKyWrbXXvtxxcrMudNKEhUiFYkM2NtxAaCcTzBMEV322fm6rK
// ✅ NFT Listed, tx: 3b8bvy6VGuoUt6xsVeJAGvpcbb7a5bsuBAeZcpRr5mkN116cVEakDd18NS7EyVeaobC88HL5VCvLsbFVSbRLzhdd
/////////////////////////
//public states
// (async () => {
//   const marketplaceState = await program.account.marketplace.fetch(
//     marketplacePda
//   );

//   console.log("Marketplace Name:", marketplaceState.name.toString());
// })();
//////////////

// Delist

// Send transaction
// (async () => {
//   const tx = await program.methods
//     .delist()
//     .accounts({
//       maker: wallet.publicKey,
//       marketplace: marketplacePda,
//       makerMint: nftMint,
//       makerAta: makerAta,
//       listing: listingPda,
//       vault: vaultAta,
//       tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
//       systemProgram: anchor.web3.SystemProgram.programId,
//     })
//     .rpc();
//   console.log("✅ NFT DeListed, tx:", tx);
// })();
// ✅ NFT DeListed, tx: 2EJFux2KsyWcUobqTrqTGCcduUBnE9n4VE5DdS5zja4Wjfd82LHqnY4NkHU1WRkenJGwczBs9RPaL6QtCHo8CZEr
// ✅ NFT DeListed, tx: 4LW9bvwaknKQMjNfyJVxYy9r9kMTtmNTNrvqwin6VQF75km3Xu4PDEfkkNagoV2zqmGwywYmy78ZaL8sM5BuC7Xd
////////////////////////

// ========== Params ==========
const makerPubkey = new PublicKey(
  "CRb4bz1HSNaGtZX6qxuFrCYfnpND9cDu5ey2REqZuLNE"
); // 👈 seller wallet
const taker = payer; // buyer
// console.log("Taker (buyer):", taker.publicKey.toBase58());
// 1. Create/get ATA for taker (buyer)
(async () => {
  const takerAta = await getOrCreateAssociatedTokenAccount(
    connection,
    taker, // funds rent if ATA needs to be created
    nftMint,
    taker.publicKey
  );

  // Buyer ATA

  // Call purchase
  const tx = await program.methods
    .purchase()
    .accounts({
      taker: taker.publicKey,
      maker: makerPubkey,
      makerMint: nftMint,
      marketplace: marketplacePda,
      takerAta: takerAta,
      vault: vaultAta,
      rewards: rewardsMintPda, // still required in your struct
      listing: listingPda,
      treasury: treasuryPda,
      associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([taker])
    .rpc();

  console.log("✅ NFT Purchased! Tx:", tx);
})();
