import "make-promises-safe";
import http from "http";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import hookCmdConfig from "./hookCmdConfig.json";

type HookCmd = {
  hook: string;
  cmd: string;
  childProcessOptions?: any;
};

type CmdLog = {
  stderr?: string;
  stdout?: string;
  execException?: object;
  error?: string;
};

const getCmdAndOptions = (hook?: string) => {
  const hookCmd = hookCmdConfig.hookCmds.find(
    (hookCmd: HookCmd) => hookCmd.hook === hook
  ) as HookCmd;
  return {
    cmd: hookCmd?.cmd,
    childProcessOptions: hookCmd?.childProcessOptions,
  };
};
const app = http.createServer(async (req, res) => {
  const cmdLog: CmdLog = {};
  try {
    const hook = req.url?.slice(1);
    const { cmd, childProcessOptions } = getCmdAndOptions(hook);

    let statusCode = 202;
    let data: object = { message: "Hook received. Executing command." };

    if (!cmd) {
      statusCode = 400;
      data = { message: "Bad request." };
    }

    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.write(JSON.stringify(data));
    res.end();

    if (statusCode !== 202) return;

    const process = exec(
      cmd,
      childProcessOptions,
      (execException, stdout, stderr) => {
        cmdLog.execException = execException || undefined;
        cmdLog.stderr = stderr.toString();
        cmdLog.stdout = stdout.toString();
      }
    );

    await new Promise((resolve) => process.on("close", resolve));
  } catch (e) {
    cmdLog.error = e.stack || e.message;
  } finally {
    fs.writeFileSync(
      path.join(process.cwd(), "hookCmd.log"),
      JSON.stringify(cmdLog, undefined, 2)
    );
  }
});

const port = hookCmdConfig.port || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
