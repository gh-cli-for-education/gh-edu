import { config, updateJSON } from '../../config.cjs'

export default function reset(options) {
  let newConfig = {};
  newConfig.defaultOrg = "";
  newConfig.cache = {};
  newConfig.cache.orgs = {};
  if (options.force || !newConfig.commands) {
    newConfig.commands = {}; // Not a good idea to unistall this way
  } else {
    newConfig.commands = config.commands;
  }
  newConfig.identifierR = '';
  updateJSON(newConfig);
  console.log("Done!!!");
}
