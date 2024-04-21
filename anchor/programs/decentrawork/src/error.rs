use anchor_lang::prelude::*;

#[error_code]
pub enum WorkContractError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("You are not authorized, Only Contractor.")]
    OnlyContractor,
    #[msg("Not allowed")]
    NotAllowed,
    #[msg("Client cannot be Contractor")]
    InvalidContractor,
    #[msg("Math operation overflow")]
    MathOverflow,
    #[msg("Already accepted")]
    AlreadyAccepted,
}