import { program } from "commander"
import clone from './builtin/clone/clone.js'
import cd from './builtin/cd/cd.js'
import pwd from './builtin/pwd/pwd.js'
import remove from './builtin/remove/remove.js'
import install from './builtin/install/install.js'
import update from './builtin/update/update.js'
import shell from "shelljs";
import { config } from './config.cjs'

/** _dirname doesnt work with modules */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/***/

if (!shell.which('git')) {
  console.error("Sorry, this extension requires git installed!");
  process.exit(1);
}
if (!shell.which('gh')) {
  console.error("Sorry, this extension requires gh installed!");
  process.exit(1);
}
if (!shell.which('fzf')) {
  // console.log("It's highly recommended you have fzf installed"); // TODO make fzf optional
  console.error("Sorry, this extension requires fzf installed!. For now...");
  process.exit(1);
}
const user = shell.exec("gh api user", { silent: true })
if (!user) { // TODO check the condition works
  console.error("Please log-in with gh");
  process.exit(1);
}

program
  .command("clone")
  .description("Clone all the repos you want from one organization")
  .option('-o --org <org>', 'Use as organization')
  .option('-q --quiet', 'Don\'t output any warning or information message')
  .action((options) => {
    if (config.defaultOrg === "" && !options.quiet) {
      console.log("No organization set as default");
    }
    clone(options.org || config.defaultOrg || undefined); // TODO do I need undefined here?
  })
program
  .command("cd")
  .arguments("[orgName]")
  .description("Set the default organization in the configuration")
  .action((orgName) => {
    cd(orgName);
  })
program
  .command("pwd")
  .description("Show the current default organization")
  .action(() => {
    pwd();
  })
program
  .command("install")
  .argument("<plug-in>", "Name of the plug-in you want to install")
  .description("Install plug-in") // TODO Improve help
  .action((plugin) => {
    install(plugin);
  })
program
  .command("update")
  .option("-c, --cache", "Update your cache")
  .description("Update your configuration")
  .action((options) => {
    update(options);
  })
program
  .command("remove")
  .argument("<plug-in...>", "Name[s] of the plug-in you want to remove")
  .action((plugin) => {
    remove(plugin);
  })

/** Add installed third party plugins */
let plugins = Object.keys(config.commands)
for (const plugin of plugins) {
  program
    .command(plugin)
    .action(() => {
      const shellString = shell.exec(__dirname + "/../gh-edu-" + plugin + "/gh-edu-" + plugin + "1> /dev/null 2> /dev/null");
      if (shellString.stdout)
        console.log(shellString.stdout);
      if (shellString.code == 127)
        console.error(plugin + " is not installed\nExecute gh edu install <plugin>");
    })
}

program.parse();
