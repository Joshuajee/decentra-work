import { useState } from "react";
import MilestoneForm, { IMilestoneFormData } from "./milestone-form";
import { Button } from "@solana/wallet-adapter-react-ui/lib/types/Button";
import { WalletButton } from "../solana/solana-provider";


const dummyMilestone = {title: "", description: "", price: 0}

export default function DashboardFeature() {

  const [milestones, setMilestons] = useState<IMilestoneFormData[]>([{title: "Milestone 1", description: "Completed this", price: 1000000}])

  const addMilestone = () => {
    setMilestons([...milestones, dummyMilestone])
  }

  return (
    <div className="flex justify-center overflow-y-auto mb-20">

      <div className="w-4/5 bg-base-300 mt-12 p-6 rounded-md">

        <h2 className="text-center text-2xl ">Create Work Contract</h2>

        <input 
          className="h-12 my-2 rounded-lg w-full indent-4"
          placeholder="Enter Contractor's Address" />

        
        {
          milestones.map((milestone, index) => {
            return <MilestoneForm milestone={milestone} key={index} index={index} />
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
          Create Work Contract
        </button>
     
      </div>

    </div>
  );
}
