import { useNavigate } from "react-router-dom";

export interface IMilestoneFormData {
    title: string;
    description: string;
    price: number
}

interface IProps {
    index: number;
    milestone: IMilestoneFormData;
}

export default function ContractCard () {

    const navigate = useNavigate()

    return (
        <div className="my-2 w-full bg-base-300 rounded-md p-6">


            <p>Client: </p>

            <p>Contractor: </p>

            <p>Price:</p>

            <div className="flex justify-between">

                <p>Milestones: </p>

                <button onClick={() => navigate("/contract/")}>
                    View
                </button>


            </div>
            
        </div>
    )   
}

