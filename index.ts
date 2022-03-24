#!/usr/bin/env node

import http from "node:http";
import { spawn } from "node:child_process";

type Config = {
  port?: number;
  hookCmds: HookCmd[];
};

type HookCmd = {
  hook: string;
  cmd: string;
};

const getCmdAndOptions = (hook?: string) =>
  hookCmds.find((hookCmd) => hookCmd.hook === hook);

const app = http.createServer(async (req, res) => {
  const hook = req.url?.slice(1);
  const hookCmd = getCmdAndOptions(hook);

  let statusCode: number;
  let data: object;
  if (!hookCmd) {
    statusCode = 400;
    data = { message: "Bad request." };
  } else {
    statusCode = 202;
    data = { message: "Hook received. Executing command." };
  }

  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();

  if (!hookCmd) return;

  const cmd = hookCmd.cmd.split(/\s+/)[0];
  const args = hookCmd.cmd.split(/\s+/).slice(1);
  spawn(cmd, args, {
    stdio: ["pipe", process.stdout, process.stderr],
  });
});

// 0 is node, 1 is current script, 2 is config file passed in as stdin first
// argument
const configStr = process.argv[2];
const config: Config = JSON.parse(configStr);

const port = config.port || 5000;
const { hookCmds } = config;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
