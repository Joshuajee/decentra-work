use anchor_lang::{
    prelude::*,
    solana_program::{clock::Clock, hash::hash, program::invoke, system_instruction::transfer},
};


pub mod constant;
pub mod error;
pub mod states;
use crate::{constant::*, error::*, states::*};
// This is your program's public key and it will update
// automatically wJhen you build the project.
declare_id!("2sMHGGGZkU7dWcexLxyCg8LUjrBekpqCnViJ4UURGS33");

#[program]
mod decentrawork {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        // Initialize user profile with default data
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.last_contract_index = 0;
        user_profile.contract_count = 0;

        Ok(())
    }

    pub fn create_work_contract(
        ctx: Context<CreateWorkContract>,
        contractor: Pubkey,
        title: String,
        description: String,
        price: u64,
    ) -> Result<()> {
        let work_contract_account = &mut ctx.accounts.work_contract_account;
        let user_profile = &mut ctx.accounts.user_profile;
        let work_contract_milestone = &mut ctx.accounts.work_contract_milestone;

        //cache values

        let client_key = ctx.accounts.authority.key();

        // Fill contents with argument
        work_contract_account.authority = client_key;
        work_contract_account.contractor = contractor;
        work_contract_account.idx = user_profile.last_contract_index;
        work_contract_account.accepted = false;
        work_contract_account.milestones = 1;

        // Increase contract idx
        user_profile.last_contract_index = user_profile.last_contract_index.checked_add(1).unwrap();

        // Increase total contract count
        user_profile.contract_count = user_profile.contract_count.checked_add(1).unwrap();

        // create milestone
        work_contract_milestone.authority = client_key;
        work_contract_milestone.contractor = contractor;
        work_contract_milestone.work_contract = work_contract_account.key();
        work_contract_milestone.idx = 0;
        work_contract_milestone.title = title;
        work_contract_milestone.description = description;
        work_contract_milestone.price = price;
        work_contract_milestone.paid = false;
        work_contract_milestone.disputed = false;
        work_contract_milestone.claimed = false;
        work_contract_milestone.disputed_at = 0;

        //Transfer SOL to Milestone PDA
        invoke(
            &transfer(&client_key, &work_contract_milestone.key(), price),
            &[
                ctx.accounts.authority.to_account_info(),
                work_contract_milestone.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        require!(
            contractor != work_contract_account.authority,
            WorkContractError::InvalidContractor
        );

        Ok(())
    }

    pub fn accept_contract(ctx: Context<AcceptContract>) -> Result<()> {
        let authority = ctx.accounts.authority.key();
        let work_contract_account = &mut ctx.accounts.work_contract_account;
        let user_profile = &mut ctx.accounts.user_profile;
        let work_contract_reference = &mut ctx.accounts.work_contract_reference;

        require!(
            !work_contract_account.accepted,
            WorkContractError::AlreadyAccepted
        );

        require!(
            authority == work_contract_account.contractor,
            WorkContractError::OnlyContractor
        );

        // Mark as accepted
        work_contract_account.accepted = true;
        user_profile.contract_refs += user_profile.contract_refs + 1;

        //Create Refs
        work_contract_reference.authority = authority.key(); 
        work_contract_reference.contract = work_contract_account.key(); 
        
        Ok(())
    }

    pub fn add_work_milestone(
        ctx: Context<AddWorkMilestone>,
        title: String,
        description: String,
        price: u64,
    ) -> Result<()> {

        let work_contract_account = &mut ctx.accounts.work_contract_account;
        let user_profile = &mut ctx.accounts.user_profile;
        let work_contract_milestone = &mut ctx.accounts.work_contract_milestone;

        let milestones = work_contract_account.milestones;

        let client_key = user_profile.authority.key();

        // create milestone
        work_contract_milestone.authority = user_profile.authority;
        work_contract_milestone.contractor = work_contract_account.contractor;
        work_contract_milestone.work_contract = work_contract_account.key();
        work_contract_milestone.idx = milestones + 1;
        work_contract_milestone.title = title;
        work_contract_milestone.description = description;
        work_contract_milestone.price = price;
        work_contract_milestone.disputed = false;
        work_contract_milestone.claimed = false;
        work_contract_milestone.paid = false;
        work_contract_milestone.disputed_at = 0;

        // Increase contract idx
        work_contract_account.milestones = milestones.checked_add(1).unwrap();

        // Transfer Token
        invoke(
            &transfer(&client_key, &work_contract_milestone.key(), price),
            &[
                ctx.accounts.authority.to_account_info(),
                work_contract_milestone.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        Ok(())
    }

    pub fn pay_work_milestone(ctx: Context<PayWorkMilestone>) -> Result<()> {

        let work_contract_milestone = &mut ctx.accounts.work_contract_milestone;

        // create milestone
        require!(
            work_contract_milestone.authority == ctx.accounts.authority.key(),
            WorkContractError::Unauthorized
        );

        work_contract_milestone.paid = true;

        Ok(())
    }


    pub fn claim_work_milestone(ctx: Context<ClaimWorkMilestone>) -> Result<()> {

        let work_contract_milestone = &mut ctx.accounts.work_contract_milestone;

        // caller must be contractor
        require!(
            work_contract_milestone.contractor == ctx.accounts.authority.key(),
            WorkContractError::Unauthorized
        );


        work_contract_milestone.claimed = true;

        let price = work_contract_milestone.price;

        // Transfer Token
        let claimer = &ctx.accounts.authority;
        **work_contract_milestone.to_account_info().try_borrow_mut_lamports()? -= price;
        **claimer.to_account_info().try_borrow_mut_lamports()? += price;

        Ok(())
    }

}


#[account]
pub struct UserAccount {
    pub data: u64,
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<UserProfile>(),
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreateWorkContract<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        seeds = [WORK_TAG, authority.key().as_ref(), &[user_profile.last_contract_index as u8].as_ref()],
        bump,
        payer = authority,
        space = std::mem::size_of::<WorkContractAccount>() + 8,
    )]
    pub work_contract_account: Box<Account<'info, WorkContractAccount>>,

    #[account(
        init,
        seeds = [MILESTONE_TAG, work_contract_account.key().as_ref(), &[0 as u8].as_ref()],
        bump,
        payer = authority,
        space = std::mem::size_of::<WorkContractMilestone>() + 8,
    )]
    pub work_contract_milestone: Box<Account<'info, WorkContractMilestone>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AcceptContract<'info> {

    #[account(mut)]
    pub work_contract_account: Box<Account<'info, WorkContractAccount>>,

    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        seeds = [REFERENCE_TAG, authority.key().as_ref(), &[user_profile.contract_refs as u8].as_ref()],
        bump,
        payer = authority,
        space = std::mem::size_of::<WorkContractMilestone>() + 8,
    )]
    pub work_contract_reference: Box<Account<'info, WorkContractReference>>,



    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddWorkMilestone<'info> {

    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(mut)]
    pub work_contract_account: Box<Account<'info, WorkContractAccount>>,

    #[account(
        init,
        seeds = [MILESTONE_TAG, work_contract_account.key().as_ref(), &[work_contract_account.milestones as u8].as_ref()],
        bump,
        payer = authority,
        space = std::mem::size_of::<WorkContractMilestone>() + 8,
    )]
    pub work_contract_milestone: Box<Account<'info, WorkContractMilestone>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct PayWorkMilestone<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub work_contract_milestone: Box<Account<'info, WorkContractMilestone>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction()]
pub struct ClaimWorkMilestone<'info> {
    #[account(mut)]
    pub work_contract_milestone: Box<Account<'info, WorkContractMilestone>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
