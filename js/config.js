import fs from 'fs';
import tmp from 'tmp';
/** _dirname doesnt work with modules */
import { fileURLToPath } from 'url';
import path from 'path';
import { runCommand, tryExecuteQuery } from './utils/utils.js';
import * as queries from './utils/constants/queries.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/***/
const configPath = __dirname + "/../config.json";
const repoName = "gh-edu-profile";
function fetchConfigFile() {
    const result = tryExecuteQuery(queries.identityRepo(repoName));
    if (!result) {
        console.log("No configuration file detected in remote");
        return false;
    }
    console.log("Remote config file detected");
    const tmpFile = tmp.dirSync();
    runCommand(`gh repo clone ${repoName} ${tmpFile.name}`, true);
    runCommand(`mv ${tmpFile.name}/config.json .`, true);
    console.log("Configuration file dowloaded");
    return true;
}
export let config;
if (!fs.existsSync(configPath)) {
    console.log("No configuration file detected");
    if (!fetchConfigFile()) {
        console.log("Creating new configuration file...");
        fs.copyFileSync(__dirname + "/../utils/config.template.json", configPath, fs.constants.COPYFILE_EXCL);
    }
}
config = JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }));
export const updateJSON = (content) => {
    fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
};
