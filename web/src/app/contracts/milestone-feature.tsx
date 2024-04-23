import { useContext, useEffect, useState } from "react";
import ContractCard from "./contract-card";
import { IWorkContract, WORK_MILESTONE_STATE, useDencentrawork } from "../context/use-decentrawork";
import { PublicKey } from "@solana/web3.js";
import { DecentraWorkContext } from "../context/decentrawork-context";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import MilestoneCard from "./milestone-card";

export default function MilestoneFeature() {

    const { 
        loading, program, publicKey,
        initialized, transactionPending, 
        setLoading
    } = useContext(DecentraWorkContext)

    const [milestones, setMilestones] = useState([])

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
    
                    const keys = generateMultipleMilestones(workPDA, 0, Number(workContractAccount?.milestones))
    
                    console.log(keys[0].toString())
    
                    const milestoneAccounts: IWorkContract[] = await program.account.workContractMilestone.fetchMultiple(keys) as IWorkContract[]
          
                    console.log({milestoneAccounts})
    
    
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
        
        
        findContractMilestones(new PublicKey("5anwLaDv7TPP2d9dnVNbfr6DnUCdrWQUqnVLZQBQ8wRr"))

    }, [initialized, program, transactionPending, publicKey, setLoading])


    return (
        <div className="flex w-full left-0 justify-center overflow-y-auto mb-20">

            <div className="flex flex-col w-[500px] gap-3 max-w-4/5 shrink-0 my-12 p-6 overflow-y-auto">

                {
                    milestones.map((contract) => {
                        return <MilestoneCard contract={contract} />
                    })
                }
     
            </div>

        </div>
    );
}

