import { useNavigate } from "react-router-dom";
import { IWorkContract } from "../context/use-decentrawork";

export interface IMilestoneFormData {
    title: string;
    description: string;
    price: number
}

interface IProps {
    contract: IWorkContract
}

export default function ContractCard ({contract} : IProps) {

    const { authority, contractor, milestones, key } = contract

    const navigate = useNavigate()

    return (
        <div className="flex gap-3 flex-col items-center my-2 w-full bg-base-300 rounded-md p-6">

            <h3> Client PDA </h3>

            <p> {authority.toString()} </p>

            <h3>Contractor PDA</h3>

            <p>{contractor.toString()}</p>

            <h3> Milestones {milestones} </h3>

            <button onClick={() => navigate("/contract/"+ key)}>
                View
            </button>

        </div>
    )   
}

