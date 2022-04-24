import { program } from "commander"
import main from "./main.js"
program
  .command("clone")
  .description("Clone all the repos from one organization")
  .action(() => {
    main();
  })

program.parse();
