import { ReactNode, useContext } from "react"
import { ICreateContract, ICreateWorkMilestone, USER_STATE, WORK_CONTRACT_STATE, WORK_MILESTONE_STATE, WORK_REFERENCE_STATE } from "../context/use-decentrawork"
import { DecentraWorkContext } from "../context/decentrawork-context";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import toast from "react-hot-toast";
import { BN } from "@coral-xyz/anchor";

interface IProps {
    children: ReactNode;
    action: "create-contract" | "accept-contract" | "pay-milestone" | "add-milestone" | "claim-milestone" ;
    data?: ICreateContract | ICreateWorkMilestone | PublicKey
}

const Web3Button = ({ children, action, data }: IProps) => {

    const { initialized, loading, program, publicKey, userProfile, initializeUser, setLoading, setTransactionPending } = useContext(DecentraWorkContext)

    const createContract = async (data: ICreateContract) => {

        const { contractor, title, description, price } = data

        if (program && publicKey) {
            try {
                setTransactionPending(true)
                setLoading(true)

                const [profilePda] = findProgramAddressSync([utf8.encode(USER_STATE), publicKey.toBuffer()], program.programId)
                
                const [contractPda] = findProgramAddressSync([utf8.encode(WORK_CONTRACT_STATE), publicKey.toBuffer(),  Uint8Array.from([Number(userProfile?.lastContractIndex)])], program.programId)

                const [milestonePda] = findProgramAddressSync([utf8.encode(WORK_MILESTONE_STATE), contractPda.toBuffer(),  Uint8Array.from([0])], program.programId)
                
                const tx = await program.methods
                    .createWorkContract(
                        new PublicKey(contractor), 
                        title, 
                        description, 
                        new BN(price * LAMPORTS_PER_SOL)
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
                setLoading(false)
            }
        }
    }


    const acceptContract = async (data: PublicKey) => {

        if (program && publicKey) {
            try {
                setTransactionPending(true)
                setLoading(true)

                const [profilePda] = findProgramAddressSync([utf8.encode(USER_STATE), publicKey.toBuffer()], program.programId)
                
                const [workRefPda] = findProgramAddressSync([utf8.encode(WORK_REFERENCE_STATE), publicKey.toBuffer(),  Uint8Array.from([Number(userProfile?.contractRefs)])], program.programId)
                
                const tx = await program.methods
                    .acceptContract()
                    .accounts({
                        workContractAccount: data,
                        userProfile: profilePda,
                        workContractReference: workRefPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    }).rpc()
                console.log(tx)
                toast.success('Successfully accepted contract.')
            } catch (error) {
                console.error(error)
                toast.error((error as any)?.toString())
            } finally {
                setTransactionPending(false)
                setLoading(false)
            }
        }
    }

    const addWorkMilestone = async (data: ICreateWorkMilestone) => {

        const { workPda, idx, title, description, price, hide } = data

        if (program && publicKey) {
            try {
                setTransactionPending(true)
                setLoading(true)

                const [profilePda] = findProgramAddressSync([utf8.encode(USER_STATE), publicKey.toBuffer()], program.programId)

                const [milestonePda] = findProgramAddressSync([utf8.encode(WORK_MILESTONE_STATE), workPda.toBuffer(),  Uint8Array.from([Number(idx)])], program.programId)
                
                const tx = await program.methods
                    .addWorkMilestone(
                        title, 
                        description, 
                        new BN(price * LAMPORTS_PER_SOL)
                    )
                    .accounts({
                        userProfile: profilePda,
                        workContractAccount: workPda,
                        workContractMilestone: milestonePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    }).rpc()
                console.log(tx)
                toast.success('Milestone added Successfully.')
                hide()
            } catch (error) {
                console.error(error)
                toast.error((error as any)?.toString())
            } finally {
                setTransactionPending(false)
                setLoading(false)
            }
        }
    }

    const releaseFunds = async (data: PublicKey) => {

        if (program && publicKey) {
            try {
                setTransactionPending(true)
                setLoading(true)

                const tx = await program.methods
                    .payWorkMilestone()
                    .accounts({
                        workContractMilestone: data,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    }).rpc()
                console.log(tx)
                toast.success('Funds released Successfully.')
            } catch (error) {
                console.error(error)
                toast.error((error as any)?.toString())
            } finally {
                setTransactionPending(false)
                setLoading(false)
            }
        }
    }

    const claimFunds = async (data: PublicKey) => {

        if (program && publicKey) {
            try {
                setTransactionPending(true)
                setLoading(true)

                const tx = await program.methods
                    .claimWorkMilestone()
                    .accounts({
                        workContractMilestone: data,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    }).rpc()
                console.log(tx)
                toast.success('Your account has been funded.')
            } catch (error) {
                console.error(error)
                toast.error((error as any)?.toString())
            } finally {
                setTransactionPending(false)
                setLoading(false)
            }
        }
    }

    const handleClick = () => {

        if (!publicKey) toast.error("Please connect your wallet")

        if (!initialized) {
            initializeUser()
            return
        }

        switch (action) {
            case "create-contract":
                createContract(data as ICreateContract)
                break
            case "accept-contract":
                acceptContract(data as PublicKey)
                break
            case "add-milestone":
                addWorkMilestone(data as ICreateWorkMilestone)
                break
            case "pay-milestone":
                releaseFunds(data as PublicKey)
                break
            case "claim-milestone":
                claimFunds(data as PublicKey)
                break
            default:
                console.error("Invalid action")
                return
        }
    }

    const text = initialized ? children : "Initialize Account"

    return (
        <button
            onClick={handleClick}
            className="px-4 py-3 rounded-md border-[1px] border-white w-full"> 
            { loading ? "Please Waiting..." : text }
        </button>
    )
}

export default Web3Button