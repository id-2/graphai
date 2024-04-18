"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticNode = exports.ComputedNode = exports.Node = void 0;
const type_1 = require("./type");
const utils_1 = require("./utils/utils");
const log_1 = require("./log");
class Node {
    constructor(nodeId, forkIndex, data, graph) {
        this.sources = {}; // data sources.
        this.waitlist = new Set(); // List of nodes which need data from this node.
        this.state = type_1.NodeState.Waiting;
        this.result = undefined;
        this.nodeId = nodeId;
        this.forkIndex = forkIndex;
        this.anyInput = data.anyInput ?? false;
        this.inputs = (data.inputs ?? []).map((input) => {
            const source = (0, utils_1.parseNodeName)(input);
            this.sources[source.nodeId] = source;
            return source.nodeId;
        });
        this.pendings = new Set(this.inputs);
        this.fork = data.fork;
        this.graph = graph;
    }
    asString() {
        return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
    }
    removePending(nodeId) {
        if (this.anyInput) {
            const [result] = this.graph.resultsOf([this.sources[nodeId]]);
            if (result) {
                this.pendings.clear();
            }
        }
        else {
            this.pendings.delete(nodeId);
        }
    }
    setResult(result, state) {
        this.state = state;
        this.result = result;
        this.waitlist.forEach((nodeId) => {
            const node = this.graph.nodes[nodeId];
            // Todo: Avoid running before Run()
            node.removePending(this.nodeId);
        });
    }
}
exports.Node = Node;
class ComputedNode extends Node {
    constructor(nodeId, forkIndex, data, graph) {
        super(nodeId, forkIndex, data, graph);
        this.retryCount = 0;
        this.isStaticNode = false;
        this.params = data.params ?? {};
        this.agentId = data.agentId ?? graph.agentId;
        this.retryLimit = data.retry ?? 0;
        this.timeout = data.timeout;
    }
    // for completed
    pushQueueIfReady() {
        if (this.pendings.size === 0) {
            // If input property is specified, we need to ensure that the property value exists.
            const count = this.inputs.reduce((count, nodeId) => {
                const source = this.sources[nodeId];
                if (source.propId) {
                    const [result] = this.graph.resultsOf([source]);
                    if (!result) {
                        return count;
                    }
                }
                return count + 1;
            }, 0);
            if ((this.anyInput && count > 0) || count == this.inputs.length) {
                this.graph.pushQueue(this);
            }
        }
    }
    // for computed
    retry(state, error) {
        if (this.retryCount < this.retryLimit) {
            this.retryCount++;
            this.execute();
        }
        else {
            this.state = state;
            this.result = undefined;
            this.error = error;
            this.transactionId = undefined; // This is necessary for timeout case
            this.graph.removeRunning(this);
        }
    }
    removePending(nodeId) {
        super.removePending(nodeId);
        if (this.graph.isRunning) {
            this.pushQueueIfReady();
        }
    }
    async execute() {
        const results = this.graph
            .resultsOf(this.inputs.map((input) => {
            return this.sources[input];
        }))
            .filter((result) => {
            // Remove undefined if anyInput flag is set.
            return !this.anyInput || result !== undefined;
        });
        const transactionId = Date.now();
        const log = (0, log_1.executeLog)(this.nodeId, this.retryCount, transactionId, this.agentId, this.params, results);
        this.graph.appendLog(log);
        this.state = type_1.NodeState.Executing;
        this.transactionId = transactionId;
        if (this.timeout && this.timeout > 0) {
            setTimeout(() => {
                if (this.state === type_1.NodeState.Executing && this.transactionId === transactionId) {
                    console.log(`-- ${this.nodeId}: timeout ${this.timeout}`);
                    (0, log_1.timeoutLog)(log);
                    this.retry(type_1.NodeState.TimedOut, Error("Timeout"));
                }
            }, this.timeout);
        }
        try {
            const callback = this.graph.getCallback(this.agentId);
            const localLog = [];
            const result = await callback({
                nodeId: this.nodeId,
                retry: this.retryCount,
                params: this.params,
                inputs: results,
                forkIndex: this.forkIndex,
                verbose: this.graph.verbose,
                agents: this.graph.callbackDictonary,
                log: localLog,
            });
            if (this.transactionId !== transactionId) {
                console.log(`-- ${this.nodeId}: transactionId mismatch`);
                return;
            }
            (0, log_1.callbackLog)(log, result, localLog);
            log.state = type_1.NodeState.Completed;
            this.setResult(result, type_1.NodeState.Completed);
            this.graph.removeRunning(this);
        }
        catch (error) {
            if (this.transactionId !== transactionId) {
                console.log(`-- ${this.nodeId}: transactionId mismatch(error)`);
                return;
            }
            const isError = error instanceof Error;
            (0, log_1.errorLog)(log, isError ? error.message : "Unknown");
            if (isError) {
                this.retry(type_1.NodeState.Failed, error);
            }
            else {
                console.error(`-- ${this.nodeId}: Unexpecrted error was caught`);
                this.retry(type_1.NodeState.Failed, Error("Unknown"));
            }
        }
    }
}
exports.ComputedNode = ComputedNode;
class StaticNode extends Node {
    constructor(nodeId, forkIndex, data, graph) {
        super(nodeId, forkIndex, data, graph);
        this.isStaticNode = true;
        this.value = data.value;
        this.update = data.update;
    }
    // for static
    injectValue(value) {
        const log = (0, log_1.injectValueLog)(this.nodeId, value);
        this.graph.appendLog(log);
        this.setResult(value, type_1.NodeState.Injected);
        //console.error("- injectValue called on non-source node.", this.nodeId);
    }
}
exports.StaticNode = StaticNode;