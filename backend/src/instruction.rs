use anchor_lang::prelude::*;
use solana_program::{
    program_error::ProgramError,
    pubkey::Pubkey,
};
use std::convert::TryInto;

use crate::error::StablecoinError;

#[derive(Clone, Debug, PartialEq)]
pub enum StablecoinInstruction {
    //
    // CORE MVP FUNCTIONS
    //
    
    /// Initialize the stablecoin program
    /// Accounts:
    /// 0. `[writable]` Config PDA
    /// 1. `[writable, signer]` Admin account
    /// 2. `[writable]` Mint account
    /// 3. `[]` System program
    /// 4. `[]` Token program
    /// 5. `[]` Rent sysvar
    Initialize {
        usdt_mint: Pubkey,
        dao_token_account: Pubkey,
        decimals: u8,
    },

    /// Transfer tokens with a fee to the DAO
    /// Accounts:
    /// 0. `[writable]` Config account
    /// 1. `[writable, signer]` Sender account
    /// 2. `[writable]` Sender token account
    /// 3. `[writable]` Recipient token account
    /// 4. `[writable]` DAO token account
    /// 5. `[]` Token program
    Transfer {
        amount: u64,
    },

    /// Mint new tokens
    /// Accounts:
    /// 0. `[writable]` Config account
    /// 1. `[writable, signer]` Admin account
    /// 2. `[writable]` Mint account
    /// 3. `[writable]` Recipient token account
    /// 4. `[writable, signer]` Mint authority
    /// 5. `[]` Token program
    Mint {
        amount: u64,
    },

    /// Burn tokens
    /// Accounts:
    /// 0. `[writable]` Config account
    /// 1. `[writable, signer]` Admin account
    /// 2. `[writable]` Mint account
    /// 3. `[writable]` Token account
    /// 4. `[]` Token program
    Burn {
        amount: u64,
    },
    
    /// Initialize marketplace
    /// Accounts:
    /// 0. `[writable]` Marketplace PDA
    /// 1. `[writable, signer]` Admin account
    /// 2. `[]` System program
    /// 3. `[]` Rent sysvar
    InitializeMarketplace {
        stablecoin_config_address: Pubkey,
    },

    /// List new RWA
    /// Accounts: (simplified)
    ListRWA {
        uri: String,
        name: String,
        symbol: String,
        asset_value: u64,
        location: String,
        property_details: String,
        liquidation_threshold: Option<u8>,
    },

    //
    // PHASE 2 FEATURES - TO BE IMPLEMENTED
    // 
    
    /// Update reserves
    /// Accounts:
    /// 0. `[writable]` Config account
    /// 1. `[writable, signer]` Admin account
    UpdateReserves {
        usdt_amount: u64,
        real_estate_value: u64,
    },

    /// Update DAO account
    /// Accounts:
    /// 0. `[writable]` Config account
    /// 1. `[writable, signer]` Admin account
    UpdateDaoAccount {
        new_dao_account: Pubkey,
    },

    /// Update valuation
    /// Accounts: (simplified)
    UpdateValuation {
        new_value: u64,
    },

    /// Transfer RWA
    /// Accounts: (simplified)
    TransferRWA,

    /// Liquidate RWA
    /// Accounts: (simplified)
    LiquidateRWA,

    /// Set liquidation threshold
    /// Accounts: (simplified)
    SetLiquidationThreshold {
        threshold: u8,
    },
}

impl StablecoinInstruction {
    /// Unpacks a byte buffer into a StablecoinInstruction
    pub fn unpack(input: &[u8]) -> std::result::Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;

        Ok(match tag {
            0 => {
                let usdt_mint = Pubkey::new(&rest[..32]);
                let dao_token_account = Pubkey::new(&rest[32..64]);
                let decimals = rest[64];
                Self::Initialize {
                    usdt_mint,
                    dao_token_account,
                    decimals,
                }
            }
            1 => {
                let amount = rest
                    .get(..8)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u64::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                Self::Transfer { amount }
            }
            2 => {
                let amount = rest
                    .get(..8)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u64::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                Self::Mint { amount }
            }
            3 => {
                let amount = rest
                    .get(..8)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u64::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                Self::Burn { amount }
            }
            4 => {
                let usdt_amount = rest
                    .get(..8)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u64::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                let real_estate_value = rest
                    .get(8..16)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u64::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                Self::UpdateReserves {
                    usdt_amount,
                    real_estate_value,
                }
            }
            5 => {
                let new_dao_account = Pubkey::new(&rest[..32]);
                Self::UpdateDaoAccount { new_dao_account }
            }
            6 => {
                let stablecoin_config_address = Pubkey::new(&rest[..32]);
                Self::InitializeMarketplace {
                    stablecoin_config_address,
                }
            }
            7 => {
                // First read fixed-size fields
                let asset_value = rest
                    .get(..8)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u64::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                
                let threshold_option = rest.get(8).copied();
                let threshold = threshold_option.map(|t| t);
                
                // Note: In a real implementation, you'd parse the string data here
                // This is a simplified version for the Playground
                Self::ListRWA {
                    uri: String::from("metadata_uri"),              // This would come from the instruction data
                    name: String::from("Property NFT"),             // This would come from the instruction data
                    symbol: String::from("RWA"),                    // This would come from the instruction data
                    asset_value,
                    location: String::from("Location"),             // This would come from the instruction data
                    property_details: String::from("Details"),      // This would come from the instruction data
                    liquidation_threshold: threshold,
                }
            },
            8 => {
                let new_value = rest
                    .get(..8)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u64::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                Self::UpdateValuation { new_value }
            },
            9 => Self::TransferRWA,
            10 => Self::LiquidateRWA,
            11 => {
                let threshold = rest.get(0).copied().ok_or(ProgramError::InvalidInstructionData)?;
                Self::SetLiquidationThreshold { threshold }
            },
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
} 