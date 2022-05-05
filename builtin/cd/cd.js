//@ts-check
import { config, updateJSON } from '../../config.cjs'
import * as utils from "../../utils/utils.js"
import { allOrgNames } from "../../utils/constants//commands.js"
import update from "../update/update.js"

/** @param newDefaultOrg {string=} */
export default function main(newDefaultOrg) {
  if (!newDefaultOrg) {
    config.defaultOrg = utils.fetchOrgs();
  } else {
    if (!(newDefaultOrg in config.cache.orgs)) {
      console.log("Requesting organizations info") // TODO Add animation?
      // const result = utils.fetchOrgs(newDefaultOrg);
      update({ cache: true });
      if (!(newDefaultOrg in config.cache.orgs)) { // Try again, now cache is updated
        console.error("That organization couldn't be found:\n" + newDefaultOrg);
        return
      }
    }
    config.defaultOrg = newDefaultOrg;
  }
  updateJSON(config);
}

