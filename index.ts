#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";

type Config = {
  port?: number;
  hookCmds: HookCmd[];
};

type HookCmd = {
  hook: string;
  cmd: string;
  args?: string[];
};

const getCmdAndOptions = (hook?: string) =>
  hookCmds.find((hookCmd) => hookCmd.hook === hook);

const app = http.createServer(async (req, res) => {
  const hook = req.url?.slice(1);
  const hookCmd = getCmdAndOptions(hook);

  let statusCode: number;
  let data: object;
  if (!hookCmd) {
    statusCode = 404;
    data = { message: "Not found." };
  } else {
    statusCode = 202;
    data = { message: "Hook received. Executing command." };
  }

  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();

  if (!hookCmd) return;

  if (hookCmd.args?.length) {
    spawn(hookCmd.cmd, hookCmd.args, {
      stdio: ["pipe", process.stdout, process.stderr],
    });
  } else {
    spawn(hookCmd.cmd, {
      stdio: ["pipe", process.stdout, process.stderr],
    });
  }
});

// 0 is node, 1 is current script, 2 is config filename passed in as stdin first
// argument
const configFilename = process.argv[2];
const configStr = fs.readFileSync(configFilename, "utf8");
const config: Config = JSON.parse(configStr);

const port = config.port || 5000;
const { hookCmds } = config;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
