//@ts-check
// This file needs to be heavily tested
import { config, updateJSON } from '../../config.cjs'
import shell from "shelljs";
import inquirer from 'inquirer';
import fs from 'fs';
import * as utils from '../../utils/utils.js'

/** _dirname doesnt work with modules */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/***/

const builtinFilesPromise = fs.promises.readdir(__dirname + "/../");

/** @param plugin {string} */
async function check (plugin) {
  const commands = config.commands;
  const builtinFiles = await builtinFilesPromise; // I don't check if it is a file or a directory
  for (const command in commands) {
    const originalName = commands[command].originalName;
    if (originalName === plugin || builtinFiles.includes(plugin)) {
      console.error(`${plugin} is already installed`);
      return true;
    }
  }
  return false;
}

/** @param plugin {string} */
export default async function main(plugin) {
  if (await check(plugin))
    return;
  if (utils.isFirstParty(plugin)) {
    plugin = "gh-cli-for-education/gh-edu-" + plugin;
  }
  const url = "https://github.com/" + plugin;
  let installedName = plugin.replace(/.*\//, "").replace("gh-", "").replace("edu-", "");
  const builtinFiles = await builtinFilesPromise; // I don't check if it is a file or a directory
  while (installedName in config.commands || builtinFiles.includes(installedName) ) {
    console.log("There is already a plugin with that name: ", installedName);
    await inquirer.prompt([
      {
        type: 'input',
        name: 'alias',
        message: "Write an alias"
      }
    ]).then((answers) => {
      installedName = answers.alias;
    })
  }
  console.log(`Installing ${plugin} ...`)
  let { stderr, code } = shell.exec("gh extension install " + url, { silent: true });
  if (code != 0) {
    process.stderr.write(stderr.replaceAll(`edu-${installedName}`, installedName));
    return;
  }
  config.commands = {
    [installedName]: {originalName: plugin},
    ...config.commands
  }
  updateJSON(config);
  console.log(`${plugin} installed as ${installedName}`);
}
