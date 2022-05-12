//@ts-check
import { config as cnf, updateJSON } from '../../config.cjs'
import * as utils from "../../utils/utils.js"
import { updateLocalConfig } from "../update/update.js"

/** @param newDefaultOrg {string=} */
function selectOrg(newDefaultOrg, config = cnf) {
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

export default function main(value, options) {
  if (options.org) {
    const newConfig = selectOrg(value);
    if (!newConfig) return;
    updateJSON(newConfig);
    if (!options.quiet) console.log("Default org set to: ", newConfig.defaultOrg);
  }
  if (options.identifier) {
    if (value === undefined) value = "";
    cnf.identifierR = value;
    updateJSON(cnf);
  }
}

