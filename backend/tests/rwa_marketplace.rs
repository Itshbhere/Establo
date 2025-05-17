use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
use green_stablecoin::rwa_marketplace::{self, Marketplace, RealEstateProperty, AssetStatus};
use green_stablecoin::Config as StablecoinConfig;
use green_stablecoin::program::GreenStablecoin;
use solana_program::system_program;
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    signature::{Keypair, Signer},
    transaction::Transaction,
    transport::TransportError,
};

#[tokio::test]
async fn test_rwa_marketplace_initialize() {
    // Set up program test
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "green_stablecoin",
        program_id,
        processor!(green_stablecoin::entry),
    );

    // Generate necessary keypairs
    let admin = Keypair::new();
    
    // Create stablecoin config (simulated)
    let stablecoin_config_keypair = Keypair::new();
    let stablecoin_config = stablecoin_config_keypair.pubkey();

    // Add accounts to test environment
    program_test.add_account(
        admin.pubkey(),
        Account {
            lamports: 1_000_000_000,
            data: vec![],
            owner: system_program::id(),
            executable: false,
            rent_epoch: 0,
        },
    );

    // Start the test environment
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    // Find PDA for marketplace
    let (marketplace_pda, bump) = Pubkey::find_program_address(&[b"marketplace"], &program_id);

    // Create initialize instruction
    let ix = anchor_lang::solana_program::instruction::Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(marketplace_pda, false),
            AccountMeta::new(admin.pubkey(), true),
            AccountMeta::new_readonly(system_program::id(), false),
            AccountMeta::new_readonly(sysvar::rent::id(), false),
        ],
        data: anchor_lang::InstructionData::new(
            anchor_lang::Discriminator::new("global", "initialize_marketplace"),
            rwa_marketplace::instruction::Initialize {
                stablecoin_config_address: stablecoin_config,
            },
        )
        .to_vec(),
    };

    // Create and sign transaction
    let mut tx = Transaction::new_with_payer(&[ix], Some(&payer.pubkey()));
    tx.sign(&[&payer, &admin], recent_blockhash);

    // Process transaction
    banks_client.process_transaction(tx).await.unwrap();

    // Verify marketplace account was initialized correctly
    let marketplace_account = banks_client.get_account(marketplace_pda).await.unwrap().unwrap();
    let marketplace = Marketplace::try_deserialize(&mut marketplace_account.data.as_ref()).unwrap();
    assert_eq!(marketplace.admin, admin.pubkey());
    assert_eq!(marketplace.stablecoin_config, stablecoin_config);
    assert_eq!(marketplace.nft_count, 0);
    assert_eq!(marketplace.liquidation_threshold, 90);
}

#[tokio::test]
async fn test_list_rwa() {
    // This test will be completed after we fix any issues in the smart contract
    // It should test the RWA listing functionality, NFT creation, and updates to stablecoin reserves
}

// Additional tests to be implemented:
// - test_update_valuation
// - test_transfer_rwa
// - test_liquidate_rwa
// - test_set_liquidation_threshold 