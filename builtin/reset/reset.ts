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
    identifierR: "",
    assignmentR: "",
    teamR: "",
    version: config.version,
  };
  if (!options.force) {
    newConfig.commands = config.commands
  }
  updateJSON(newConfig);
}
