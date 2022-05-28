import { config, updateJSON } from '../../config.js';
export default function reset(options) {
    let newConfig = {
        defaultOrg: "",
        cache: {
            orgs: {}
        },
        commands: {},
        identifierR: ""
    };
    if (!options.force && config.commands) {
        newConfig.commands = config.commands;
    }
    updateJSON(newConfig);
    console.log("Done!!!");
}
