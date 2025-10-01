# server/server.py
import os
import time

# Use the public names from fastmcp
from fastmcp import FastMCP, Context

PORT = int(os.environ.get("MCP_PORT", "4040"))
NAME = os.environ.get("MCP_NAME", "cursor-mcp-myserver")
TOKEN = os.environ.get("MCP_TOKEN", "").strip()  # optional bearer token

mcp = FastMCP(NAME, version="1.0.0")
start_time = time.time()



@mcp.tool(name="health")
def health(ctx: Context | None = None):
    return {"status": "ok", "uptime": time.time() - start_time}

@mcp.tool(name="handshake")
def handshake(ctx: Context | None = None):
    return {
        "name": NAME,
        "version": "1.0.0",
        "capabilities": ["run-playwright", "query-rag", "list-models"],
        "endpoints": {"invoke": "/invoke", "metadata": "/metadata"},
    }

@mcp.tool(name="list-models")
def list_models(ctx: Context | None = None):
    return {"models": ["local-llm-1", "gpt-ish"]}

def run():
    mcp.run()

if __name__ == "__main__":
    print(f"Starting FastMCP server {NAME} on port {PORT}")
    run()
