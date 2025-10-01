# Cursor MCP Server

A pure JavaScript MCP server with health, handshake, and list-models tools. No Python required!

## Installation

```bash
npm install -g cursor-mcp-myserver
```

## Usage

```bash
cursor-mcp-myserver
```

## Cursor Configuration

Add to your Cursor settings (`Ctrl+,` → Extensions → MCP):

```json
{
  "mcpServers": {
    "cursor-mcp-myserver": {
      "command": "npx",
      "args": ["cursor-mcp-myserver"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "cursor-mcp-myserver": {
      "command": "cursor-mcp-myserver"
    }
  }
}
```

## Available Tools

- `health` - Server status and uptime
- `handshake` - Server capabilities
- `list-models` - Available models