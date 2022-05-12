import { config, updateJSON } from '../../config.cjs'

export default function reset(options) {
  config.defaultOrg = "";
  config.cache.orgs = {};
  if (options.force) {
    config.commands = {}; // Not a good idea to unistall this way
  }
  updateJSON(config);
  console.log("Done!!!");
}
