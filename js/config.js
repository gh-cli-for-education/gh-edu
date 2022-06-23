import fs from 'fs';
import tmp from 'tmp';
import { runCommand, tryExecuteQuery } from './utils/utils.js';
import * as queries from './utils/constants/queries.js';
import { remoteConfigName } from './utils/constants/constants.js';
/** _dirname doesnt work with modules */
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/***/
const configPath = __dirname + "/../config.json";
function fetchConfigFile() {
    const result = tryExecuteQuery(queries.identityRepo(remoteConfigName));
    if (!result) {
        console.log("No configuration file detected in remote");
        return false;
    }
    console.log("Remote config file detected");
    const tmpFile = tmp.dirSync();
    runCommand(`gh repo clone ${remoteConfigName} ${tmpFile.name}`, true);
    runCommand(`mv ${tmpFile.name}/config.json ${configPath}`, true);
    console.log("Configuration file dowloaded");
    return true;
}
export let config;
// call this funcion everytime you are going to call a command
function setConfig() {
    if (!fs.existsSync(configPath)) {
        console.log("No configuration file detected");
        if (!fetchConfigFile()) {
            console.log("Creating new configuration file...");
            fs.copyFileSync(__dirname + "/../utils/config.template.json", configPath, fs.constants.COPYFILE_EXCL);
        }
    }
    try { // Check the JSON configuration is valid
        config = JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }));
        validateConfig(config);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
function validateConfig(config) {
    if (!config.defaultOrg === undefined)
        throw "No defaultOrg field";
    if (!config.cache === undefined)
        throw "No cache field";
    if (!config.cache.orgs === undefined)
        throw "No orgs field in cache";
    for (const org in config.cache.orgs) {
        if (!Array.isArray(config.cache.orgs[org].members)) {
            throw "cache.orgs.<orgsName> must exists and be an array";
        }
    }
    if (!config.commands === undefined)
        throw "No commands field";
    for (const command in config.commands) {
        if (config.commands[command].originalName === undefined)
            throw "All commands must have an originalName";
        if (config.commands[command].lastCommit === undefined)
            throw "All commands must have a lastCommit field";
    }
    if (!config.assignment === undefined)
        throw "No assignment field";
    if (!config.identifierR === undefined)
        throw "No indentifierR field";
}
export const updateJSON = (content) => {
    fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
};
setConfig(); // main is run since the very moment this module is imported
