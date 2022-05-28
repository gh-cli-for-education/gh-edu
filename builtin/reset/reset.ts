import { config, updateJSON, configType } from '../../config.js'

interface optionsType {
  force: boolean
}

export default function reset(options: optionsType) {
  let newConfig: configType = {
    defaultOrg: "",
    cache: {
      orgs: {}
    },
    commands: {},
    identifierR: ""
  };
  if (!options.force && config.commands) {
    newConfig.commands = config.commands
  }
  updateJSON(newConfig);
  console.log("Done!!!");
}
