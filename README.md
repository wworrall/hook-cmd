# Hook CMD

A simple webhook handler written in Typescript that executes a command on receipt of a webhook. Inspired by [Docker Hook](https://github.com/schickling/docker-hook).

Transpiled to a single javascript executable with zero dependencies.

_Requires Node 16_

## Usage

```console
curl https://raw.githubusercontent.com/wworrall/hook-cmd/master/bin/hook-cmd > /usr/local/bin/hook-cmd; chmod +x /usr/local/bin/hook-cmd
```

Create a configuration file e.g. `hookCmdConfig.json`:

```json
{
  "hookCmds": [
    {
      "hook": "a secret key to identify this hook. Hook will be listened for at http://localhost:<port>/<hook>",
      "cmd": "the command to execute"
    }
  ],
  "port": 5000
}
```

And pipe this configuration file in to hook-cmd as the first command

```
hook-cmd
```

It is recommended to run this as a service. See [this StackOverflow answer](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service/29042953#29042953) and remember to change `nogroup` to a user on the system.

A log object for the most recent execution is stored in `hookCmd.log`.

## Contributing

Please email me at wcgworrall@gmail.com and I will get in touch about working together and put guidelines in the repository.
