use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
use solana_program::program_pack::Pack;

// Define constants for metadata as the external crate is causing issues
pub const PREFIX: &str = "metadata";

// We're defining our own simplified Creator struct since we can't import it
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Creator {
    pub address: Pubkey,
    pub verified: bool,
    pub share: u8,
}

declare_id!("3YGXqNveAS9ZEG1mQXGMrpRzrCGfJrLEVf2zzSS9rJwt"); // Replace with your program ID

// Core RWA marketplace functionality for MVP
// Initialize the marketplace
pub fn initialize(ctx: Context<Initialize>, 
                  stablecoin_config_address: Pubkey) -> Result<()> {
    let marketplace = &mut ctx.accounts.marketplace;
    marketplace.admin = ctx.accounts.admin.key();
    marketplace.stablecoin_config = stablecoin_config_address;
    marketplace.nft_count = 0;
    marketplace.liquidation_threshold = 90; // 90% (default threshold)
    Ok(())
}

// List a new RWA (Real Estate) as NFT
pub fn list_rwa(
    ctx: Context<ListRWA>,
    uri: String,
    name: String,
    symbol: String,
    asset_value: u64,
    location: String,
    property_details: String,
    liquidation_threshold: Option<u8>,
) -> Result<()> {
    let marketplace = &mut ctx.accounts.marketplace;
    let property = &mut ctx.accounts.property;
    
    // Set the property details
    property.owner = ctx.accounts.owner.key();
    property.mint = ctx.accounts.mint.key();
    property.value = asset_value;
    property.initial_value = asset_value;
    property.last_valuation_date = Clock::get()?.unix_timestamp;
    property.location = location;
    property.details = property_details;
    property.status = AssetStatus::Listed;
    property.liquidation_threshold = liquidation_threshold.unwrap_or(marketplace.liquidation_threshold);
    
    // Create metadata account - simplified for compatibility
    let creators = vec![
        Creator {
            address: ctx.accounts.owner.key(),
            verified: false,
            share: 100,
        },
    ];
    
    // NOTE: For Playground deployment, we're using a simplified approach without the actual metadata instruction
    // as it's causing compatibility issues. In a production environment, you would use the real metadata program.

    // Instead, mint the NFT directly to the owner
    let cpi_accounts = token::MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::mint_to(cpi_ctx, 1)?;
    
    // Increment NFT count
    marketplace.nft_count = marketplace.nft_count.checked_add(1).unwrap();
    
    // Update the stablecoin contract's real estate value
    update_stablecoin_reserves(ctx.accounts.stablecoin_config.to_account_info(), asset_value)?;
    
    // Emit event
    emit!(RWAListedEvent {
        owner: ctx.accounts.owner.key(),
        mint: ctx.accounts.mint.key(),
        value: asset_value,
        location: location,
    });
    
    Ok(())
}

// PHASE 2 FEATURES - TO BE IMPLEMENTED
// The following advanced features will be implemented in future phases

