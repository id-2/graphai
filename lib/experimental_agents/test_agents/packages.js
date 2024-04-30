"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeNodeIdAgent = exports.copy2ArrayAgent = exports.copyMessageAgent = exports.countingAgent = exports.bypassAgent = exports.echoAgent = void 0;
const echo_agent_1 = __importDefault(require("../../experimental_agents/test_agents/echo_agent"));
exports.echoAgent = echo_agent_1.default;
const bypass_agent_1 = __importDefault(require("../../experimental_agents/test_agents/bypass_agent"));
exports.bypassAgent = bypass_agent_1.default;
const counting_agent_1 = __importDefault(require("../../experimental_agents/test_agents/counting_agent"));
exports.countingAgent = counting_agent_1.default;
const copy_message_agent_1 = __importDefault(require("../../experimental_agents/test_agents/copy_message_agent"));
exports.copyMessageAgent = copy_message_agent_1.default;
const copy2array_agent_1 = __importDefault(require("../../experimental_agents/test_agents/copy2array_agent"));
exports.copy2ArrayAgent = copy2array_agent_1.default;
const merge_node_id_agent_1 = __importDefault(require("../../experimental_agents/test_agents/merge_node_id_agent"));
exports.mergeNodeIdAgent = merge_node_id_agent_1.default;