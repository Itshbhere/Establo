use anchor_lang::prelude::*;
use solana_program::{
    program_error::ProgramError,
    msg,
};
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum StablecoinError {
    #[error("Unauthorized access")]
    Unauthorized,
    
    #[error("Invalid DAO account")]
    InvalidDaoAccount,
    
    #[error("Insufficient reserves")]
    InsufficientReserves,
    
    #[error("Arithmetic overflow")]
    Overflow,
    
    #[error("Insufficient amount after fee")]
    InsufficientAmount,
}

impl From<StablecoinError> for ProgramError {
    fn from(e: StablecoinError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

#[derive(Error, Debug, Copy, Clone)]
pub enum RWAMarketplaceError {
    #[error("Unauthorized access")]
    Unauthorized,
    
    #[error("Invalid token account")]
    InvalidTokenAccount,
    
    #[error("Asset not eligible for liquidation")]
    NotEligibleForLiquidation,
    
    #[error("Invalid liquidation threshold (must be between 1-100)")]
    InvalidThreshold,
}

impl From<RWAMarketplaceError> for ProgramError {
    fn from(e: RWAMarketplaceError) -> Self {
        ProgramError::Custom(e as u32 + 100) // Offset to avoid collision with StablecoinError
    }
} 