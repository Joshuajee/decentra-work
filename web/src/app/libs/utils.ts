import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { IMilestoneFormData } from "../dashboard/milestone-form";

export const totalPrice = (milestones: IMilestoneFormData[]) => {

    let price = 0

    milestones.forEach(milestone => {
        price += milestone.price
    });

    return price
}

export const toSol = (value: string | number) => {
    return Number(value.toString()) / LAMPORTS_PER_SOL
}