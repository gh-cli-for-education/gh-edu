//@ts-check
import { config, updateJSON } from '../../config.cjs'
import * as utils from "../../utils/utils.js"

/** @param newDefaultOrg {string | undefined} */
export default function main(newDefaultOrg) {
  if (newDefaultOrg) {
    if (newDefaultOrg in config.cache.orgs) { // TODO Add autocompletion
      config.defaultOrg = newDefaultOrg;
    } else { // TODO Take the oportunity and Synchronize cache?
      console.log("Not in cache, Synchronizing...") // TODO Add animation? Improve message
      const result = utils.fetchOrgs(newDefaultOrg);
      if (!result) {
        console.error("That organization couldn't be found:\n" + newDefaultOrg);
        return
      }
      config.defaultOrg = result;
    }
  } else { // TODO add options for cache
    config.defaultOrg = utils.fetchOrgs();
  }
  updateJSON(config);
}

