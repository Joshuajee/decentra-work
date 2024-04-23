import { ChangeEvent, useState } from "react";
import MilestoneForm, { IMilestoneFormData } from "./milestone-form";
import Web3Button from "../contracts/contract-ui";

const dummyMilestone = {title: "", description: "", price: 0.01}

export default function DashboardFeature() {

  const [contractor, setContractor] = useState("")

  const [milestone, setMilestone] = useState<IMilestoneFormData>(dummyMilestone)

  //const amountToPay = useMemo(() => totalPrice(milestones), [milestones])

  const updateMileStone = (index: number, milestone: IMilestoneFormData) => {
    setMilestone(milestone)
  }

  console.log(milestone)

  

  return (
    <div className="flex justify-center overflow-y-auto mb-20">

      <div className="w-4/5 bg-base-300 mt-12 p-6 rounded-md">

        <h2 className="text-center text-2xl ">Create Work Contract</h2>

        <input 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setContractor(e.currentTarget.value) }
          className="h-12 my-2 rounded-lg w-full indent-4"
          placeholder="Enter Contractor's Address" />
 
        <MilestoneForm 
          index={0}
          milestone={milestone} 
          updateMilestone={updateMileStone}
          />


        {/* <div className="flex justify-center">

          <button 
            onClick={addMilestone}
            className="px-4 py-2 rounded-md border-[1px] border-white"> 
            + Add Milestone
          </button>

        </div> */}


        <Web3Button 
          action="create-contract"
          data={
            {
              contractor, 
              title: milestone?.title, 
              description: milestone?.description, 
              price: milestone?.price 
            }}
          >  
          Create Work Contract 
        </Web3Button>
     
      </div>

    </div>
  );
}
