export { AgentFunction, AgentFunctionDictonary, GraphData } from "./type";
import { AgentFunctionDictonary, GraphData, TransactionLog, ResultDataDictonary, ResultData, CallbackDictonaryArgs } from "./type";
import { Node } from "./node";
type GraphNodes = Record<string, Node>;
export declare class GraphAI {
    private data;
    nodes: GraphNodes;
    agentId?: string;
    callbackDictonary: AgentFunctionDictonary;
    isRunning: boolean;
    private runningNodes;
    private nodeQueue;
    private onComplete;
    private concurrency;
    private loop?;
    private repeatCount;
    verbose: boolean;
    private logs;
    private createNodes;
    private getValueFromResults;
    private initializeNodes;
    constructor(data: GraphData, callbackDictonary: CallbackDictonaryArgs);
    getCallback(agentId?: string): import("./type").AgentFunction<any, any, any>;
    asString(): string;
    results(): ResultDataDictonary;
    errors(): Record<string, Error>;
    private pushReadyNodesIntoQueue;
    run(): Promise<ResultDataDictonary>;
    private runNode;
    pushQueue(node: Node): void;
    removeRunning(node: Node): void;
    appendLog(log: TransactionLog): void;
    transactionLogs(): TransactionLog[];
    injectValue(nodeId: string, value: ResultData): void;
    resultsOf(nodeIds: Array<string>): ResultData[];
}
