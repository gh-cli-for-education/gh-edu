import { config, updateJSON } from '../../config.js';
export default function reset(options) {
    let newConfig = {
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
        newConfig.commands = config.commands;
    }
    updateJSON(newConfig);
}
