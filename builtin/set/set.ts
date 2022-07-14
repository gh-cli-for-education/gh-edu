import { config as cnf, updateJSON } from '../../config.js'
import * as utils from "../../utils/utils.js"
import { updateOneOrg } from "../update/update.js"

function selectOrg(newDefaultOrg?: string, config = cnf) {
  if (!newDefaultOrg) newDefaultOrg = utils.fetchOrgs();
  if (!(newDefaultOrg in config.cache.orgs)) {
    console.log("Not in cache. Fetching... (Cache will be updated)");
    config = updateOneOrg(newDefaultOrg, config);
    if (!(newDefaultOrg in config.cache.orgs)) { // Try again, now cache is updated
      return
    }
  }
  config.defaultOrg = newDefaultOrg;
  return config;
}

interface optionObject {
  org: boolean
  identifier: boolean
  assignment: boolean
  team: boolean
  quiet: boolean
}

export default function main(value: string | undefined, options: optionObject) {
  if (options.org) {
    const newConfig = selectOrg(value);
    if (!newConfig) return;
    updateJSON(newConfig);
  }
  if (options.identifier) {
    if (value === undefined) value = "";
    cnf.identifierR = value;
    updateJSON(cnf);
  }
  if (options.team) {
    if (value === undefined) value = "";
    cnf.teamR = value;
    updateJSON(cnf);
  }
  if (options.assignment) {
    if (value === undefined) value = "";
    cnf.assignmentR = value;
    updateJSON(cnf);
  }
}

