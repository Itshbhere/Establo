use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("2tPFAWN8KNcMfWyMQ2Y522dPptcbaZHYE8bM9y7NzZva");

#[program]
pub mod green_stablecoin {
    use super::*;

    // Initialize the stablecoin program
    pub fn initialize(
        ctx: Context<Initialize>,
        usdt_mint: Pubkey,
        dao_token_account: Pubkey,
        decimals: u8,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.usdt_mint = usdt_mint;
        config.dao_token_account = dao_token_account;
        config.dao_contributions = 0;
        config.usdt_reserve = 0;
        config.real_estate_value = 0;
        config.mint = ctx.accounts.mint.key();
        config.decimals = decimals;
        Ok(())
    }

    // Transfer tokens with a 0.5% fee to the DAO
    pub fn transfer(ctx: Context<StablecoinTransfer>, amount: u64) -> Result<()> {
        let config = &ctx.accounts.config;

        // Calculate fee (0.5% = 50 basis points)
        let fee = amount
            .checked_mul(50)
            .ok_or(StablecoinError::Overflow)?
            .checked_div(10000)
            .ok_or(StablecoinError::Overflow)?;
        let amount_after_fee = amount
            .checked_sub(fee)
            .ok_or(StablecoinError::InsufficientAmount)?;

        // Transfer amount_after_fee to recipient
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_accounts = Transfer {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);
        token::transfer(cpi_ctx, amount_after_fee)?;

        // Transfer fee to DAO
        let cpi_accounts_fee = Transfer {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.dao_token_account.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
        };
        let cpi_ctx_fee = CpiContext::new(cpi_program, cpi_accounts_fee);
        token::transfer(cpi_ctx_fee, fee)?;

        // Update DAO contributions
        let config = &mut ctx.accounts.config;
        config.dao_contributions = config
            .dao_contributions
            .checked_add(fee)
            .ok_or(StablecoinError::Overflow)?;

        // Emit event
        emit!(TransferEvent {
            from: ctx.accounts.sender.key(),
            to: ctx.accounts.recipient_token_account.owner,
            amount: amount_after_fee,
            fee,
            dao: config.dao_token_account,
        });

        Ok(())
    }

    // Mint new tokens
    pub fn mint(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(ctx.accounts.admin.key() == config.admin, StablecoinError::Unauthorized);
        require!(is_backed(config, amount), StablecoinError::InsufficientReserves);

        // Mint tokens to recipient
        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, amount)?;

        // Emit event
        emit!(MintEvent {
            to: ctx.accounts.recipient_token_account.owner,
            amount,
        });

        Ok(())
    }

    // Burn tokens
    pub fn burn(ctx: Context<BurnTokens>, amount: u64) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(ctx.accounts.admin.key() == config.admin, StablecoinError::Unauthorized);

        // Burn tokens from account
        let cpi_accounts = token::Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.admin.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, amount)?;

        // Emit event
        emit!(BurnEvent {
            from: ctx.accounts.token_account.owner,
            amount,
        });

        Ok(())
    }

    // Update reserves (USDT and real estate)
    pub fn update_reserves(
        ctx: Context<UpdateReserves>,
        usdt_amount: u64,
        real_estate_value: u64,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require!(ctx.accounts.admin.key() == config.admin, StablecoinError::Unauthorized);

        config.usdt_reserve = usdt_amount;
        config.real_estate_value = real_estate_value;

        // Emit event
        emit!(ReservesUpdatedEvent {
            usdt_amount,
            real_estate_value,
        });

        Ok(())
    }

    // Update DAO token account
    pub fn update_dao_account(ctx: Context<UpdateDao>, new_dao_account: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require!(ctx.accounts.admin.key() == config.admin, StablecoinError::Unauthorized);
        require!(
            new_dao_account != Pubkey::default(),
            StablecoinError::InvalidDaoAccount
        );

        config.dao_token_account = new_dao_account;

        // Emit event
        emit!(DaoUpdatedEvent { new_dao_account });

        Ok(())
    }

    // Get reserve status
    pub fn get_reserves(ctx: Context<GetReserves>) -> Result<(u64, u64, bool)> {
        let config = &ctx.accounts.config;
        Ok((
            config.usdt_reserve,
            config.real_estate_value,
            is_backed(config, 0), // Check if current supply is backed
        ))
    }

    // Get DAO contributions
    pub fn get_dao_contributions(ctx: Context<GetDaoContributions>) -> Result<u64> {
        Ok(ctx.accounts.config.dao_contributions)
    }
}

// Helper function to check if minting is backed
fn is_backed(config: &Config, additional_amount: u64) -> bool {
    let total_supply = additional_amount; // Simplified: assumes supply check
    let required_usdt = total_supply
        .checked_mul(70)
        .and_then(|x| x.checked_div(100))
        .unwrap_or(u64::MAX);
    let required_real_estate = total_supply
        .checked_mul(30)
        .and_then(|x| x.checked_div(100))
        .unwrap_or(u64::MAX);
    config.usdt_reserve >= required_usdt && config.real_estate_value >= required_real_estate
}

// Account structs
#[account]
pub struct Config {
    pub admin: Pubkey,              // Admin authority
    pub usdt_mint: Pubkey,         // USDT mint address
    pub dao_token_account: Pubkey, // DAO token account for fees
    pub mint: Pubkey,              // Stablecoin mint
    pub decimals: u8,              // Token decimals
    pub dao_contributions: u64,    // Total DAO contributions
    pub usdt_reserve: u64,         // USDT reserve (70%)
    pub real_estate_value: u64,    // Real estate value (30%)
}

// Context structs
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 32 + 32 + 1 + 8 + 8 + 8,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct StablecoinTransfer<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub sender: Signer<'info>,
    #[account(mut)]
    pub sender_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    #[account(mut, constraint = recipient_token_account.mint == config.mint)]
    pub dao_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateReserves<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateDao<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetReserves<'info> {
    pub config: Account<'info, Config>,
}

#[derive(Accounts)]
pub struct GetDaoContributions<'info> {
    pub config: Account<'info, Config>,
}

// Events
#[event]
pub struct TransferEvent {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub fee: u64,
    pub dao: Pubkey,
}

#[event]
pub struct MintEvent {
    pub to: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BurnEvent {
    pub from: Pubkey,
    pub amount: u64,
}

#[event]
pub struct ReservesUpdatedEvent {
    pub usdt_amount: u64,
    pub real_estate_value: u64,
}

#[event]
pub struct DaoUpdatedEvent {
    pub new_dao_account: Pubkey,
}

// Error codes
#[error_code]
pub enum StablecoinError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid DAO account")]
    InvalidDaoAccount,
    #[msg("Insufficient reserves")]
    InsufficientReserves,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Insufficient amount after fee")]
    InsufficientAmount,
}