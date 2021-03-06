import fs from 'fs';
import pkg from 'shelljs';
import chalk from 'chalk';
import path from 'path';
const { mkdir } = pkg;
import { runCommand, tryExecuteQuery, tsRoot, isValidRegex } from './utils/utils.js';
import * as queries from './utils/constants/queries.js';
import { configDir, configPath, remoteConfigName } from './utils/constants/constants.js';
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
    if (!fs.existsSync(configDir)) {
        console.log("No configuration file detected");
        if (!fetchConfigFile()) {
            console.log("Creating new configuration file...");
            mkdir('-p', `${configDir}`);
            // mkdir('-p', `${tsRoot}/data`);
            runCommand(`git init ${configDir}`, true);
            fs.copyFileSync(path.join(tsRoot, "utils", "data.template.json"), configPath, fs.constants.COPYFILE_EXCL);
        }
    } // Now there is a data.json
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
    if (!isValidRegex(config.assignmentR))
        throw `assignmentR. ${config.assignmentR} is not a valid regex`;
    if (config.teamR === undefined)
        throw "No teamR field";
    if (!isValidRegex(config.teamR))
        throw `teamR. ${config.teamR} is not a valid regex`;
    if (config.identifierR === undefined)
        throw "No indentifierR field";
    if (!isValidRegex(config.identifierR))
        throw `identifierR. ${config.identifierR} is not a valid regex`;
    if (!config.version) {
        config.version = JSON.parse(fs.readFileSync(path.join("utils", "data.template.json"), { encoding: "utf-8" })).version;
        console.log(chalk.yellow(`No version in this data file\nSetting version found in template: v${config.version}`));
        updateJSON(config);
    }
}
export const updateJSON = (content) => {
    fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
};
setConfig(); // setConfig is run since the very moment this module is imported
