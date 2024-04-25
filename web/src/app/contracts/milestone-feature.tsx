import { useContext, useEffect, useState } from "react";
import { IMilestoneFormData } from "./contract-card";
import { IWorkContract, WORK_MILESTONE_STATE } from "../context/use-decentrawork";
import { PublicKey } from "@solana/web3.js";
import { DecentraWorkContext } from "../context/decentrawork-context";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import MilestoneCard from "./milestone-card";
import { useParams } from "react-router-dom";
import { AppModal } from "../ui/ui-layout";
import MilestoneForm from "../dashboard/milestone-form";
import { dummyMilestone } from "../dashboard/dashboard-feature";
import Web3Button from "./web3-btn";

export default function MilestoneFeature() {

    const { address } = useParams()

    const { 
        loading, program, publicKey,
        initialized, transactionPending, 
        setLoading
    } = useContext(DecentraWorkContext)


    const [open, setOpen] = useState(false)
    const [contract, setContract] = useState<IWorkContract>()
    const [milestones, setMilestones] = useState([])
    const [milestone, setMilestone] = useState<IMilestoneFormData>(dummyMilestone)

    //const amountToPay = useMemo(() => totalPrice(milestones), [milestones])
  
    const updateMileStone = (index: number, milestone: IMilestoneFormData) => {
      setMilestone(milestone)
    }
  
    console.log(milestone)
  

    useEffect(() => {

                
        const generateMilestonePDA = (workContractPDA: PublicKey, index: number) => {
            const [milestonePDA] = findProgramAddressSync([utf8.encode(WORK_MILESTONE_STATE), workContractPDA.toBuffer(), Uint8Array.from([index])], (program as any).programId)
            return  milestonePDA
        }

        const generateMultipleMilestones = (publicKey: PublicKey, start = 0, end: number) => {
            const keys: PublicKey[] = []

            for (let i = start; i < end; i++) {
                keys.push(generateMilestonePDA(publicKey, i))
            }

            return keys
        }

        const findContractMilestones = async (workPDA: PublicKey) => {

            if (program && publicKey && initialized && !transactionPending) {
    
                try {
                    setLoading(true)
    
                    const workContractAccount = await program.account.workContractAccount.fetch(workPDA) as IWorkContract
    
                    setContract(workContractAccount as IWorkContract)

                    const keys = generateMultipleMilestones(workPDA, 0, Number(workContractAccount?.milestones))
    
                    const milestoneAccounts: IWorkContract[] = await program.account.workContractMilestone.fetchMultiple(keys) as IWorkContract[]
          
                    if (milestoneAccounts) {
                        const contracts = milestoneAccounts.map((workContractAccount, index) => {
                            return {...workContractAccount, key: keys[index]}
                        })
                        setMilestones(contracts as any)
                    } else {
                        setMilestones([])
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
        }  
        
        findContractMilestones(new PublicKey(String(address)))

    }, [initialized, program, transactionPending, publicKey, address, setLoading])


    return (
        <div className="flex w-full left-0 justify-center overflow-y-auto mb-20">

            <div className="flex flex-col w-[500px] gap-3 max-w-4/5 shrink-0 my-12 p-6 overflow-y-auto">
                
                <h2 className="text-center font-bold text-3xl"> Milestones </h2>

                {
                    milestones.map((contract) => {
                        return <MilestoneCard contract={contract} publicKey={publicKey as PublicKey} />
                    })
                }

                {   
                    publicKey?.toString() === contract?.authority.toString() &&
                        <div className="flex justify-center">

                            <button 
                                onClick={() => setOpen(true)}
                                className="px-4 py-2 rounded-md border-[1px] border-white"> 
                                + Add Milestone
                            </button>

                        </div> 
                }
     
            </div>

            <AppModal 
                title={'Add Milestone'}
                hide={() => setOpen(false)} show={open}>
                    <>
                        <MilestoneForm index={milestones.length} milestone={milestone} updateMilestone={updateMileStone} />
                        
                        <Web3Button action="add-milestone" data={{...milestone, idx: milestones.length, workPda: new PublicKey(String(address))}}>Create Milestone</Web3Button>
                    </>
            </AppModal>

        </div>
    );
}

