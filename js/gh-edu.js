import { program } from "commander";
import clone from './builtin/clone/clone.js';
import set from './builtin/set/set.js';
import get from './builtin/get/get.js';
import remove from './builtin/remove/remove.js';
import install from './builtin/install/install.js';
import { update } from './builtin/update/update.js';
import reset from './builtin/reset/reset.js';
import shell from "shelljs";
import { config } from './config.js';
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
const user = shell.exec("gh api user", { silent: true });
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
});
program
    .command("set")
    .arguments("[value]")
    .option("-o, --org", "Set organization")
    .option("-i, --identifier", "Regex for the member identifier. Ex: alu[0-9]{10} for alu0101204512")
    .option("-a, --assignment", "Regex for the current assignment. Ex: turingMachine-* for turingMachine-alu0101204512")
    .option("-t, --team", "Regex to get information from team name. Ex: \"(?<name>.*?)\.(?<id>.*?)\.(?<login>.*[^\s*])\"")
    .option("-q --quit", "Don't show any log or warning information. The result will be printed anyway")
    .description("Set some values in the configuration file")
    .action((value, config) => {
    set(value, config);
});
program
    .command("get")
    .description("Show the current default organization")
    .option("-m, --members", "List community members")
    .option("-p, --plugins", "List the installed plugins")
    .option("-o, --organization", "Return the current organization")
    .option("-c, --configuration", "Return the loaded configuration")
    .action((options) => {
    get(options);
});
program
    .command("install")
    .argument("<plug-in>", "Name of the plug-in you want to install")
    .description("Install plug-in") // TODO Improve help
    .action((plugin) => {
    install(plugin);
});
program
    .command("update")
    .option("-c, --cache", "Update your cache")
    .option("-p, --plugin", "Update plugins")
    .option("-f, --fetch", "Update configuration file in remote")
    .option("-r, --remote", "Update local configuration file")
    .description("Update your configuration")
    .action((options) => {
    update(options);
});
program
    .command("remove")
    .argument("<plug-in...>", "Name[s] of the plugin you want to remove")
    .action((plugin) => {
    remove(plugin);
});
program
    .command("reset")
    .option("-f, --force", "Reset everything, even installed commands. Only use if you are certain")
    .description("Set config in default state, installed commands are ignored\n" +
    "If you are calling this command because of some error in the configuration, please open a issue")
    .action((options) => {
    reset(options);
});
/** Add installed third party plugins */
for (const plugin of Object.keys((config.commands))) {
    program
        .command(plugin)
        .allowUnknownOption(true)
        .helpOption(false)
        .action((_, commandObj) => {
        const { code } = shell.exec(`gh extension exec edu-${plugin} ${commandObj.args}`, { silent: false });
        if (code != 0) {
            if (code == 127) // doesn't found the binary
                console.error(`${plugin} is not installed\nPlease use gh edu remove command to remove plugins, or install it again`);
        }
    });
}
program.parse();
