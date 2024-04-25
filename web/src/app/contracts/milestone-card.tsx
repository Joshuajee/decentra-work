import { IMilestoneContract } from "../context/use-decentrawork";
import { toSol } from "../libs/utils";
import Web3Button from "./web3-btn";
import { PublicKey } from "@solana/web3.js";

export interface IMilestoneFormData {
    title: string;
    description: string;
    price: number;
}

interface IProps {
    contract: IMilestoneContract;
    publicKey: PublicKey
}

export default function MilestoneCard ({contract, publicKey} : IProps) {

    const { key, title, description, idx, price, authority, contractor, paid, claimed  } = contract

    return (
        <div className="flex gap-3 flex-col my-2 w-full bg-base-300 rounded-md p-6">

            <p>ID: #{idx.toString()} </p>

            <p> Price: {toSol(price)} Sol</p>

            <p>Title: {title} </p>

            <p>Description: {description }</p>


            <div className="flex justify-center">

                {

                    (publicKey.toString() === authority.toString() && !paid) &&
                        <div className="bg-green-900 p-0 w-60 rounded-md">

                            <Web3Button action="pay-milestone" data={key} >
                                Release Funds
                            </Web3Button>

                        </div>
                }

                {

                    publicKey.toString() === contractor.toString() && paid && !claimed &&
                        <div className="bg-green-900 p-0 w-60 rounded-md">

                            <Web3Button action="claim-milestone" data={key} >
                                Claim Milestone
                            </Web3Button>

                        </div>
                }


            </div>

        </div>
    )   
}

