import { allOrgNames } from '../../utils/constants/commands.js';
import { configName, remoteConfigName } from '../../utils/constants/constants.js'
import { config, updateJSON, configType } from '../../config.js'
import * as utils from "../../utils/utils.js"
import * as queries from "../../utils/constants/queries.js"
import shell from "shelljs";
import chalk from 'chalk';
import inquirer from 'inquirer';
import tmp from 'tmp';

interface optionType {
  cache: boolean,
  plugin: boolean,
  fetch: boolean,
  remote: boolean,
}

export async function update(options: optionType) {
  const newConfig = await updateLocalConfig(config, options);
  if (newConfig) {
    updateJSON(newConfig);
    // console.log("Update successful");
    return;
  }
  console.log("Update: No option selected");
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
    console.log("Updating plugins");
    for (const command in config.commands) {
      let name = config.commands[command].originalName.split('/')[1];
      let result = shell.exec("gh extension upgrade " + name, { silent: true }); // TODO Also install plugins from config
      if (result.stdout === "" && result.stderr === "") { // TODO test if this work when a plugin is upgraded
        console.log(command, "already up to date");
      } else if (result.code !== 0) {
        process.stderr.write(result.stderr);
      } else {
        const lastCommit = result.stdout.match(/[0-9a-f]{5,40}$/);
        if (lastCommit) {
          config.commands[command].lastCommit = lastCommit[0];
        } else {
          console.error(chalk.red("commit hash couldn't be determinated"))
          config.commands[command].lastCommit = "";
        }
      }
    }
  }
  if (options.remote) {
    await updateRemoteConfig();
  }
  if (options.fetch) {
    console.log("options fetch");
  }
  return config;
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
  shell.cp(configName, tmpDir.name);
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
