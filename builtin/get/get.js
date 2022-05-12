import { config } from '../../config.cjs'
import * as utils from '../../utils/utils.js'

export default function main(options) {
  if (Object.keys(options).length > 1) {
    console.error("Get command only work with one option at a time");
    return;
  }

  if (options.members) {
    if (config.defaultOrg) {
      if (!config.cache.orgs[config.defaultOrg])
        throw "Internal Error. Your current organization is not in cache.";
      console.log(config.cache.orgs[config.defaultOrg].members);
    } else {
      console.log("No current organization configured");
      config.defaultOrg = utils.fetchOrgs();
    }

  } else if (options.plugins) {
    console.log(JSON.stringify(config.commands, null, 2));

  } else if (options.organization) {
    console.log(config.defaultOrg ? config.defaultOrg : "The organization is not set")
  }
}
