#!/usr/bin/env node
"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _child_process = require("child_process");

var _os = require("os");

var _path = require("path");

var _inquirer = _interopRequireDefault(require("inquirer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emulatorPath = (0, _path.normalize)((0, _path.join)(process.env.ANDROID_HOME, "/emulator/emulator"));

function getEmulators() {
  const emulators = (0, _child_process.execFileSync)(emulatorPath, ["-list-avds"], {
    encoding: "utf8"
  }).replace(/\n$/, "").split("\n");
  return emulators.filter(e => !!e);
}

async function main() {
  const emulators = getEmulators();
  const questions = [{
    type: "list",
    name: "emulator",
    message: "Which emulator do you want to start?",
    choices: emulators
  }];
  const answers = await _inquirer.default.prompt(questions);
  console.log(_chalk.default.green(`Starting emulator ${answers.emulator}`));
  const options = {};

  if ((0, _os.platform)() === "win32") {
    options.shell = true;
  }

  const runOnEmulator = (0, _child_process.spawnSync)(emulatorPath, ["-avd", answers.emulator], options);
  console.log(_chalk.default.green(`Emulator ${answers.emulator} started`));
  console.log(_chalk.default.yellow(runOnEmulator.stdout.toString()));

  if (runOnEmulator.stderr.toString()) {
    console.log(_chalk.default.red(runOnEmulator.stderr.toString()));
  }

  process.exit(1);
}

main();