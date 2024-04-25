import { useContext, useEffect, useState } from "react"
import { DecentraWorkContext } from "../context/decentrawork-context"
import { IWorkContract } from "../context/use-decentrawork"
import { useParams } from "react-router-dom"
import ContractCard from "./contract-card"
import { PublicKey } from "@solana/web3.js"
import Loader from "../ui/loader"
import Web3Button from "./web3-btn"

const AcceptFeature = () => {

    const { address } = useParams()

    const [contract, setContract] = useState<IWorkContract>()
    const [loading, setLoading] = useState(false)

    const { 
        initialized, program, publicKey, 
        transactionPending, userProfile
    } = useContext(DecentraWorkContext)


    useEffect(() => {

        const findContract = async () => {
            if (program && publicKey && initialized && !transactionPending) {
                try {
                    setLoading(true)
    
                    const workContractAccount: IWorkContract = await program.account.workContractAccount.fetch(String(address)) as IWorkContract

                    if (workContractAccount) {
                        setContract(workContractAccount as any)
                    } 
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
        }
        findContract()
    }, [publicKey, program, initialized, transactionPending, userProfile?.contractCount, address, setLoading])


    if (loading) return (<Loader />)

    return (
        <div className="flex w-full left-0 justify-center overflow-y-auto mb-20">

            <div className="flex flex-col w-[500px] gap-3 max-w-4/5 shrink-0 my-12 p-6 overflow-y-auto">

                {   contract && <ContractCard client={publicKey} accept={true} contract={{...contract, key: new PublicKey(String(address))}} /> }
                {   !userProfile && <Web3Button action="accept-contract">Do</Web3Button>}
            </div>

        </div>
    );


}


export default AcceptFeature