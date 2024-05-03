import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import { interactiveInputTextAgent } from "./agents/interactiveInputAgent";
import { wikipediaAgent } from "@/experimental_agents";

const graph_data = {
  version: 0.2,
  nodes: {
    interactiveInputAgent: {
      agentId: "interactiveInputTextAgent",
    },
    wikipedia: {
      inputs: ["interactiveInputAgent.answer"],
      agentId: "wikipediaAgent",
      params: {
        lang: "ja",
      },
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, { interactiveInputTextAgent, wikipediaAgent });
  console.log(result.wikipedia);
  console.log("COMPLETE 1");
};
if (process.argv[1] === __filename) {
  main();
}
