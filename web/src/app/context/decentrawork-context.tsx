import { createContext, ReactNode } from "react";
import { IUserProfile, useDencentrawork } from "./use-decentrawork";
import { PublicKey } from "@solana/web3.js";

export interface IDecentraWorkContext { 
    publicKey: PublicKey | null;
    initialized: boolean; 
    loading: boolean; 
    transactionPending: boolean; 
    userProfile?: IUserProfile;
    program: any, 
    initializeUser:  () => void; 
    setLoading: (value: boolean) => void,
    setTransactionPending: (value: boolean) => void,
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