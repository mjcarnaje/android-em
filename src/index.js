#!/usr/bin/env node
import chalk from "chalk";
import { execFileSync, spawnSync } from "child_process";
import { platform } from "os";
import { join, normalize } from "path";
import inquirer from "inquirer";

const emulatorPath = normalize(
  join(process.env.ANDROID_HOME, "/emulator/emulator")
);

function getEmulators() {
  const emulators = execFileSync(emulatorPath, ["-list-avds"], {
    encoding: "utf8",
  })
    .replace(/\n$/, "")
    .split("\n");

  return emulators.filter((e) => !!e);
}

async function main() {
  const emulators = getEmulators();

  const questions = [
    {
      type: "list",
      name: "emulator",
      message: "Which emulator do you want to start?",
      choices: emulators,
    },
  ];

  const answers = await inquirer.prompt(questions);

  console.log(chalk.green(`Starting emulator ${answers.emulator}`));

  const options = {};

  if (platform() === "win32") {
    options.shell = true;
  }

  const runOnEmulator = spawnSync(
    emulatorPath,
    ["-avd", answers.emulator],
    options
  );

  console.log(chalk.green(`Emulator ${answers.emulator} started`));

  console.log(chalk.yellow(runOnEmulator.stdout.toString()));

  if (runOnEmulator.stderr.toString()) {
    console.log(chalk.red(runOnEmulator.stderr.toString()));
  }

  process.exit(1);
}

main();
