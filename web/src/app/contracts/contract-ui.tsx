import { ReactNode } from "react"
import { ICreateContract, useDencentrawork } from "./contract-data-access"

interface IProps {
    children: ReactNode;
    action: "create-contract";
    data: ICreateContract
}

const Web3Button = ({ children, action, data }: IProps) => {

    const { initialized, loading, initializeUser, createContract } = useDencentrawork()

    const handleClick = () => {

        if (!initialized) {
            initializeUser()
            return
        }

        switch (action) {
            case "create-contract":
                createContract(data)
                return
            default:
                return
        }
    }

    const text = initialized ? children : "Initialize Account"

    return (
        <button
            onClick={handleClick}
            className="px-4 py-3 my-3 rounded-md border-[1px] border-white w-full"> 
            { loading ? "Please Waiting..." : text }
        </button>
    )
}

export default Web3Button