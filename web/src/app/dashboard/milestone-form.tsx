export interface IMilestoneFormData {
    title: string;
    description: string;
    price: number
}

interface IProps {
    index: number;
    milestone: IMilestoneFormData;
}

export default function MilestoneForm ({index} : IProps) {

    return (
        <div className="my-2">

            <h3 className="text-center">Milestone #{index + 1}</h3>

            <label>Title</label>

            <input 
                className="h-12 my-2 rounded-lg w-full indent-4"
                placeholder="Run Facebook Ads" />

            
            <label>Price</label>

            <input 
                type="number"
                className="h-12 my-2 rounded-lg w-full indent-4"
                placeholder="0.1 sol" />

            
            <label htmlFor="description">Description</label>

            <textarea id="description" className="block resize-none h-40 w-full">



            </textarea>

            

        </div>
    )   
}

