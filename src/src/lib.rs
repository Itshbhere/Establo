use anchor_lang::prelude::*;

declare_id!("kLtacENmn3CG5rdYXjKQNS8ZR9Be99GniTCdLKW4U75");

pub mod state;
pub mod contexts;
pub mod errors;

pub use contexts::*;
pub use errors::*;

#[program]
pub mod marketplace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, fee: u16) -> Result<()> {
        ctx.accounts.init(name, fee, &ctx.bumps)
    }

    pub fn list(ctx: Context<List>, price: u64) -> Result<()> {
        ctx.accounts.create_listing(price, &ctx.bumps)?;
        ctx.accounts.deposit_nft()
    }

    pub fn delist(ctx: Context<Delist>) -> Result<()> {
        ctx.accounts.withdraw_nft()
    }

    pub fn purchase(ctx: Context<Purchase>) -> Result<()> {
        ctx.accounts.send_sol()?;
        ctx.accounts.send_nft()?;
        ctx.accounts.close_mint_vault()

    }
}

// Program Id: 3ViJvaTNzv7CZahJupWuNj8sTQBzBEEDDwJjjQ6yf1uV

// Signature: 2PDmpoBABSVqAgbPd8qiVgnvapSBeq1n5f2KfvMkNhQMryuKgyYFEkmPWFMNBexwf4piRJdSSqUVGQg5PA32rw24



// Program Id: kLtacENmn3CG5rdYXjKQNS8ZR9Be99GniTCdLKW4U75

// Signature: 549mBX6gMkQX6MVhqKzXX7Ye57hqNvjBHD32BGzzHBd28F7CENTbLiukwcLh85dew4UoebbFtVxY61iDUewnwQY6