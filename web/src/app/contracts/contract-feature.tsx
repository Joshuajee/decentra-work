import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import WorkContract from './tabs/work-contracts';
import EmploymentContract from './tabs/employment-contract';


export default function ContractFeature() {



    return (
        <div className="relative flex w-full left-0 justify-center overflow-y-auto my-20">

            <Tabs className={"w-full"}>

                <TabList className={"flex justify-center w-full"} > 
                    <Tab>Job Contracts</Tab> <Tab>Employment Contracts</Tab> 
                </TabList>

                <TabPanel>
                    <WorkContract />
                </TabPanel>

                <TabPanel>
                    <EmploymentContract />
                </TabPanel>

            </Tabs>

        </div>
    );
}
