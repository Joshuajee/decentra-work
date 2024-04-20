import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { BestOffer } from '../target/types/best_offer';

describe('best-offer', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.BestOffer as Program<BestOffer>;

  const bestOfferKeypair = Keypair.generate();

  it('Initialize BestOffer', async () => {
    await program.methods
      .initialize()
      .accounts({
        bestOffer: bestOfferKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([bestOfferKeypair])
      .rpc();

    const currentCount = await program.account.bestOffer.fetch(
      bestOfferKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment BestOffer', async () => {
    await program.methods
      .increment()
      .accounts({ bestOffer: bestOfferKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.bestOffer.fetch(
      bestOfferKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment BestOffer Again', async () => {
    await program.methods
      .increment()
      .accounts({ bestOffer: bestOfferKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.bestOffer.fetch(
      bestOfferKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement BestOffer', async () => {
    await program.methods
      .decrement()
      .accounts({ bestOffer: bestOfferKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.bestOffer.fetch(
      bestOfferKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set bestOffer value', async () => {
    await program.methods
      .set(42)
      .accounts({ bestOffer: bestOfferKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.bestOffer.fetch(
      bestOfferKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the bestOffer account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        bestOffer: bestOfferKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.bestOffer.fetchNullable(
      bestOfferKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
