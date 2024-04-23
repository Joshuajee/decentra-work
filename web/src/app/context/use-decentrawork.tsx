import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import toast from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import programIdl from "../contracts/decentrawork"
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';

const PROGRAM_ID = "GNPGy9ivB3RH7tTBnzBBCBYWLFPqhiEWqyGbb6DvGiMG"

export interface IUserProfile {
    contractCount: number;
    lastContractIndex: number;
}

export interface ICreateContract {
    contractor: string; 
    title: string; 
    description: string; 
    price: number
}

export interface IWorkContract {
    key: PublicKey;
    authority: PublicKey;
    contractor: PublicKey;
    idx: number;
    milestones: number;
}


export interface IMilestoneContract {
    key: PublicKey;
    authority: PublicKey;
    contractor: PublicKey;
    idx: number;
    title: string;
    description: string;
    price: number;
}

export const USER_STATE = "USER_STATE"
export const WORK_CONTRACT_STATE = "WORK_CONTRACT_STATE"
export const WORK_MILESTONE_STATE = "WORK_MILESTONE_STATE"

export const useDencentrawork = () => {

    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const anchorWallet = useAnchorWallet()

    const [initialized, setInitialized] = useState(false)
    const [userProfile, setUserProfile] = useState<IUserProfile>()
    const [clientContracts, setClientContracts] = useState([])
    const [loading, setLoading] = useState(false)
    const [transactionPending, setTransactionPending] = useState(false)
    const [milestones, setMilestones] = useState([])

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
                    const [profilePda] = await findProgramAddressSync([utf8.encode(USER_STATE), publicKey.toBuffer()], program.programId)
                    const profileAccount = await program.account.userProfile.fetch(profilePda)

                    if (profileAccount) {
                        setUserProfile(profileAccount as IUserProfile)
                        setInitialized(true)
                    } else {
                        setInitialized(false)
                    }
                } catch (error) {
                    console.error(error)
                    setInitialized(false)
                    setClientContracts([])
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
                const [profilePda] = findProgramAddressSync([utf8.encode(USER_STATE), publicKey.toBuffer()], program.programId)

                const tx = await program.methods
                    .initializeUser()
                    .accounts({
                        userProfile: profilePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                console.log(tx)
                setInitialized(true)
                toast.success('Successfully initialized user.')
            } catch (error) {
                console.error(error)
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

                const [profilePda] = findProgramAddressSync([utf8.encode(USER_STATE), publicKey.toBuffer()], program.programId)
                
                const [contractPda] = findProgramAddressSync([utf8.encode(WORK_CONTRACT_STATE), publicKey.toBuffer(), "0" as any], program.programId)

                const [milestonePda] = findProgramAddressSync([utf8.encode(WORK_MILESTONE_STATE), contractPda.toBuffer(), "0" as any], program.programId)
                
                const tx = await program.methods
                    .createWorkContract(
                        new PublicKey(contractor), 
                        title, 
                        description, 
                        price * LAMPORTS_PER_SOL
                    )
                    .accounts({
                        userProfile: profilePda,
                        workContractAccount: contractPda,
                        workContractMilestone: milestonePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    }).rpc()
                console.log(tx)
                toast.success('Successfully Created a contract.')
            } catch (error) {
                console.error(error)
                toast.error((error as any)?.toString())
            } finally {
                setTransactionPending(false)
            }
        }
    }


    useEffect(() => {
        const generateWorkPDA = (publicKey: PublicKey, index: number) => {
            const [workPDA] = findProgramAddressSync([utf8.encode(WORK_CONTRACT_STATE), publicKey.toBuffer(), Uint8Array.from([index])], (program as any).programId)
            return  workPDA
        }

        const generateMultiple = (publicKey: PublicKey, start = 0, end: number) => {
            const keys: PublicKey[] = []

            for (let i = start; i < end; i++) {
                keys.push(generateWorkPDA(publicKey, i))
            }

            return keys

        }

        const findClientContracts = async () => {
            if (program && publicKey && initialized && !transactionPending) {
                try {
                    setLoading(true)

                    const keys = generateMultiple(publicKey, 0, Number(userProfile?.contractCount))

                    const workContractAccounts: IWorkContract[] = await program.account.workContractAccount.fetchMultiple(keys) as IWorkContract[]

                    if (workContractAccounts) {
                        const contracts = workContractAccounts.map((workContractAccount, index) => {
                            return {...workContractAccount, key: keys[index]}
                        })
                        setClientContracts(contracts as any)
                    } else {
                        setInitialized(false)
                    }
                } catch (error) {
                    console.log(error)
                    setInitialized(false)
                    setClientContracts([])
                } finally {
                    setLoading(false)
                }
            }
        }

        findClientContracts()
    }, [publicKey, program, initialized, transactionPending, userProfile?.contractCount])



    return { publicKey, initialized, loading, transactionPending, clientContracts, milestones, program, initializeUser, setLoading, createContract, }

}
