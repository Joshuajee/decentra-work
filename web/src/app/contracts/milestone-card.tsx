import { useNavigate } from "react-router-dom";
import { IMilestoneContract, IWorkContract } from "../context/use-decentrawork";
import { title } from "process";
import { toSol } from "../libs/utils";

export interface IMilestoneFormData {
    title: string;
    description: string;
    price: number
}

interface IProps {
    contract: IMilestoneContract
}

export default function MilestoneCard ({contract} : IProps) {

    const { title, description, idx, price,  key } = contract

    const navigate = useNavigate()

    return (
        <div className="flex gap-3 flex-col my-2 w-full bg-base-300 rounded-md p-6">

            <p>ID: #{idx.toString()} </p>

            <p> Price: {toSol(price)} Sol</p>

            <p>Title: {title} </p>

            <p>Description: {description }</p>


            <button onClick={() => navigate("/contract/"+ key)}>
                View
            </button>

        </div>
    )   
}