/* 
// Update the valuation of an RWA
pub fn update_valuation(
    ctx: Context<UpdateValuation>,
    new_value: u64
) -> Result<()> {
    let property = &mut ctx.accounts.property;
    let old_value = property.value;
    
    // Only allow admin to decrease the value (for safety)
    if new_value < old_value && ctx.accounts.authority.key() != ctx.accounts.marketplace.admin {
        return Err(error!(RWAMarketplaceError::Unauthorized));
    }
    
    // Check if new value is below liquidation threshold
    let liquidation_value = property.initial_value
        .checked_mul(property.liquidation_threshold as u64)
        .unwrap()
        .checked_div(100)
        .unwrap();
        
    if new_value < liquidation_value {
        property.status = AssetStatus::AtRisk;
        emit!(RWALiquidationRiskEvent {
            mint: property.mint,
            current_value: new_value,
            liquidation_threshold: liquidation_value,
        });
    }
    
    // Update the property value
    property.value = new_value;
    property.last_valuation_date = Clock::get()?.unix_timestamp;
    
    // Update stablecoin reserves with the difference
    if old_value != new_value {
        update_stablecoin_reserves(ctx.accounts.stablecoin_config.to_account_info(), new_value)?;
    }
    
    // Emit event
    emit!(RWAValuationUpdatedEvent {
        mint: property.mint,
        old_value,
        new_value,
        timestamp: property.last_valuation_date,
    });
    
    Ok(())
}

// Transfer ownership of an RWA
pub fn transfer_rwa(
    ctx: Context<TransferRWA>,
) -> Result<()> {
    let property = &mut ctx.accounts.property;
    
    // Ensure the NFT is being transferred
    let cpi_accounts = token::Transfer {
        from: ctx.accounts.from_token_account.to_account_info(),
        to: ctx.accounts.to_token_account.to_account_info(),
        authority: ctx.accounts.current_owner.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, 1)?;
    
    // Update property owner
    property.owner = ctx.accounts.new_owner.key();
    
    // Emit event
    emit!(RWATransferredEvent {
        mint: property.mint,
        from: ctx.accounts.current_owner.key(),
        to: ctx.accounts.new_owner.key(),
        value: property.value,
    });
    
    Ok(())
}

// Liquidate an RWA
pub fn liquidate_rwa(
    ctx: Context<LiquidateRWA>,
) -> Result<()> {
    let property = &mut ctx.accounts.property;
    
    // Transfer NFT from owner to admin
    let cpi_accounts = token::Transfer {
        from: ctx.accounts.owner_token_account.to_account_info(),
        to: ctx.accounts.admin_token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    
    // Create a signer seeds for CPI
    let bump_seed = *ctx.bumps.get("property").unwrap();
    let property_seeds = &[
        b"property",
        ctx.accounts.mint.key().as_ref(),
        &[bump_seed],
    ];
    let signer = &[&property_seeds[..]];
    
    // Execute the transfer
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        signer,
    );
    token::transfer(cpi_ctx, 1)?;
    
    // Update property status
    property.status = AssetStatus::Liquidated;
    
    // Update real estate value in stablecoin contract
    update_stablecoin_reserves_for_liquidation(ctx.accounts.stablecoin_config.to_account_info(), property.value)?;
    
    // Emit event
    emit!(RWALiquidatedEvent {
        mint: property.mint,
        owner: ctx.accounts.owner.key(),
        value: property.value,
    });
    
    Ok(())
}

// Set liquidation threshold
pub fn set_liquidation_threshold(
    ctx: Context<SetLiquidationThreshold>,
    threshold: u8
) -> Result<()> {
    require!(
        threshold > 0 && threshold <= 100,
        RWAMarketplaceError::InvalidThreshold
    );
    
    let marketplace = &mut ctx.accounts.marketplace;
    marketplace.liquidation_threshold = threshold;
    
    // Emit event
    emit!(LiquidationThresholdUpdatedEvent {
        new_threshold: threshold,
    });
    
    Ok(())
}
*/

// Helper function to update the stablecoin contract with new real estate value
fn update_stablecoin_reserves(stablecoin_config: AccountInfo, real_estate_value: u64) -> Result<()> {
    // In a real implementation, this would call the stablecoin contract to update reserves
    // For now, we just emit an event
    emit!(StablecoinReservesUpdatedEvent {
        real_estate_value,
    });
    Ok(())
}

// Helper function to update stablecoin reserves when liquidating property
fn update_stablecoin_reserves_for_liquidation(stablecoin_config: AccountInfo, value_to_remove: u64) -> Result<()> {
    // In a real implementation, this would call the stablecoin contract to update reserves
    // For now, we just emit an event with 0 value to indicate liquidation
    emit!(StablecoinReservesUpdatedEvent {
        real_estate_value: 0,
    });
    Ok(())
}

// Account and structure definitions
#[account]
pub struct Marketplace {
    pub admin: Pubkey,                    // Admin authority
    pub stablecoin_config: Pubkey,        // Reference to stablecoin config
    pub nft_count: u64,                   // Number of NFTs minted
    pub liquidation_threshold: u8,        // Default liquidation threshold (percentage)
}

#[account]
pub struct RealEstateProperty {
    pub owner: Pubkey,                    // Current owner
    pub mint: Pubkey,                     // NFT mint address
    pub value: u64,                       // Current valuation
    pub initial_value: u64,               // Initial listing value
    pub last_valuation_date: i64,         // Timestamp of last valuation
    pub location: String,                 // Property location
    pub details: String,                  // Property details
    pub status: AssetStatus,              // Current status
    pub liquidation_threshold: u8,        // Asset-specific liquidation threshold
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum AssetStatus {
    Listed,
    AtRisk,
    Liquidated,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 8 + 1,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ListRWA<'info> {
    #[account(mut, seeds = [b"marketplace"], bump)]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 8 + 8 + 8 + 128 + 256 + 1 + 1,
        seeds = [b"property", mint.key().as_ref()],
        bump
    )]
    pub property: Account<'info, RealEstateProperty>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        init,
        payer = owner,
        mint::decimals = 0,
        mint::authority = owner,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = owner,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is not dangerous because we're only using it in cpi
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    
    /// CHECK: This is not dangerous because we're only using it in cpi
    #[account(mut)]
    pub master_edition: AccountInfo<'info>,
    
    /// CHECK: This is the stablecoin config account
    pub stablecoin_config: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    
    /// CHECK: This is the metadata program
    pub metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// These account structures are kept for future implementation
