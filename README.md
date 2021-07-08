# Hook CMD

A simple webhook handler written in Typescript that executes a command on receipt of a webhook. Inspired by [Docker Hook](https://github.com/schickling/docker-hook).

## Usage

Clone this repository, run `npm run build && npm start`.

You need to add configuration to `hookCmdConfig.json`. See that file for more information.

It is recommended to run this as a service. See [this StackOverflow answer](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service/29042953#29042953) and remember to change `nogroup` to a user on the system.

A log object for the most recent execution is stored in `hookCmd.log`.

## Contributing

Please email me at wcgworrall@gmail.com and I will get in touch about working together and put guidelines in the repository.
