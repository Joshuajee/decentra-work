import { ReactNode, useContext } from "react"
import { ICreateContract, USER_STATE, WORK_CONTRACT_STATE, WORK_MILESTONE_STATE } from "../context/use-decentrawork"
import { DecentraWorkContext } from "../context/decentrawork-context";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { numberToUint64 } from "../libs/utils";
import toast from "react-hot-toast";

interface IProps {
    children: ReactNode;
    action: "create-contract" | "pay-milestone";
    data?: ICreateContract
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
                        numberToUint64(price * LAMPORTS_PER_SOL)
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

    const handleClick = () => {

        if (!initialized) {
            initializeUser()
            return
        }

        switch (action) {
            case "create-contract":
                createContract(data as ICreateContract)
                return
            default:
                return
        }
    }

    const text = initialized ? children : "Initialize Account"

    return (
        <button
            onClick={handleClick}
            className="px-4 py-3 my-3 rounded-md border-[1px] border-white w-full"> 
            { loading ? "Please Waiting..." : text }
        </button>
    )
}

export default Web3Button