#[derive(Accounts)]
pub struct UpdateValuation<'info> {
    #[account(mut, seeds = [b"marketplace"], bump)]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(
        mut,
        seeds = [b"property", property.mint.as_ref()],
        bump,
        constraint = property.owner == owner.key() || authority.key() == marketplace.admin @ RWAMarketplaceError::Unauthorized
    )]
    pub property: Account<'info, RealEstateProperty>,
    
    pub owner: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This is the stablecoin config account
    pub stablecoin_config: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct TransferRWA<'info> {
    #[account(
        mut,
        seeds = [b"property", property.mint.as_ref()],
        bump,
        constraint = property.owner == current_owner.key() @ RWAMarketplaceError::Unauthorized
    )]
    pub property: Account<'info, RealEstateProperty>,
    
    #[account(mut)]
    pub current_owner: Signer<'info>,
    pub new_owner: AccountInfo<'info>,
    
    #[account(
        mut,
        constraint = from_token_account.owner == current_owner.key() && from_token_account.mint == property.mint @ RWAMarketplaceError::InvalidTokenAccount
    )]
    pub from_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = current_owner,
        associated_token::mint = mint,
        associated_token::authority = new_owner,
    )]
    pub to_token_account: Account<'info, TokenAccount>,
    
    #[account(constraint = mint.key() == property.mint)]
    pub mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct LiquidateRWA<'info> {
    #[account(mut, seeds = [b"marketplace"], bump)]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(
        mut,
        seeds = [b"property", property.mint.as_ref()],
        bump,
        constraint = property.status == AssetStatus::AtRisk @ RWAMarketplaceError::NotEligibleForLiquidation
    )]
    pub property: Account<'info, RealEstateProperty>,
    
    #[account(mut, constraint = admin.key() == marketplace.admin @ RWAMarketplaceError::Unauthorized)]
    pub admin: Signer<'info>,
    
    #[account(mut, constraint = owner.key() == property.owner)]
    pub owner: AccountInfo<'info>,
    
    #[account(
        mut,
        constraint = owner_token_account.owner == owner.key() && owner_token_account.mint == property.mint @ RWAMarketplaceError::InvalidTokenAccount
    )]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = admin,
        associated_token::mint = mint,
        associated_token::authority = admin,
    )]
    pub admin_token_account: Account<'info, TokenAccount>,
    
    #[account(constraint = mint.key() == property.mint)]
    pub mint: Account<'info, Mint>,
    
    /// CHECK: This is the stablecoin config account
    pub stablecoin_config: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SetLiquidationThreshold<'info> {
    #[account(mut, seeds = [b"marketplace"], bump)]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(mut, constraint = admin.key() == marketplace.admin @ RWAMarketplaceError::Unauthorized)]
    pub admin: Signer<'info>,
}

// Events
#[event]
pub struct RWAListedEvent {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub value: u64,
    pub location: String,
}

#[event]
pub struct RWAValuationUpdatedEvent {
    pub mint: Pubkey,
    pub old_value: u64,
    pub new_value: u64,
    pub timestamp: i64,
}

#[event]
pub struct RWATransferredEvent {
    pub mint: Pubkey,
    pub from: Pubkey,
    pub to: Pubkey,
    pub value: u64,
}

#[event]
pub struct RWALiquidationRiskEvent {
    pub mint: Pubkey,
    pub current_value: u64,
    pub liquidation_threshold: u64,
}

#[event]
pub struct RWALiquidatedEvent {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub value: u64,
}

#[event]
pub struct LiquidationThresholdUpdatedEvent {
    pub new_threshold: u8,
}

#[event]
pub struct StablecoinReservesUpdatedEvent {
    pub real_estate_value: u64,
}

#[error_code]
pub enum RWAMarketplaceError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid token account")]
    InvalidTokenAccount,
    #[msg("Asset not eligible for liquidation")]
    NotEligibleForLiquidation,
    #[msg("Invalid liquidation threshold (must be between 1-100)")]
    InvalidThreshold,
}
