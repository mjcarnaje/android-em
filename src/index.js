#!/usr/bin/env node
import chalk from "chalk";
import { execFileSync, spawnSync } from "child_process";
import inquirer from "inquirer";
import { platform } from "os";
import { join, normalize } from "path";

const EMULATOR_PATH = normalize(
  join(process.env.ANDROID_HOME, "/emulator/emulator")
);

function getEmulators() {
  const emulators = execFileSync(EMULATOR_PATH, ["-list-avds"], {
    encoding: "utf8",
  })
    .replace(/\n$/, "")
    .split("\n");

  return emulators.filter(Boolean);
}

async function main() {
  const emulators = getEmulators();

  if (emulators.length === 0) {
    console.log(chalk.red("No emulators found"));
    process.exit(1);
  }

  const questions = [
    {
      type: "list",
      name: "emulator",
      message: "Which emulator do you want to start?",
      choices: emulators,
    },
  ];

  const answers = await inquirer.prompt(questions);

  const cleanAnswers = answers.emulator.replace(/\n|\r|\W/g, "");

  console.log(chalk.green("====================================="));
  console.log(chalk.green(`Emulator ${cleanAnswers} is launched`));
  console.log(chalk.green("====================================="));

  const options = {};

  if (platform() === "win32") {
    options.shell = true;
  }

  const runOnEmulator = spawnSync(
    EMULATOR_PATH,
    ["-avd", answers.emulator],
    options
  );

  process.exit(0);
}

main();
