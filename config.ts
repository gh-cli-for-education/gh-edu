import fs from 'fs'
/** _dirname doesnt work with modules */
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/***/

const configPath = __dirname + "/../config.json"

export interface configType {
  defaultOrg: string,
  cache: {
    orgs: {
      [x: string]: {
        members: string[]
      }
    }
  },
  commands: {
    [x: string]: {
      originalName: string
      lastCommit: string
    }
  },
  identifierR: string,
  assignment: string
}

export let config: configType;
if (!fs.existsSync(configPath)) {
  console.log("No config file detected");
  console.log("Creating new config...");
  fs.copyFileSync(__dirname + "/../utils/config.template.json", configPath, fs.constants.COPYFILE_EXCL);
}
config = JSON.parse(fs.readFileSync(configPath, {encoding: "utf8"}));

export const updateJSON = (content: configType) => {
  fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
}

