# Hook CMD

A simple webhook handler written in Typescript that executes a command on receipt of a webhook. Inspired by [Docker Hook](https://github.com/schickling/docker-hook).

Transpiled to a single javascript executable with zero dependencies.

_Requires Node 16_ for safe exiting when exception thrown (no use of `make-promises-safe`)

## Usage

Download

```console
curl https://raw.githubusercontent.com/wworrall/hook-cmd/master/bin/hook-cmd > /usr/local/bin/hook-cmd;
```

Make executable

```console
chmod +x /usr/local/bin/hook-cmd;
```

Create a configuration object as a json string. E.g. `hookCmdConfig.json`:

```jsonc
{
  "hookCmds": [
    {
      "hook": "top-secret-key", // Hook will be listened for at http://localhost:<port>/<hook>"
      "cmd": "echo", // hello world
      "args": ["hello world"] // [optional] array of arguments
    }
  ],
  "port": 5000 // [optional] defaults to 5000
}
```

Pipe this configuration object in to `hook-cmd` as the first argument

```console
hook-cmd "$(<hookCmdConfig.json)"
```

To run as a service (recommended), see [this StackOverflow answer](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service/29042953#29042953).

`std log` and `std err` of the commands are piped to `std log`/`std err` of the parent `hook-cmd` process.

## Contributing

Please raise an issue and we'll go from there :)
