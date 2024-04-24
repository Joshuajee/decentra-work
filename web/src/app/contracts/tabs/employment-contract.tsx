import { useContext, useEffect, useState } from "react"
import ContractCard from "../contract-card"
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey"
import { DecentraWorkContext } from "../../context/decentrawork-context"
import { PublicKey } from "@solana/web3.js"
import { IWorkContract, WORK_CONTRACT_STATE, WORK_REFERENCE_STATE } from "../../context/use-decentrawork"
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"

const EmploymentContract = () => {


    const [clientContracts, setClientContracts] = useState([])

    const { 
        initialized, program, publicKey, transactionPending,
        userProfile,
        setLoading, 
    } = useContext(DecentraWorkContext)


    useEffect(() => {

        const generateWorkRefPDA = (publicKey: PublicKey, index: number) => {
            const [PDA] = findProgramAddressSync([utf8.encode(WORK_REFERENCE_STATE), publicKey.toBuffer(), Uint8Array.from([index])], (program as any).programId)
            return PDA
        }


        const generateWorkPDA = (publicKey: PublicKey, index: number) => {
            const [workPDA] = findProgramAddressSync([utf8.encode(WORK_CONTRACT_STATE), publicKey.toBuffer(), Uint8Array.from([index])], (program as any).programId)
            return  workPDA
        }

        const generateMultiple = (publicKey: PublicKey, start = 0, end: number) => {
            const keys: PublicKey[] = []

            for (let i = start; i < end; i++) {
                keys.push(generateWorkRefPDA(publicKey, i))
            }

            return keys

        }

        const findClientContracts = async () => {
            if (program && publicKey && initialized && !transactionPending) {
                try {
                    setLoading(true)

                    console.log({userProfile})

                    const keys = generateMultiple(publicKey, 0, Number(userProfile?.contractRefs))

                    const workContractRefs: IWorkContract[] = await program.account.workContractAccount.fetchMultiple(keys) as IWorkContract[]

                    console.log({workContractRefs})
                    const workContractAccounts: IWorkContract[] = await program.account.workContractAccount.fetchMultiple(keys) as IWorkContract[]

                    if (workContractAccounts) {
                        const contracts = workContractAccounts.map((workContractAccount, index) => {
                            return {...workContractAccount, key: keys[index]}
                        })
                        setClientContracts(contracts as any)
                    } 
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
        }

        findClientContracts()
    }, [publicKey, program, initialized, transactionPending, userProfile?.contractCount, setLoading])



    return (
        <div className="flex w-full left-0 justify-center overflow-y-auto mb-20">

            <div className="flex flex-col w-[500px] gap-3 max-w-4/5 shrink-0 my-12 p-6 overflow-y-auto">

                {
                    clientContracts.map((contract) => {
                        return <ContractCard contract={contract} />
                    })
                }
     
           

            </div>

        </div>
    );


}


export default EmploymentContract