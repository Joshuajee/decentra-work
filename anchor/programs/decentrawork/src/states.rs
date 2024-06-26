use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub last_contract_index: u8,
    pub contract_count: u8,
    pub contract_refs: u8
}

#[account]
#[derive(Default)]
pub struct WorkContractAccount {
    pub authority: Pubkey,
    pub contractor: Pubkey,
    pub idx: u8,
    pub accepted: bool,
    pub milestones: u8
}

#[account]
#[derive(Default)]
pub struct WorkContractReference {
    pub authority: Pubkey,
    pub contract: Pubkey,
}

#[account]
#[derive(Default)]
pub struct WorkContractMilestone {
    pub authority: Pubkey,
    pub contractor: Pubkey,
    pub work_contract: Pubkey,
    pub idx: u8,
    pub title: String,
    pub description: String,
    pub price: u64,
    pub paid: bool,
    pub claimed: bool,
    pub disputed: bool,
    pub disputed_at: u64
}
