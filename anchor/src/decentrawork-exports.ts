// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Decentrawork } from '../target/types/decentrawork';
import { IDL as DecentraworkIDL } from '../target/types/decentrawork';

// Re-export the generated IDL and type
export { Decentrawork, DecentraworkIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const DECENTRAWORK_PROGRAM_ID = new PublicKey(
  '91LZjfUgHwoSt3N7vRCik1Y59aq8xhQLmbiNyFFg3uTW'
);

// This is a helper function to get the program ID for the Decentrawork program depending on the cluster.
export function getDecentraworkProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return DECENTRAWORK_PROGRAM_ID;
  }
}
