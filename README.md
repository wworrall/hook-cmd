# Hook CMD

A simple webhook handler written in Typescript that executes a command on receipt of a webhook. Inspired by [Docker Hook](https://github.com/schickling/docker-hook).

Transpiled to a single javascript executable with zero dependencies.

_Requires Node 16_ for safe exiting when exception thrown (no use of `make-promises-safe`).

## Usage

Download

```console
curl https://raw.githubusercontent.com/wworrall/hook-cmd/master/bin/hook-cmd > /usr/local/bin/hook-cmd;
```

Make executable

```console
chmod +x /usr/local/bin/hook-cmd;
```

Create configuration as a JSON file:

```jsonc
// hookCmdConfig.json
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

Pass configuration filename in to `hook-cmd` as the first argument.

```console
hook-cmd hookCmdConfig.json
```

`std log` and `std err` of the commands are piped to `std log` and `std err` of the parent `hook-cmd` process.

## Run as service (recommended)

May only be accurate for Ubuntu

1. Place the following in to a file named `/etc/systemd/system/hook-cmd.service`.

```
[Unit]
Description=Hook CMD
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=ubuntu
ExecStart=hook-cmd /path/to/hookCmdConfig.json
StandardOutput=journal+console
StandardError=journal+console

[Install]
WantedBy=multi-user.target
```

2. Remember to change `User=ubuntu` if required and change `/path/to/hookCmdConfig.json`.

3. Run:

```console
sudo service hook-cmd start
```

4. To enable automatic start on system boot:

```console
sudo sudo systemctl enable hook-cmd
```

5. Tip: you can tail the logs of the service by running:

```console
journalctl -u hook-cmd -b -f
```

## Contributing

If you have any suggestions please open up an issue.

## License

[MIT License](http://opensource.org/licenses/MIT)
