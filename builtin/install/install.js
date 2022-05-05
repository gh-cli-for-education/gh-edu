import { config, updateJSON } from '../../config.cjs'
import shell from "shelljs";

/** @param plugin {string} */
export default function main(plugin) {
  const isFirstParty = !/.*\/gh-org.*/.test(plugin);
  let url = "";
  if (isFirstParty)
    url = "https://github.com/gh-cli-for-education/gh-edu-" + plugin;
  else
    url = "https://github.com/" + plugin;
  const output = shell.exec("gh extension install " + url);
  if (output.stderr) {
    return;
  }
  config.commands = {
    [plugin]: {},
    ...config.commands
  }
  updateJSON(config);
  console.log(`${plugin} installed`);
}
