// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { BestOffer } from '../target/types/best_offer';
import { IDL as BestOfferIDL } from '../target/types/best_offer';

// Re-export the generated IDL and type
export { BestOffer, BestOfferIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const BEST_OFFER_PROGRAM_ID = new PublicKey(
  '91LZjfUgHwoSt3N7vRCik1Y59aq8xhQLmbiNyFFg3uTW'
);

// This is a helper function to get the program ID for the BestOffer program depending on the cluster.
export function getBestOfferProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return BEST_OFFER_PROGRAM_ID;
  }
}
