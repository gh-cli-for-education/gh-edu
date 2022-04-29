import { allOrgNames } from '../../utils/constants/commands.js';
import { config, updateJSON } from '../../config.cjs'
import * as utils from "../../utils/utils.js"

export default function main(options) {
  console.log("Updating"); // TODO Add animation
  if (options.cache) {
    let allOrgs = utils.runCommand(allOrgNames, true).split("\n"); // TODO it is need to create a method for this?
    allOrgs.pop();
    config.cache.orgs = {};
    for (const org of allOrgs) {
      config.cache.orgs[org] = {};
    }
  }
  updateJSON(config);
  console.log("Update successful");
}
