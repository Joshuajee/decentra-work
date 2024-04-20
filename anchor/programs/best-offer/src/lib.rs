#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("91LZjfUgHwoSt3N7vRCik1Y59aq8xhQLmbiNyFFg3uTW");

#[program]
pub mod best_offer {
    use super::*;

  pub fn close(_ctx: Context<CloseBestOffer>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.best_offer.count = ctx.accounts.best_offer.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.best_offer.count = ctx.accounts.best_offer.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeBestOffer>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.best_offer.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeBestOffer<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + BestOffer::INIT_SPACE,
  payer = payer
  )]
  pub best_offer: Account<'info, BestOffer>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseBestOffer<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub best_offer: Account<'info, BestOffer>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub best_offer: Account<'info, BestOffer>,
}

#[account]
#[derive(InitSpace)]
pub struct BestOffer {
  count: u8,
}
