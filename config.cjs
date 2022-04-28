const fs = require('fs')
const configPath = "./config.json"
const config = require(configPath)

const updateJSON = (content) => {
  fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
}

module.exports = { config, updateJSON }