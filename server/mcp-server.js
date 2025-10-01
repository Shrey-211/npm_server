#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "cursor-mcp-myserver",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const startTime = Date.now();

// Health tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "health",
        description: "Get server health status and uptime",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "handshake",
        description: "Get server capabilities and info",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "list-models",
        description: "List available models",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  switch (name) {
    case "health":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "ok",
              uptime: (Date.now() - startTime) / 1000,
            }),
          },
        ],
      };

    case "handshake":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              name: "cursor-mcp-myserver",
              version: "1.0.0",
              capabilities: ["run-playwright", "query-rag", "list-models"],
              endpoints: { invoke: "/invoke", metadata: "/metadata" },
            }),
          },
        ],
      };

    case "list-models":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              models: ["local-llm-1", "gpt-ish"],
            }),
          },
        ],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);