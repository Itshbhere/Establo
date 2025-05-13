use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo, Burn, Transfer, SetAuthority};

declare_id!("4qeLVUWckMZkhxAMKT92qGmj9Zr7f5rooN16hqmwyrQU");

#[program]
pub mod green_stablecoin {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        usdt_mint: Pubkey,
        dao_token_account: Pubkey,
        real_estate_cid: String,
        real_estate_value: u64,
        decimals: u8,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.usdt_mint = usdt_mint;
        config.dao_token_account = dao_token_account;
        config.dao_contributions = 0;
        config.real_estate_cid = real_estate_cid;
        config.real_estate_value = real_estate_value;
        config.mint = ctx.accounts.mint.key();
        config.decimals = decimals;

        // Set mint authority to the PDA
        let cpi_accounts = SetAuthority {
            account_or_mint: ctx.accounts.mint.to_account_info(),
            current_authority: ctx.accounts.admin.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::token::set_authority(
            cpi_ctx,
            anchor_spl::token::spl_token::instruction::AuthorityType::MintTokens,
            Some(ctx.accounts.mint_authority.key()),
        )?;

        Ok(())
    }
pub fn mint(ctx: Context<MintStablecoin>, amount: u64) -> Result<()> {
    let config = &mut ctx.accounts.config;

    // Calculate required USDT and real estate backing
    let required_usdt = amount
        .checked_mul(70)
        .ok_or(ErrorCode::Overflow)?
        .checked_div(100)
        .ok_or(ErrorCode::Overflow)?;
    let required_real_estate = amount
        .checked_mul(30)
        .ok_or(ErrorCode::Overflow)?
        .checked_div(100)
        .ok_or(ErrorCode::Overflow)?;

    // Check USDT reserve
    let usdt_reserve = ctx.accounts.usdt_reserve.amount;
    require!(
        usdt_reserve >= required_usdt,
        ErrorCode::InsufficientUsdtReserve
    );

    // Check real estate value
    require!(
        config.real_estate_value >= required_real_estate,
        ErrorCode::InsufficientRealEstateValue
    );

    // Update total supply
    config.total_supply = config
        .total_supply
        .checked_add(amount)
        .ok_or(ErrorCode::Overflow)?;

    // Mint stablecoins to recipient
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let bump = ctx.bumps.mint_authority;
    let signer_seeds: &[&[u8]] = &[b"mint_authority", &[bump]];
    let seeds = [signer_seeds];
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, &seeds);
    token::mint_to(cpi_ctx, amount)?;

