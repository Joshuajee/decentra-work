import { BestOfferIDL, getBestOfferProgramId } from '@best-offer/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useBestOfferProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBestOfferProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(BestOfferIDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['best-offer', 'all', { cluster }],
    queryFn: () => program.account.bestOffer.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['best-offer', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ bestOffer: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useBestOfferProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useBestOfferProgram();

  const accountQuery = useQuery({
    queryKey: ['best-offer', 'fetch', { cluster, account }],
    queryFn: () => program.account.bestOffer.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['best-offer', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ bestOffer: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['best-offer', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ bestOffer: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['best-offer', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ bestOffer: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['best-offer', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ bestOffer: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
