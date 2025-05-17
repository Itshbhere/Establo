use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use green_stablecoin::program::GreenStablecoin;
use green_stablecoin::{self, StablecoinTransfer, Config};
use solana_program::system_program;
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    signature::{Keypair, Signer},
    transaction::Transaction,
    transport::TransportError,
};

#[tokio::test]
async fn test_stablecoin_initialize() {
    // Set up program test
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "green_stablecoin",
        program_id,
        processor!(green_stablecoin::entry),
    );

    // Generate necessary keypairs
    let admin = Keypair::new();
    let mint_authority = Keypair::new();
    let mint = Keypair::new();
    let usdt_mint = Keypair::new();
    let dao_token_account = Keypair::new();

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

    // Find PDA for config
    let (config_pda, bump) = Pubkey::find_program_address(&[b"config"], &program_id);

    // Create initialize instruction
    let ix = anchor_lang::solana_program::instruction::Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(config_pda, false),
            AccountMeta::new(admin.pubkey(), true),
            AccountMeta::new(mint.pubkey(), false),
            AccountMeta::new_readonly(system_program::id(), false),
            AccountMeta::new_readonly(token::ID, false),
            AccountMeta::new_readonly(sysvar::rent::id(), false),
        ],
        data: anchor_lang::InstructionData::new(
            anchor_lang::Discriminator::new("global", "initialize"),
            green_stablecoin::instruction::Initialize {
                usdt_mint: usdt_mint.pubkey(),
                dao_token_account: dao_token_account.pubkey(),
                decimals: 6,
            },
        )
        .to_vec(),
    };

    // Create and sign transaction
    let mut tx = Transaction::new_with_payer(&[ix], Some(&payer.pubkey()));
    tx.sign(&[&payer, &admin], recent_blockhash);

    // Process transaction
    banks_client.process_transaction(tx).await.unwrap();

    // Verify config account was initialized correctly
    let config_account = banks_client.get_account(config_pda).await.unwrap().unwrap();
    let config = Config::try_deserialize(&mut config_account.data.as_ref()).unwrap();
    assert_eq!(config.admin, admin.pubkey());
    assert_eq!(config.usdt_mint, usdt_mint.pubkey());
    assert_eq!(config.dao_token_account, dao_token_account.pubkey());
    assert_eq!(config.decimals, 6);
}

// Additional tests to be implemented:
// - test_stablecoin_transfer
// - test_mint_tokens
// - test_burn_tokens
// - test_update_reserves
// - test_update_dao_account 