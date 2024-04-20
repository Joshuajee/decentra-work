import ContractCard from "./contract-card";

export default function ContractFeature() {


    return (
        <div className="absolute flex w-full left-0 justify-center overflow-y-auto mb-20">

            <div className="flex flex-col w-[500px] gap-3 max-w-4/5 shrink-0 mt-12 p-6">


                <ContractCard />

                <ContractCard />
            

            </div>

        </div>
    );
}
