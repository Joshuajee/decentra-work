import { useNavigate } from "react-router-dom";
import { IWorkContract } from "../context/use-decentrawork";
import Web3Button from "./web3-btn";
import { PublicKey } from "@solana/web3.js";

export interface IMilestoneFormData {
    title: string;
    description: string;
    price: number
}

interface IProps {
    contract: IWorkContract;
    accept?: boolean;
    client?: PublicKey | null;
}

export default function ContractCard ({contract, accept, client} : IProps) {

    const { authority, contractor, milestones, accepted, key } = contract

    const navigate = useNavigate()

    return (
        <div className="flex gap-3 flex-col my-2 w-full bg-base-300 rounded-md p-6">

            <h3> Client PDA </h3>

            <p> {authority.toString()} </p>

            <h3>Contractor PDA</h3>

            <p>{contractor.toString()}</p>

            <h3> Milestones: {milestones} </h3>

            <h3>Accepted: {accepted ? "Yes" : "No"} </h3>

            <button className="border-[1px] border-white p-2" onClick={() => navigate("/contract/"+ key)}>
                View
            </button>

            {
                accept && !accepted && contractor.toString() === client?.toString() &&(
                    <div className="bg-green-700 rounded-md">
                        <Web3Button data={new PublicKey(key)} action="accept-contract">Accept Contract</Web3Button>
                    </div>
                )
            }

        </div>
    )   
}

