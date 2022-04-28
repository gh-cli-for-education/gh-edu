import { program } from "commander"
import mainClone from './builtin/clone/main.js'
import cd from './builtin/cd/cd.js'
import pwd from './builtin/pwd/pwd.js'
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

program.parse();
