
# @graphai/input_agents for GraphAI

Input agents for GraphAI.

### Install

```sh
yarn add @graphai/input_agents
```

### Usage

```typescript
import { GraphAI } from "graphai";
import { textInputAgent } from "@graphai/input_agents";

const agents = { textInputAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

