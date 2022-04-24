import { program } from "commander"
import mainClone from './builtin/clone/main.js'
program
  .command("clone")
  .description("Clone all the repos from one organization")
  .action(() => {
    mainClone();
  })
program
  .command("cd")
  .description("test")
  .action(() => {
    console.log("Hola")
  })
program
  .command("pwd")
  .description("test")
  .action(() => {
    console.log("Hola")
  })

program.parse();
