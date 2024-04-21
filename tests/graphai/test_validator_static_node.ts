import { graphDataTestRunner } from "~/utils/runner";
import { defaultTestAgents } from "~/agents/agents";
import { anonymization } from "~/utils/utils";

import test from "node:test";
import assert from "node:assert";

test("test static node validation inputs", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        value: {},
        inputs: [""],
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Static node does not allow inputs" },
  );
});

test("test static node validation anyInput", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        value: {},
        anyInput: true,
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Static node does not allow anyInput" },
  );
});

test("test static node validation params", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        value: {},
        params: {},
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Static node does not allow params" },
  );
});

test("test static node validation retry", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        value: {},
        retry: 1,
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Static node does not allow retry" },
  );
});

test("test static node validation timeout", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        value: {},
        timeout: 1,
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Static node does not allow timeout" },
  );
});

test("test static node validation fork", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        value: {},
        fork: 1,
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Static node does not allow fork" },
  );
});

test("test static node validation update", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        value: {},
        update: "unknown",
      },
      computed1: {
        agentId: "echoAgent",
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Update not match: NodeId static1, update: unknown" },
  );
});

test("test static node validation update", async () => {
  const graph_data = anonymization({
    nodes: {
      static1: {
        value: {},
        update: "unknown.param1",
      },
      computed1: {
        agentId: "echoAgent",
      },
    },
  });
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
    },
    { name: "Error", message: "Update not match: NodeId static1, update: unknown.param1" },
  );
});
