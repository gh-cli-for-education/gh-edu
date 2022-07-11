import { config } from '../../config.js';
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
export default async function main(options) {
    if (Object.keys(options).length > 1) {
        console.error("Get command only work with one option at a time");
        return;
    }
    if (options.members) {
        if (config.defaultOrg) {
            if (!config.cache.orgs[config.defaultOrg])
                throw "Internal Error. Your current organization is not in cache.";
            console.log(config.cache.orgs[config.defaultOrg].members);
        }
        else {
            console.log("No current organization configured. Run 'gh edu set -o' to set one");
            //config.defaultOrg = utils.fetchOrgs();
        }
    }
    else if (options.plugins) {
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
    }
    else if (options.org) {
        console.log(config.defaultOrg ? config.defaultOrg : "No current organization configured. Run 'gh edu set -o' to set one");
    }
    else if (options.configuration) {
        console.log(JSON.stringify(config, null, 2));
    }
    else if (options.identifier) {
        console.log(config.identifierR ? config.identifierR : "The identifier regex is not set");
    }
    else if (options.assignment) {
        console.log(config.assignmentR ? config.assignmentR : "The assignment regex is not set");
    }
    else if (options.team) {
        console.log(config.teamR ? config.teamR : "The team regex is not set");
    }
    else if (options.version) {
        console.log(config.version ? config.version : "The version is not set!!!. This is a fatal error");
    }
    else {
        console.log("No option. Doing nothing");
    }
}
//# sourceMappingURL=get.js.map