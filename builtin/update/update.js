//@ts-check
import { allOrgNames } from '../../utils/constants/commands.js';
import { config, updateJSON } from '../../config.cjs'
import * as utils from "../../utils/utils.js"

export function update(options) {
  console.log("Updating organization info in cache");
  updateJSON(updateLocalConfig(config, options));
  console.log("Update successful");
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
  }
  return config;
}
