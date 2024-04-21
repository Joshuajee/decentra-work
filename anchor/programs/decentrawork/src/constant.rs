use anchor_lang::prelude::*;

#[constant]
pub const USER_TAG: &[u8] = b"USER_STATE";

#[constant]
pub const WORK_TAG: &[u8] = b"WORK_CONTRACT_STATE";

#[constant]
pub const MILESTONE_TAG: &[u8] = b"WORK_MILESTONE_STATE";