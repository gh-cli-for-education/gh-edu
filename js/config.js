import fs from 'fs';
const configPath = process.cwd() + "/config.json";
export let config;
if (!fs.existsSync("config.json")) {
    console.log("No config file detected");
    console.log("Creating new config...");
    fs.copyFileSync("./utils/config.template.json", "config.json", fs.constants.COPYFILE_EXCL);
}
config = JSON.parse(fs.readFileSync("config.json", { encoding: "utf8" }));
export const updateJSON = (content) => {
    fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
};
