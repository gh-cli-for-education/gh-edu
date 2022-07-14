import { allOrgNames } from '../../utils/constants/commands.js';
import { configName, configPath, remoteConfigName } from '../../utils/constants/constants.js'
import { config, updateJSON, configType } from '../../config.js'
import * as utils from "../../utils/utils.js"
import * as queries from "../../utils/constants/queries.js"
import shell from "shelljs";
import chalk from 'chalk';
import inquirer from 'inquirer';
import tmp from 'tmp';
import fs from 'fs';
import path from 'path';

interface optionType {
  cache: boolean,
  plugin: string | boolean,
  remote: boolean,
}

export async function update(options: optionType) {
  if (utils.isObjEmpty(options)) {
    utils.runCommand("gh extension upgrade gh-edu");
    const version = JSON.parse(fs.readFileSync(path.join(utils.tsRoot, "utils", "data.template.json"), { encoding: "utf-8" })).version;
    config.version = version;
    updateJSON(config);
    return;
  }
  const newConfig = await updateLocalConfig(config, options);
  if (newConfig) {
    updateJSON(newConfig);
    // console.log("Update successful");
    return;
  }
  console.log("update: no update has been made");
}

export async function updateLocalConfig(config: configType, options: optionType) {
  if (options.cache) {
    let allOrgs = utils.runCommand(allOrgNames, true).split("\n");
    allOrgs.pop();
    config.cache.orgs = {};
    for (const org of allOrgs) {
      let members = utils.getMembersFromOrg(org);
      config.cache.orgs[org] = {
        members,
      };
    }
  }
  if (options.plugin) {
    if (typeof options.plugin == "string") {
      updatePlugin(config, options.plugin)
    } else if (Array.isArray(options.plugin)) {
      options.plugin
      for (const plugin of (options.plugin as string[])) {
        updatePlugin(config, plugin)
      }
    } else {
      for (const command in config.commands) {
        updatePlugin(config, command)
      }
    }
  }
  if (options.remote) {
    await updateRemoteConfig();
  }
  return config;
}

function updatePlugin(config: configType, command: string) {
  // let name = config.commands[command].originalName.split('/')[1];
  if (!config.commands[command]) {
    console.error(chalk.red(`${command} is not installed`));
    return;
  }
  let result = shell.exec("gh extension upgrade edu-" + command, { silent: true });
  // console.log("stdout", result.stdout);
  // console.log("stderr", result.stderr);
  // if (result.stdout === "" && result.stderr === "") {
  //   console.log(command, "already up to date");
  // }
  if (result.code !== 0) {
    process.stderr.write(chalk.red(result.stderr.replaceAll("edu-", "")));
    return
  }
  const origin = config.commands[command].originalName;
  let lastCommit = shell.exec(`gh api /repos/${origin}/commits/main`, { silent: true }); // TODO I need to make sure which one I have updated
  if (lastCommit.code !== 0) {
    lastCommit = shell.exec(`gh api /repos/${origin}/commits/master`, { silent: true });
    if (lastCommit.code !== 0) {
      console.log(chalk.yellow("No main or master branch. Last commit info couldn't be retrieved"));
    }
  }
  config.commands[command].lastCommit = JSON.parse(lastCommit).sha?.substring(0, 8);
}

async function updateRemoteConfig() {
  const getRemoteRepo = () => {
    return utils.tryExecuteQuery(queries.identityRepo(remoteConfigName), false, queries.identityRepoFilter)
  }
  let [url, ok] = getRemoteRepo();
  if (!ok) {
    console.log("No configuration file detected in remote");
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Create (private) repository?',
        default: true,
      }
    ]).then(({ confirmation }) => {
      if (!confirmation) {
        console.log("Configuration couldn't be updated")
        return
      }
      utils.runCommand(`gh repo create ${remoteConfigName} --private -d "Configuration file for the gh-edu ecosystem"`);
      [url, ok] = getRemoteRepo();
      if (!ok) {
        console.log(chalk.red(`error: repository ${remoteConfigName} could not be created`));
        return;
      }
      console.log(`Repository ${remoteConfigName} created`)
    })
  }
  const tmpDir = tmp.dirSync()
  utils.runCommand(`git init ${tmpDir.name}`, true)
  shell.cp(configPath, tmpDir.name);
  utils.runCommand(`git -C ${tmpDir.name} add ${configName}`, true)
  utils.runCommand(`git -C ${tmpDir.name} commit -a -m "Update from gh-edu-system"`, true)
  utils.runCommand(`git -C ${tmpDir.name} push -f ${url}`, true)
}

const orgExists = (org: string) => `gh api --paginate /user/memberships/orgs/${org}`;
export function updateOneOrg(org: string, config: configType) {
  let doesExists = shell.exec(orgExists(org), { silent: true });
  if (doesExists.code !== 0) {
    // console.error("That organization couldn't be found:\n" + newDefaultOrg);
    process.stderr.write(chalk.red(doesExists.stderr));
    return config;
  }
  let members = utils.getMembersFromOrg(org);
  config.cache.orgs[org] = {
    members,
  };
  return config;
}

