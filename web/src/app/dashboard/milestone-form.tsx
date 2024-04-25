import { useState } from "react";

export interface IMilestoneFormData {
    title: string;
    description: string;
    price: number
}

interface IProps {
    index: number;
    milestone: IMilestoneFormData;
    updateMilestone: (index: number, milestone: IMilestoneFormData) => void;
}

export default function MilestoneForm ({index, milestone, updateMilestone} : IProps) {

    const [title, setTitle] = useState(milestone.title)
    const [price, setPrice] = useState(milestone.price)
    const [description, setDescription] = useState(milestone.description)

    const update = () => {
        updateMilestone(index, {title, price, description})
    }

    return (
        <div className="my-2 text-white">

            <label>Title</label>

            <input 
                value={title}
                onChange={(e) =>setTitle(e.target.value)}
                onBlur={update}
                className="h-12 my-2 rounded-lg w-full indent-4"
                placeholder="Run Facebook Ads" />

            
            <label>Price</label>

            <input 
                value={price}
                onChange={(e) =>setPrice(Number(e.target.value))}
                onBlur={update}
                type="number"
                className="h-12 my-2 rounded-lg w-full indent-4"
                placeholder="0.1 sol" />

            
            <label htmlFor="description">Description</label>

            <textarea 
                value={description}
                onChange={(e) =>setDescription(e.target.value)}
                onBlur={update}
                id="description" 
                className="block resize-none h-40 w-full px-4 py-2 rounded-xl">



            </textarea>

            

        </div>
    )   
}

