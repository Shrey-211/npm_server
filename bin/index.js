#!/usr/bin/env node
import { spawnSync, spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPy = path.join(__dirname, "../server/server.py");

const argv = process.argv.slice(2);

// parse a simple flag/positional for port and token
let port = process.env.MCP_PORT || "4040";
let token = process.env.MCP_TOKEN || "";
if (argv.length) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--port" || argv[i] === "-p") { port = argv[i+1]; i++; }
    else if (argv[i] === "--token" || argv[i] === "-t") { token = argv[i+1]; i++; }
    else if (/^\d+$/.test(argv[i])) { port = argv[i]; }
  }
}

function checkPython() {
  const r = spawnSync("python", ["--version"]);
  if (r.error) return false;
  return r.status === 0;
}

if (!checkPython()) {
  console.error("python not found. Please install Python 3.8+");
  process.exit(1);
}

const reqFile = path.join(__dirname, "../server/requirements.txt");
if (fs.existsSync(reqFile)) {
  console.log("Installing Python requirements (this may take a moment)...");
  const pip = spawnSync("python", ["-m", "pip", "install", "-r", reqFile], { stdio: "inherit" });
  if (pip.status !== 0) {
    console.error("Failed to install Python requirements.");
    process.exit(1);
  }
}

const env = Object.assign({}, process.env, { MCP_PORT: port });
if (token) env.MCP_TOKEN = token;

console.log(`🚀 Starting FastMCP server on port ${port}...`);
const proc = spawn("python", [serverPy], { stdio: "inherit", env });

proc.on("close", (code) => {
  console.log(`MCP server exited with code ${code}`);
  process.exit(code);
});
