use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub last_contract_index: u8,
    pub contract_count: u8,
}

#[account]
#[derive(Default)]
pub struct WorkContractAccount {
    pub authority: Pubkey,
    pub idx: u8,
    pub contractor: Pubkey,
    pub content: String,
}
