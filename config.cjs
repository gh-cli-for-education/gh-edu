const fs = require('fs')
const configPath = __dirname + "/config.json"
let config;
try {
  config = require(configPath) // TODO: https://github.com/tc39/proposal-json-modules
} catch (e) {
  if (!fs.existsSync("config.json")) {
    console.log("No config file detected");
    console.log("Creating new config...");
    fs.copyFileSync("./utils/config.template.json", "config.json", fs.constants.COPYFILE_EXCL);
    config = require(configPath) // TODO: https://github.com/tc39/proposal-json-modules
  } else {
    process.stderr.write(e);
  }
}

const updateJSON = (content) => {
  fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
}

module.exports = { config, updateJSON }
