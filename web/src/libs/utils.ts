import { IMilestoneFormData } from "../app/dashboard/milestone-form";

export const totalPrice = (milestones: IMilestoneFormData[]) => {

    let price = 0

    milestones.forEach(milestone => {
        price += milestone.price
    });

    return price
}