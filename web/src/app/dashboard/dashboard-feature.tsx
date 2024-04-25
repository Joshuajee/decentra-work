import { ChangeEvent, useState } from "react";
import MilestoneForm, { IMilestoneFormData } from "./milestone-form";
import Web3Button from "../contracts/web3-btn";

export const dummyMilestone = {title: "", description: "", price: 0.01}

export default function DashboardFeature() {

  const [contractor, setContractor] = useState("")

  const [milestone, setMilestone] = useState<IMilestoneFormData>(dummyMilestone)

  const updateMileStone = (index: number, milestone: IMilestoneFormData) => {
    setMilestone(milestone)
  }  

  return (
    <div className="flex justify-center overflow-y-auto mb-20">

      <div className="w-4/5 bg-base-300 mt-12 p-6 rounded-md">

        <h2 className="text-center text-2xl ">Create Work Contract</h2>

        <input 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setContractor(e.currentTarget.value) }
          className="h-12 my-2 rounded-lg w-full indent-4"
          placeholder="Enter Contractor's Address" />


        <h3 className="text-center">Milestone #1</h3>
 
        <MilestoneForm 
          index={0}
          milestone={milestone} 
          updateMilestone={updateMileStone}
          />


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
