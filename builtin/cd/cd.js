import { config, updateJSON } from '../../config.cjs'
import * as utils from "../../utils/utils.js"
import { chooseOrgName, allOrgNames } from "../../utils/constants/commands.js"

/** @param newDefaultOrg {string | undefined} */
export default function main(newDefaultOrg) {
  if (newDefaultOrg) {
    if (newDefaultOrg in config.cache.orgs) { // TODO Add autocompletion
      config.defaultOrg = newDefaultOrg;
    } else { // TODO Take the oportunity and Synchronize cache?
      console.log("Not in cache, Synchronizing...") // TODO Add animation?
      const result = fetchOrgs(newDefaultOrg);
      if (!result) {
        console.error("That organization couldn't be found:\n" + newDefaultOrg);
        return
      }
      config.defaultOrg = result;
    }
  } else {
    config.defaultOrg = fetchOrgs();
  }
  updateJSON(config);
}

const fetchOrgs = (name) => {
  if (!name) {
    return utils.runCommand(chooseOrgName).trim(); // Delete "/n" at the end
  }
  const allOrgs = utils.runCommand(allOrgNames, true).split("\n");
  allOrgs.pop();
  return allOrgs.find(orgName => orgName == name);
}
