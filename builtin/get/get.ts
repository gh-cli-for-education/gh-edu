import { config } from '../../config.js'
import * as utils from '../../utils/utils.js'
import fs from 'fs';
import path from 'path';

/** _dirname doesnt work with modules */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/***/

// const builtinFilesPromise = fs.promises.readdir(__dirname + "/../");
const builtinFilesPromise = fs.promises.readdir(path.join(__dirname, ".."));

interface optionsType {
  members: Boolean,
  plugins: Boolean,
  organization: Boolean,
  configuration: Boolean,
  identifier: Boolean,
  assignment: Boolean,
  team: Boolean,
}

export default async function main(options: optionsType) {
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
    const builtinFiles = await builtinFilesPromise; // I don't check if it is a file or a directory
    if (builtinFiles.length > 0) {
      console.log("Builtin commands:");
      for (const builtinFile of builtinFiles) {
        console.log(builtinFile);
      }
    }
    if (Object.keys(config.commands).length > 0) {
      console.log("External commands:");
      console.log(JSON.stringify(config.commands, null, 2));
    }
  } else if (options.organization) {
    console.log(config.defaultOrg ? config.defaultOrg : "The organization is not set");
  } else if (options.configuration) {
    console.log(config)
  } else if (options.identifier) {
    console.log(config.defaultOrg ? config.defaultOrg : "The identifier regex is not set");
  } else if (options.assignment) {
    console.log(config.defaultOrg ? config.defaultOrg : "The assignment regex is not set");
  } else if (options.team) {
    console.log(config.defaultOrg ? config.defaultOrg : "The team regex is not set");
  } else {
    console.log("No option. Doing nothing");
  }
}
