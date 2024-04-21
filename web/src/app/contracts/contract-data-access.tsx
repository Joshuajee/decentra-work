import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTransactionToast } from '../ui/ui-layout';
import { useEffect, useMemo, useState } from 'react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import programIdl from "./decentrawork"

const PROGRAM_ID = "L5zX8wnJGjGpZh3KQ5G9KFPpKaAnyX5D7ujTc6zQfUM"


export const useDencentrawork = () => {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const anchorWallet = useAnchorWallet()

    const [initialized, setInitialized] = useState(false)
    const [lastTodo, setLastTodo] = useState(0)
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(false)
    const [transactionPending, setTransactionPending] = useState(false)

    const program = useMemo(() => {
        if (anchorWallet) {
            const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions())
            return new Program(programIdl as any, PROGRAM_ID, provider)
        }
    }, [connection, anchorWallet])

    useEffect(() => {
        const findProfileAccounts = async () => {
            if (program && publicKey && !transactionPending) {
                try {
                    setLoading(true)
                    //const [profilePda, profileBump] = await findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                    //const profileAccount = await program.account.userProfile.fetch(profilePda)

                    // if (profileAccount) {
                    //     //setLastTodo(profileAccount.lastTodo)
                    //     setInitialized(true)

                    //     //const todoAccounts = await program.account.todoAccount.all([authorFilter(publicKey.toString())])
                    //     //setTodos(todoAccounts)
                    // } else {
                    //     setInitialized(false)
                    // }
                } catch (error) {
                    console.log(error)
                    setInitialized(false)
                    setTodos([])
                } finally {
                    setLoading(false)
                }
            }
        }

        findProfileAccounts()
    }, [publicKey, program, transactionPending])

    // const initializeUser = async () => {
    //     if (program && publicKey) {
    //         try {
    //             setTransactionPending(true)
    //             const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)

    //             const tx = await program.methods
    //                 .initializeUser()
    //                 .accounts({
    //                     userProfile: profilePda,
    //                     authority: publicKey,
    //                     systemProgram: SystemProgram.programId,
    //                 })
    //                 .rpc()
    //             setInitialized(true)
    //             toast.success('Successfully initialized user.')
    //         } catch (error) {
    //             console.log(error)
    //             toast.error(error.toString())
    //         } finally {
    //             setTransactionPending(false)
    //         }
    //     }
    // }

}
