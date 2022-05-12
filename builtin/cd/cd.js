//@ts-check
import { config as cnf, updateJSON } from '../../config.cjs'
import * as utils from "../../utils/utils.js"
import { allOrgNames } from "../../utils/constants//commands.js"
import { updateLocalConfig } from "../update/update.js"

/** @param newDefaultOrg {string=} */
function selectOrg(newDefaultOrg, config = cnf) {
  console.log(newDefaultOrg);
  if (!newDefaultOrg) newDefaultOrg = utils.fetchOrgs();
  if (!(newDefaultOrg in config.cache.orgs)) {
    console.log("Not in cache. Fetching... (Cache will be updated)");
    config = updateLocalConfig(config, { cache: true });
    if (!(newDefaultOrg in config.cache.orgs)) { // Try again, now cache is updated
      console.error("That organization couldn't be found:\n" + newDefaultOrg);
      return
    }
  }
  config.defaultOrg = newDefaultOrg;
  return config;
}

/** @param newDefaultOrg {string=} */
export default function main(newDefaultOrg) {
  updateJSON(selectOrg(newDefaultOrg));
}

