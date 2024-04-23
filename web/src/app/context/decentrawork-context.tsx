import { createContext, ReactNode } from "react";
import { ICreateContract, IUserProfile, IWorkContract, useDencentrawork } from "./use-decentrawork";
import { PublicKey } from "@solana/web3.js";

export interface IDecentraWorkContext { 
    publicKey: PublicKey | null;
    initialized: boolean; 
    loading: boolean; 
    transactionPending: boolean; 
    clientContracts: IWorkContract[], 
    program: any, 
    initializeUser:  () => void; 
    setLoading: (value: boolean) => void,
    createContract: (data: ICreateContract) => void, 
}

export const DecentraWorkContext = createContext({} as IDecentraWorkContext)


export default function DecentraWorkProvider({children} : { children: ReactNode}) {

    const decentractWork : IDecentraWorkContext = useDencentrawork() 
    return (
        <DecentraWorkContext.Provider value={decentractWork}>
            {children}
        </DecentraWorkContext.Provider>
    );
  }