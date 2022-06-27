import fs from 'fs';
import pkg from 'shelljs';
const { mkdir } = pkg;
import { runCommand, tryExecuteQuery } from './utils/utils.js';
import * as queries from './utils/constants/queries.js';
import { configName, remoteConfigName } from './utils/constants/constants.js';
/** _dirname doesnt work with modules */
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
// Root path
const jsRoot = path.dirname(__filename);
const tsRoot = path.join(jsRoot, "..");
/***/
const configPath = path.join(tsRoot, "data", configName);
function fetchConfigFile() {
    const result = tryExecuteQuery(queries.identityRepo(remoteConfigName));
    if (!result[1]) {
        console.log("No configuration file detected in remote");
        return false;
    }
    console.log("Remote config file detected");
    runCommand(`gh repo clone ${remoteConfigName} ${tsRoot}/data`, true);
    console.log("Configuration file dowloaded");
    return true;
}
export let config;
function setConfig() {
    if (!fs.existsSync(configPath)) {
        console.log("No configuration file detected");
        if (!fetchConfigFile()) {
            console.log("Creating new configuration file...");
            mkdir('-p', `${tsRoot}/data`);
            runCommand("git init data", true);
            fs.copyFileSync(path.join(tsRoot, "utils", "data.template.json"), configPath, fs.constants.COPYFILE_EXCL);
        }
    } // Now there is a config/data.json
    try { // Check the JSON configuration is valid
        config = JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }));
        validateConfig(config);
    }
    catch (e) {
        console.error("Error with the configuration file:\n", e);
        process.exit(1);
    }
}
function validateConfig(config) {
    if (config.defaultOrg === undefined)
        throw "No defaultOrg field";
    if (config.cache === undefined)
        throw "No cache field";
    if (config.cache.orgs === undefined)
        throw "No orgs field in cache";
    for (const org in config.cache.orgs) {
        if (!Array.isArray(config.cache.orgs[org].members)) {
            throw "cache.orgs.<orgsName> must exists and be an array";
        }
    }
    if (config.commands === undefined)
        throw "No commands field";
    for (const command in config.commands) {
        if (config.commands[command].originalName === undefined)
            throw "All commands must have an originalName";
        if (config.commands[command].lastCommit === undefined)
            throw "All commands must have a lastCommit field";
    }
    if (config.assignmentR === undefined)
        throw "No assignmentR field";
    if (config.teamR === undefined)
        throw "No teamR field";
    if (config.identifierR === undefined)
        throw "No indentifierR field";
}
export const updateJSON = (content) => {
    fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
};
setConfig(); // setConfig is run since the very moment this module is imported
