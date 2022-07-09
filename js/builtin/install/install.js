import { config, updateJSON } from '../../config.js';
import shell from "shelljs";
import fs from 'fs';
import * as utils from '../../utils/utils.js';
/** _dirname doesnt work with modules */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/***/
const builtinFilesPromise = fs.promises.readdir(__dirname + "/../");
async function check(plugin) {
    const commands = config.commands;
    const builtinFiles = await builtinFilesPromise; // I don't check if it is a file or a directory
    for (const command in commands) {
        const originalName = commands[command].originalName;
        if (originalName === plugin || builtinFiles.includes(plugin)) {
            console.error(`${plugin} is already installed`);
            return true;
        }
    }
    return false;
}
export default async function main(plugin, isQuiet) {
    if (await check(plugin))
        return;
    if (utils.isFirstParty(plugin))
        plugin = "gh-cli-for-education/gh-edu-" + plugin;
    const url = "https://github.com/" + plugin;
    let installedName = plugin.replace(/.*\//, "").replace("gh-", "").replace("edu-", "");
    const builtinFiles = await builtinFilesPromise; // I don't check if it is a file or a directory
    while (installedName in config.commands || builtinFiles.includes(installedName)) {
        console.error(chalk.red("there is already a with that name: ", installedName));
        process.exit(1);
    }
    utils.print(isQuiet, `Installing ${plugin} ...`);
    let { stderr, code } = shell.exec("gh extension install " + url, { silent: true });
    if (code !== 0) {
        process.stderr.write(stderr.replaceAll("edu-", ""));
        return;
    }
    utils.print(isQuiet, "Plugin installed in system");
    utils.print(isQuiet, "Setting up configuration...");
    const org = plugin.split('/', 1)[0];
    const defaultOrg = utils.runCommand(`gh api /repos/${org}/gh-edu-${installedName} | jq .default_branch`, true);
    const lastCommit = shell.exec(`gh api /repos/${plugin}/commits/${defaultOrg}`, { silent: true });
    if (lastCommit.code !== 0) {
        console.error(chalk.red("Couldn't get default branch for . Skipping last commit info"));
    }
    config.commands = {
        [installedName]: { originalName: plugin, lastCommit: JSON.parse(lastCommit).sha?.substring(0, 8) },
        ...config.commands
    };
    updateJSON(config);
    // console.log(`${plugin} installed as ${installedName}`);
}
//# sourceMappingURL=install.js.map