    Ok(())
}


    pub fn burn(ctx: Context<BurnStablecoin>, amount: u64) -> Result<()> {
    let config = &mut ctx.accounts.config;

    // Burn stablecoins from user
    let cpi_accounts = Burn {
        mint: ctx.accounts.mint.to_account_info(),
        from: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);
    token::burn(cpi_ctx, amount)?;

    // Calculate USDT to return (assuming 1:1 ratio for simplicity)
    let usdt_to_return = amount;

    // Transfer USDT from reserve to user
    let cpi_accounts_transfer = Transfer {
        from: ctx.accounts.usdt_reserve.to_account_info(),
        to: ctx.accounts.user_usdt_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(), // Adjust authority as needed
    };
    let cpi_ctx_transfer = CpiContext::new(cpi_program, cpi_accounts_transfer);
    token::transfer(cpi_ctx_transfer, usdt_to_return)?;

    // Update total supply
    config.total_supply = config
        .total_supply
        .checked_sub(amount)
        .ok_or(ErrorCode::Overflow)?;

    Ok(())
}


    pub fn transfer(ctx: Context<StablecoinTransfer>, amount: u64) -> Result<()> {
        let config = &ctx.accounts.config;

        // Calculate fee (0.5% = 50 basis points)
        let fee = amount
            .checked_mul(50)
            .ok_or(ErrorCode::Overflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::Overflow)?;
        let amount_after_fee = amount
            .checked_sub(fee)
            .ok_or(ErrorCode::InsufficientAmount)?;

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
            .ok_or(ErrorCode::Overflow)?;

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

    pub fn update_dao_account(ctx: Context<UpdateDao>, new_dao_account: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require!(
            ctx.accounts.admin.key() == config.admin,
            ErrorCode::Unauthorized
        );
        require!(
            new_dao_account != Pubkey::default(),
            ErrorCode::InvalidDaoAccount
        );

        config.dao_token_account = new_dao_account;

        // Emit event
        emit!(DaoUpdatedEvent { new_dao_account });

        Ok(())
    }

    pub fn get_dao_contributions(ctx: Context<GetDaoContributions>) -> Result<u64> {
        Ok(ctx.accounts.config.dao_contributions)
    }

    pub fn update_real_estate(
        ctx: Context<UpdateRealEstate>,
        new_cid: String,
        new_value: u64,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.real_estate_cid = new_cid;
        config.real_estate_value = new_value;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 32 + 8 + 4 + 200 + 8 + 1,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    /// CHECK: This is the PDA for mint authority
    #[account(seeds = [b"mint_authority"], bump)]
    pub mint_authority: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintStablecoin<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub usdt_reserve: Account<'info, TokenAccount>,
    /// CHECK: This is a PDA authority for minting
    #[account(seeds = [b"mint_authority"], bump)]
    pub mint_authority: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnStablecoin<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_usdt_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub usdt_reserve: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
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
    #[account(mut, constraint = dao_token_account.mint == config.mint)]
    pub dao_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateDao<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetDaoContributions<'info> {
    pub config: Account<'info, Config>,
}

#[derive(Accounts)]
pub struct UpdateRealEstate<'info> {
    #[account(mut, has_one = admin)]
    pub config: Account<'info, Config>,
    pub admin: Signer<'info>,
}

#[account]
pub struct Config {
    pub admin: Pubkey,
    pub usdt_mint: Pubkey,
    pub dao_token_account: Pubkey,
    pub dao_contributions: u64,
    pub real_estate_cid: String,
    pub real_estate_value: u64,
    pub mint: Pubkey,
    pub decimals: u8,
    pub total_supply: u64, // New field to track total supply
}

#[event]
pub struct TransferEvent {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub fee: u64,
    pub dao: Pubkey,
}

#[event]
pub struct DaoUpdatedEvent {
    pub new_dao_account: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Overflow occurred during calculation.")]
    Overflow,
    #[msg("Insufficient USDT reserve.")]
    InsufficientUsdtReserve,
    #[msg("Insufficient real estate value.")]
    InsufficientRealEstateValue,
    #[msg("Insufficient amount after fee.")]
    InsufficientAmount,
    #[msg("Unauthorized access.")]
    Unauthorized,
    #[msg("Invalid DAO account.")]
    InvalidDaoAccount,
}


// Program Id: C9W69g6fnYvFsbA3a9VEx9n1qqUA2V3YnFhm5p3nqrRc

// Signature: 3eRHPCRBAfn5TAKyQ53qYBZvkjsfUrABRasvAgT7SEBXSnz9xKJuZGyHFaAyqMszWzLcWE7tSNYu1ipJkrig7hRq

// Deploy success
/////////////////
//spl_token usdt for 70%reserve
// Address:  8H39WuuPeHL2QoyhKM7ynSuni1x72PRgvvVh7foorXMT
// Decimals:  6

// Signature: 2iAFhbWCDJWS8cMFZFARdusjiHkqrbDZ71eAkW16rnQNz6gaDevXiRkyK2FC8nvBo5PngGWWkEjdAwp5Vvc4qwtK
///////////
// account created for spl_token
// ErDpnJC4cCFvojTFrYXNUgo1JsF4AcQZKjVmM3fPmfak

// Minting 10000000000 tokens
//   Token: 8H39WuuPeHL2QoyhKM7ynSuni1x72PRgvvVh7foorXMT
//   Recipient: ErDpnJC4cCFvojTFrYXNUgo1JsF4AcQZKjVmM3fPmfak
