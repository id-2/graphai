import { GraphAI } from "@/graphai";
import { AgentFilterFunction } from "@/type";

import { defaultTestAgents } from "@/utils/test_agents";

import test from "node:test";
import assert from "node:assert";

const simpleAgentFilter1: AgentFilterFunction = async (context, next) => {
  if (context.params.filter) {
    context.params.filter.push("1");
  }
  return next(context);
};
const simpleAgentFilter2: AgentFilterFunction = async (context, next) => {
  if (context.params.filter) {
    context.params.filter.push("2");
  }
  return next(context);
};

const callbackDictonary = {};

test("test agent filter", async () => {
  const graph_data = {
    version: 0.2,
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
          filter: [],
        },
      },
      bypassAgent: {
        agentId: "bypassAgent",
        inputs: ["echo"],
        isResult: true,
      },
    },
  };
  const agentFilters = [
    {
      name: "simpleAgentFilter1",
      agent: simpleAgentFilter1,
    },
    {
      name: "simpleAgentFilter2",
      agent: simpleAgentFilter2,
    },
  ];

  const graph = new GraphAI({ ...graph_data }, { ...defaultTestAgents, ...callbackDictonary }, { agentFilters });
  const result = await graph.run();
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { bypassAgent: [{ message: "hello", filter: ["1", "2"] }] });
});

test("test agent filter with agent condition", async () => {
  const graph_data = {
    version: 0.2,
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
          filter: [],
        },
      },
      bypassAgent: {
        agentId: "bypassAgent",
        inputs: ["echo"],
        isResult: true,
      },
    },
  };
  const agentFilters = [
    {
      name: "simpleAgentFilter1",
      agent: simpleAgentFilter1,
      agentIds: ["echoAgent"],
    },
    {
      name: "simpleAgentFilter2",
      agent: simpleAgentFilter2,
      agentIds: ["dummy"],
    },
  ];
  // console.log(JSON.stringify(graph_data, null, 2));
  const graph = new GraphAI(graph_data, { ...defaultTestAgents, ...callbackDictonary }, { agentFilters });
  const result = await graph.run();
  assert.deepStrictEqual(result, { bypassAgent: [{ message: "hello", filter: ["1"] }] });
});

test("test agent filter with agent condition", async () => {
  const graph_data = {
    version: 0.2,
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
          filter: [],
        },
      },
      bypassAgent: {
        agentId: "bypassAgent",
        inputs: ["echo"],
        isResult: true,
      },
    },
  };
  const agentFilters = [
    {
      name: "simpleAgentFilter1",
      agent: simpleAgentFilter1,
      nodeIds: ["dummy"],
    },
    {
      name: "simpleAgentFilter2",
      agent: simpleAgentFilter2,
      nodeIds: ["echo"],
    },
  ];
  // console.log(JSON.stringify(graph_data, null, 2));
  const graph = new GraphAI(graph_data, { ...defaultTestAgents, ...callbackDictonary }, { agentFilters });
  const result = await graph.run();
  assert.deepStrictEqual(result, { bypassAgent: [{ message: "hello", filter: ["2"] }] });
});