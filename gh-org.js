import { program } from "commander"
import mainClone from './builtin/clone/main.js'
import cd from './builtin/cd/cd.js'
import pwd from './builtin/pwd/pwd.js'
import install from './builtin/install/install.js'
import update from './builtin/update/update.js'
program
  .command("clone")
  .description("Clone all the repos from one organization")
  .action(() => {
    mainClone();
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

program.parse();
