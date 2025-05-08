const anchor = require('@project-serum/anchor');
const { LAMPORTS_PER_SOL, SystemProgram } = anchor.web3;
const { BN } = anchor;
const assert = require('assert');
const { PublicKey, Keypair } = anchor.web3;
const {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  createMint,
  mintToChecked,
} = require('@solana/spl-token');

describe('rwa-marketplace-integration', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Establo;
  
  // New keypairs
  const admin = Keypair.generate();
  const user = Keypair.generate();
  
  // PDA for config
  let configAddress;
  let configBump;
  
  // PDA for marketplace
  let marketplaceAddress;
  let marketplaceBump;
  
  // NFT mint and accounts
  let usdtMint;
  let stablecoinMint;
  let propertyMint;
  let daoTokenAccount;
  
  before(async () => {
    // Airdrop SOL to admin and user
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(admin.publicKey, 100 * LAMPORTS_PER_SOL),
      "confirmed"
    );
    
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 10 * LAMPORTS_PER_SOL),
      "confirmed"
    );
    
    // Find config PDA
    [configAddress, configBump] = await PublicKey.findProgramAddress(
      [Buffer.from("config")],
      program.programId
    );
    
    // Find marketplace PDA
    [marketplaceAddress, marketplaceBump] = await PublicKey.findProgramAddress(
      [Buffer.from("marketplace")],
      program.programId
    );
    
    // Create USDT mint
    usdtMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      6
    );
    
    // Create stablecoin mint
    stablecoinMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      9
    );
    
    // Create dao token account
    daoTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      admin,
      stablecoinMint,
      admin.publicKey
    );
  });
  
  it('Initialize stablecoin and marketplace', async () => {
    // Initialize stablecoin
    await program.methods
      .initialize(usdtMint, daoTokenAccount, 9)
      .accounts({
        config: configAddress,
        admin: admin.publicKey,
        mint: stablecoinMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([admin])
      .rpc();
      
    // Verify stablecoin config
    const config = await program.account.config.fetch(configAddress);
    assert.equal(config.admin.toString(), admin.publicKey.toString());
    assert.equal(config.usdtMint.toString(), usdtMint.toString());
    assert.equal(config.daoTokenAccount.toString(), daoTokenAccount.toString());
    assert.equal(config.mint.toString(), stablecoinMint.toString());
    assert.equal(config.decimals, 9);
    
    // Initialize RWA marketplace
    await program.methods
      .initializeMarketplace(configAddress)
      .accounts({
        marketplace: marketplaceAddress,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([admin])
      .rpc();
      
    // Verify marketplace
    const marketplace = await program.account.marketplace.fetch(marketplaceAddress);
    assert.equal(marketplace.admin.toString(), admin.publicKey.toString());
    assert.equal(marketplace.stablecoinConfig.toString(), configAddress.toString());
    assert.equal(marketplace.nftCount.toNumber(), 0);
    assert.equal(marketplace.liquidationThreshold, 90);
  });
  
  it('List a real estate property as NFT', async () => {
    // Create NFT for property
    propertyMint = await createMint(
      provider.connection,
      admin,
      user.publicKey,
      null,
      0 // 0 decimals for NFT
    );
    
    // Find property PDA
    const [propertyAddress] = await PublicKey.findProgramAddress(
      [Buffer.from("property"), propertyMint.toBuffer()],
      program.programId
    );
    
    // Create token account for user
    const userTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      user,
      propertyMint,
      user.publicKey
    );
    
    // Define metadata
    const uri = "https://arweave.net/property-metadata";
    const name = "Luxury Villa";
    const symbol = "RVILLA";
    const assetValue = new BN(500000 * 10**6); // $500,000
    const location = "Miami, FL";
    const propertyDetails = "4 BR, 3 BA, 3,200 sq ft luxury villa with pool";
    
    // Get metadata accounts
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    
    const metadataAddress = (await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        propertyMint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
    
    const masterEditionAddress = (await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        propertyMint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
    
    // List the property
    await program.methods
      .listRwa(
        uri,
        name,
        symbol,
        assetValue,
        location,
        propertyDetails,
        null // Use default liquidation threshold
      )
      .accounts({
        marketplace: marketplaceAddress,
        property: propertyAddress,
        owner: user.publicKey,
        mint: propertyMint,
        tokenAccount: userTokenAccount,
        metadata: metadataAddress,
        masterEdition: masterEditionAddress,
        stablecoinConfig: configAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.web3.APP_ID,
        metadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([user])
      .rpc();
      
    // Verify property was created
    const property = await program.account.realEstateProperty.fetch(propertyAddress);
    assert.equal(property.owner.toString(), user.publicKey.toString());
    assert.equal(property.mint.toString(), propertyMint.toString());
    assert.equal(property.value.toString(), assetValue.toString());
    assert.equal(property.initialValue.toString(), assetValue.toString());
    assert.equal(property.location, location);
    assert.equal(property.details, propertyDetails);
    assert.deepEqual(property.status, { listed: {} });
    
    // Verify marketplace state
    const marketplace = await program.account.marketplace.fetch(marketplaceAddress);
    assert.equal(marketplace.nftCount.toNumber(), 1);
    
    // Check if stablecoin reserves were updated
    const reserves = await program.methods
      .getReserves()
      .accounts({
        config: configAddress,
      })
      .view();
      
    assert.equal(reserves.realEstateValue.toString(), assetValue.toString());
  });
  
  it('Update property valuation', async () => {
    // Find property PDA
    const [propertyAddress] = await PublicKey.findProgramAddress(
      [Buffer.from("property"), propertyMint.toBuffer()],
      program.programId
    );
    
    // New valuation (10% increase)
    const newValue = new BN(550000 * 10**6); // $550,000
    
    // Update valuation
    await program.methods
      .updateValuation(newValue)
      .accounts({
        marketplace: marketplaceAddress,
        property: propertyAddress,
        owner: user.publicKey,
        authority: user.publicKey,
        stablecoinConfig: configAddress,
      })
      .signers([user])
      .rpc();
      
    // Verify property was updated
    const property = await program.account.realEstateProperty.fetch(propertyAddress);
    assert.equal(property.value.toString(), newValue.toString());
    
    // Check if stablecoin reserves were updated
    const reserves = await program.methods
      .getReserves()
      .accounts({
        config: configAddress,
      })
      .view();
      
    assert.equal(reserves.realEstateValue.toString(), newValue.toString());
  });
  
  it('Mint stablecoins backed by real estate value', async () => {
    // Add USDT to reserves (70%)
    const usdtReserve = new BN(385000 * 10**6); // $385,000 (70% of $550,000)
    await program.methods
      .updateReserves(usdtReserve, new BN(550000 * 10**6))
      .accounts({
        config: configAddress,
        admin: admin.publicKey,
      })
      .signers([admin])
      .rpc();
    
    // Create recipient token account
    const recipientTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      admin,
      stablecoinMint,
      user.publicKey
    );
    
    // Mint 500,000 tokens
    const mintAmount = new BN(500000 * 10**9); // $500,000 with 9 decimals
    await program.methods
      .mint(mintAmount)
      .accounts({
        config: configAddress,
        admin: admin.publicKey,
        mint: stablecoinMint,
        recipientTokenAccount: recipientTokenAccount,
        mintAuthority: admin.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([admin])
      .rpc();
    
    // Verify tokens were minted
    const balance = await provider.connection.getTokenAccountBalance(recipientTokenAccount);
    assert.equal(balance.value.amount, mintAmount.toString());
  });
  
  it('Simulate a property devaluation with liquidation risk', async () => {
    // Find property PDA
    const [propertyAddress] = await PublicKey.findProgramAddress(
      [Buffer.from("property"), propertyMint.toBuffer()],
      program.programId
    );
    
    // New valuation (45% decrease - below liquidation threshold)
    const newValue = new BN(302500 * 10**6); // $302,500 (55% of initial value, below 90% threshold)
    
    // Update valuation (only admin can decrease)
    await program.methods
      .updateValuation(newValue)
      .accounts({
        marketplace: marketplaceAddress,
        property: propertyAddress,
        owner: user.publicKey,
        authority: admin.publicKey,
        stablecoinConfig: configAddress,
      })
      .signers([admin])
      .rpc();
      
    // Verify property status changed to at-risk
    const property = await program.account.realEstateProperty.fetch(propertyAddress);
    assert.equal(property.value.toString(), newValue.toString());
    assert.deepEqual(property.status, { atRisk: {} });
  });
  
  it('Liquidate an at-risk property', async () => {
    // Find property PDA
    const [propertyAddress] = await PublicKey.findProgramAddress(
      [Buffer.from("property"), propertyMint.toBuffer()],
      program.programId
    );
    
    // Get NFT account of user
    const userTokenAccount = await getAssociatedTokenAddress(
      propertyMint,
      user.publicKey
    );
    
    // Get admin token account
    const adminTokenAccount = await getAssociatedTokenAddress(
      propertyMint,
      admin.publicKey
    );
    
    // Liquidate the property
    await program.methods
      .liquidateRwa()
      .accounts({
        marketplace: marketplaceAddress,
        property: propertyAddress,
        admin: admin.publicKey,
        owner: user.publicKey,
        ownerTokenAccount: userTokenAccount,
        adminTokenAccount: adminTokenAccount,
        mint: propertyMint,
        stablecoinConfig: configAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.web3.APP_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([admin, user]) // Both sign in this test
      .rpc();
      
    // Verify property status changed to liquidated
    const property = await program.account.realEstateProperty.fetch(propertyAddress);
    assert.deepEqual(property.status, { liquidated: {} });
    
    // Verify NFT was transferred to admin
    const adminBalance = await provider.connection.getTokenAccountBalance(adminTokenAccount);
    assert.equal(adminBalance.value.amount, "1");
  });
});
