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

export function numberToUint64(number: number) {
    // Check for valid number input (non-negative)
    if (number < 0) {
      throw new Error('Cannot convert negative number to uint64');
    }
  
    const buffer = new ArrayBuffer(8); // Create a buffer for 8 bytes (uint64)
    const view = new DataView(buffer);
  
    // Write the number as a big-endian uint64 using setBigUint64 (if available)
    if (typeof view.setBigUint64 === 'function') {
      view.setBigUint64(0, BigInt(number), false); // false for big-endian
    } else {
      // Fallback for browsers without setBigUint64: write lower and upper bytes separately
      view.setUint32(0, number & 0xffffffff, false); // Lower 4 bytes
      view.setUint32(4, number >>> 0xffffffff, false); // Upper 4 bytes (unsigned right shift)
    }
  
    return new Uint8Array(buffer); // Return the Uint8Array representing the uint64
  }