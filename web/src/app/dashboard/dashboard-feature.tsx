import { useMemo, useState } from "react";
import MilestoneForm, { IMilestoneFormData } from "./milestone-form";
import { totalPrice } from "../../libs/utils";


const dummyMilestone = {title: "", description: "", price: 0.01}

export default function DashboardFeature() {

  const [milestones, setMilestones] = useState<IMilestoneFormData[]>([dummyMilestone])

  const amountToPay = useMemo(() => totalPrice(milestones), [milestones])

  const addMilestone = () => {
    setMilestones([...milestones, dummyMilestone])
  }

  const updateMileStone = (index: number, milestone: IMilestoneFormData) => {
    const currentMilestones = [...milestones]
    currentMilestones[index] = milestone
    setMilestones(currentMilestones)
  }

  console.log(milestones)

  return (
    <div className="flex justify-center overflow-y-auto mb-20">

      <div className="w-4/5 bg-base-300 mt-12 p-6 rounded-md">

        <h2 className="text-center text-2xl ">Create Work Contract</h2>

        <input 
          className="h-12 my-2 rounded-lg w-full indent-4"
          placeholder="Enter Contractor's Address" />

        
        {
          milestones.map((milestone, index) => {
            return (
              <MilestoneForm 
                key={index}
                index={index}
                milestone={milestone} 
                updateMilestone={updateMileStone}
                />
            )
          })
        }

        <div className="flex justify-center">

          <button 
            onClick={addMilestone}
            className="px-4 py-2 rounded-md border-[1px] border-white"> 
            + Add Milestone
          </button>

        </div>

        <button
          className="px-4 py-3 my-3 rounded-md border-[1px] border-white w-full"> 
          Create Work Contract & pay {amountToPay} Sol
        </button>
     
      </div>

    </div>
  );
}
