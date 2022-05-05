import { config, updateJSON } from '../../config.cjs'
import shell from "shelljs";

/** @param plugins {string[]} */
export default function main(plugins) {
  const removePlugin = (plugin) => {
    if (!(plugin in config.commands)) {
      console.error(`${plugin} plugin is not installed`)
      return;
    }
    const output = shell.exec("gh extension remove gh-edu-" + plugin);
    if (output.stderr) {
      return;
    }
    console.log(`${plugin} removed`);
  };

  for (const plugin of plugins) {
    removePlugin(plugin);
  }

  updateJSON(config);
}
