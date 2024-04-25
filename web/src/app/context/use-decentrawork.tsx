import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import {PublicKey, SystemProgram,} from '@solana/web3.js';
import toast from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import programIdl from "../contracts/decentrawork"
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';


const PROGRAM_ID = "CzoMo3ZgxB7fBrdjDugdH75wAB4xcgjRdDf7KJV87JGT"

export interface IUserProfile {
    contractCount: number;
    lastContractIndex: number;
    contractRefs: number;
}
export interface ICreateContract {
    contractor: string; 
    title: string; 
    description: string; 
    price: number
}

export interface IAcceptContract {
    workContract: PublicKey
}

export interface ICreateWorkMilestone {
    idx: number;
    title: string; 
    description: string; 
    price: number;
    workPda: PublicKey
}
export interface IWorkContract {
    key: PublicKey;
    authority: PublicKey;
    contractor: PublicKey;
    idx: number;
    milestones: number;
    accepted: boolean
}
export interface IWorkRefContract {
    authority: PublicKey;
    contract: PublicKey;
}
export interface IMilestoneContract {
    key: PublicKey;
    authority: PublicKey;
    contractor: PublicKey;
    idx: number;
    title: string;
    description: string;
    price: number;
    paid: boolean;
}

export interface IPayMilestone {
    contract: PublicKey;
}

export const USER_STATE = "USER_STATE"
export const WORK_CONTRACT_STATE = "WORK_CONTRACT_STATE"
export const WORK_MILESTONE_STATE = "WORK_MILESTONE_STATE"
export const WORK_REFERENCE_STATE = "WORK_REFERENCE_STATE"

export const useDencentrawork = () => {

    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const anchorWallet = useAnchorWallet()

    const [initialized, setInitialized] = useState(false)
    const [userProfile, setUserProfile] = useState<IUserProfile>()
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


    return { publicKey, initialized, loading, transactionPending, userProfile, program, initializeUser, setLoading, setTransactionPending }

}
