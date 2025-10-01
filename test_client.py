#!/usr/bin/env python3
import json
import subprocess
import sys

def test_mcp_server():
    # Start the server process
    proc = subprocess.Popen([
        sys.executable, "server/server.py"
    ], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # Initialize request
    init_request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "test-client", "version": "1.0.0"}
        }
    }
    
    # Send initialize
    proc.stdin.write(json.dumps(init_request) + "\n")
    proc.stdin.flush()
    
    # Read response
    response = proc.stdout.readline()
    print("Initialize response:", response.strip())
    
    # Send initialized notification
    initialized_notification = {
        "jsonrpc": "2.0",
        "method": "notifications/initialized"
    }
    
    proc.stdin.write(json.dumps(initialized_notification) + "\n")
    proc.stdin.flush()
    
    # List tools request
    tools_request = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/list",
        "params": {}
    }
    
    proc.stdin.write(json.dumps(tools_request) + "\n")
    proc.stdin.flush()
    
    response = proc.stdout.readline()
    print("Tools list response:", response.strip())
    
    # Call health tool
    health_request = {
        "jsonrpc": "2.0",
        "id": 3,
        "method": "tools/call",
        "params": {
            "name": "health",
            "arguments": {}
        }
    }
    
    proc.stdin.write(json.dumps(health_request) + "\n")
    proc.stdin.flush()
    
    response = proc.stdout.readline()
    print("Health tool response:", response.strip())
    
    proc.terminate()

if __name__ == "__main__":
    test_mcp_server()