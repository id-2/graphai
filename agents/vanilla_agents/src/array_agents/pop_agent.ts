import { AgentFunction, AgentFunctionInfo, assert } from "graphai";

export const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>, { array: Array<unknown> }> = async ({ namedInputs }) => {
  assert(!!namedInputs, "popAgent: namedInputs is UNDEFINED!");

  const array = namedInputs.array.map((item: any) => item); // shallow copy
  const item = array.pop();
  return { array, item };
};

const popAgentInfo: AgentFunctionInfo = {
  name: "popAgent",
  agent: popAgent,
  mock: popAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the array to pop an item from",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
    properties: {
      item: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
        description: "the item popped from the array",
      },
      array: {
        type: "array",
        description: "the remaining array",
      },
    },
  },
  samples: [
    {
      inputs: { array: [1, 2, 3] },
      params: {},
      result: {
        array: [1, 2],
        item: 3,
      },
    },
    {
      inputs: { array: ["a", "b", "c"] },
      params: {},
      result: {
        array: ["a", "b"],
        item: "c",
      },
    },
    {
      inputs: {
        array: [1, 2, 3],
        array2: ["a", "b", "c"],
      },
      params: {},
      result: {
        array: [1, 2],
        item: 3,
      },
    },
  ],
  description: "Pop Agent",
  category: ["array"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default popAgentInfo;
