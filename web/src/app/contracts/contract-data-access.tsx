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
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';

const PROGRAM_ID = "L5zX8wnJGjGpZh3KQ5G9KFPpKaAnyX5D7ujTc6zQfUM"

interface IUserProfile {
    contractCount: number;
    lastContractIndex: number;
}

export interface ICreateContract {
    contractor: string; 
    title: string; 
    description: string; 
    price: number
}


export const useDencentrawork = () => {

    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const anchorWallet = useAnchorWallet()

    const [initialized, setInitialized] = useState(false)
    const [userProfile, setUserProfile] = useState<IUserProfile>()
    const [contracts, setContracts] = useState([])
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
                    const [profilePda] = await findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                    const profileAccount = await program.account.userProfile.fetch(profilePda)

                    console.log({profileAccount})

                    if (profileAccount) {
                        setUserProfile(profileAccount as IUserProfile)
                        setInitialized(true)

                        //const todoAccounts = await program.account.todoAccount.all([authorFilter(publicKey.toString())])
                        //setContracts(todoAccounts)
                    } else {
                        setInitialized(false)
                    }
                } catch (error) {
                    console.log(error)
                    setInitialized(false)
                    setContracts([])
                } finally {
                    setLoading(false)
                }
            }
        }

        findProfileAccounts()
    }, [publicKey, program, transactionPending])

    const initializeUser = async () => {
        if (program && publicKey) {
            try {
                setTransactionPending(true)
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)

                const tx = await program.methods
                    .initializeUser()
                    .accounts({
                        userProfile: profilePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                setInitialized(true)
                toast.success('Successfully initialized user.')
            } catch (error) {
                console.log(error)
                toast.error((error as any)?.toString())
            } finally {
                setTransactionPending(false)
            }
        }
    }

    const createContract = async (data: ICreateContract) => {

        const { contractor, title, description, price } = data

        if (program && publicKey) {
            try {
                setTransactionPending(true)
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)

                const [contractPda] = findProgramAddressSync([utf8.encode('WORK_CONTRACT_STATE'), publicKey.toBuffer(), Uint8Array.from([userProfile?.lastContractIndex as any])], program.programId)

                const [milestonePda] = findProgramAddressSync([utf8.encode('WORK_MILESTONE_STATE')], program.programId)
                
                const tx = await program.methods
                    .createWorkContract(contractor, title, description, price)
                    .accounts({
                        userProfile: profilePda,
                        workContractAccount: contractPda,
                        workContractMilestone: milestonePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
    
                toast.success('Successfully Created a contract.')
            } catch (error) {
                console.log(error)
                toast.error((error as any)?.toString())
            } finally {
                setTransactionPending(false)
            }
        }
    }


    return { initialized, loading, transactionPending, initializeUser, createContract }

}
