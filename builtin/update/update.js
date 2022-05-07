//@ts-check
import { allOrgNames } from '../../utils/constants/commands.js';
import { config, updateJSON } from '../../config.cjs'
import * as utils from "../../utils/utils.js"

/** TODO Add more update options */
export default function main(options) {
  console.log("Updating organization info in cache");
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
  updateJSON(config);
  console.log("Update successful");
}
