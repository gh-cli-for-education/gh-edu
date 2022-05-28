import { config, updateJSON } from '../../config.js'
import shell from "shelljs";

export default function main(plugins: string[]) {
  const removePlugin = (plugin: string) => {
    if (!(plugin in config.commands)) {
      console.error(`${plugin} plugin is not installed`)
      return;
    }
    const output = shell.exec("gh extension remove " + config.commands[plugin].originalName.replace("*./", ""));
    if (output.stderr) {
      return;
    }
    delete config.commands[plugin];
    console.log(`${plugin} removed`);
  };

  for (const plugin of plugins) {
    removePlugin(plugin);
  }

  updateJSON(config);
}
