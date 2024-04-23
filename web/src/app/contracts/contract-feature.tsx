import ContractCard from "./contract-card";
import { useDencentrawork } from "../context/use-decentrawork";

export default function ContractFeature() {

    const { clientContracts } = useDencentrawork()


    return (
        <div className="flex w-full left-0 justify-center overflow-y-auto mb-20">

            <div className="flex flex-col w-[500px] gap-3 max-w-4/5 shrink-0 my-12 p-6 overflow-y-auto">

                {
                    clientContracts.map((contract) => {
                        return <ContractCard contract={contract} />
                    })
                }
     
           

            </div>

        </div>
    );
}
