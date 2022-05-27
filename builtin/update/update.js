//@ts-check
import { allOrgNames } from '../../utils/constants/commands.js';
import { config, updateJSON } from '../../config.cjs'
import * as utils from "../../utils/utils.js"
import shell from "shelljs";
import chalk from 'chalk';

export function update(options) {
  const newConfig = updateLocalConfig(config, options);
  if (newConfig) {
    updateJSON(newConfig);
    console.log("Update successful");
    return;
  }
  console.log("Update: No option selected");
}

export function updateLocalConfig(config, options) {
  if (options.cache) {
    let allOrgs = utils.runCommand(allOrgNames, true).split("\n");
    allOrgs.pop();
    config.cache.orgs = {};
    for (const org of allOrgs) {
      let members = utils.getMembersFromOrg(org, true);
      config.cache.orgs[org] = {
        members,
      };
    }
    return config;
  }
  if (options.plugin) {
    console.log("Updating plugins");
    for (let command in config.commands) {
      command = config.commands[command].originalName.split('/')[1];
      utils.runCommand("gh extension upgrade " + command);
    }
    return config;
  }
}

const orgExists = (org) => `gh api --paginate /user/memberships/orgs/${org}`;
export function updateOneOrg(org, config) {
  let doesExists = shell.exec(orgExists(org), { silent: true });
  if (doesExists.code !== 0) {
    // console.error("That organization couldn't be found:\n" + newDefaultOrg);
    process.stderr.write(chalk.red(doesExists.stderr));
    return config;
  }
  let members = utils.getMembersFromOrg(org, true);
  config.cache.orgs[org] = {
    members,
  };
  return config;
}
