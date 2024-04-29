import { AgentFunction } from "../../graphai";
export declare const sortByValuesAgent: AgentFunction<{
    assendant?: boolean;
}, {
    contents: Array<any>;
}, Array<any>>;
declare const sortByValuesAgentInfo: {
    name: string;
    agent: AgentFunction<{
        assendant?: boolean | undefined;
    }, {
        contents: Array<any>;
    }, any[]>;
    mock: AgentFunction<{
        assendant?: boolean | undefined;
    }, {
        contents: Array<any>;
    }, any[]>;
    samples: never[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default sortByValuesAgentInfo;
