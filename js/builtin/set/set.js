import { config as cnf, updateJSON } from '../../config.js';
import * as utils from "../../utils/utils.js";
import { updateOneOrg } from "../update/update.js";
function selectOrg(newDefaultOrg, config = cnf) {
    if (!newDefaultOrg)
        newDefaultOrg = utils.fetchOrgs();
    if (!(newDefaultOrg in config.cache.orgs)) {
        console.log("Not in cache. Fetching... (Cache will be updated)");
        config = updateOneOrg(newDefaultOrg, config);
        if (!(newDefaultOrg in config.cache.orgs)) { // Try again, now cache is updated
            return;
        }
    }
    config.defaultOrg = newDefaultOrg;
    return config;
}
export default function main(value, options) {
    if (options.org) {
        const newConfig = selectOrg(value); // TODO fix error
        if (!newConfig)
            return;
        updateJSON(newConfig);
        if (!options.quiet)
            console.log("Default org set to: ", newConfig.defaultOrg);
    }
    if (options.identifier) {
        if (value === undefined)
            value = "";
        cnf.identifierR = value;
        updateJSON(cnf);
        if (!options.quiet)
            console.log("New identifier regex set to: ", cnf.identifierR);
    }
    if (options.team) {
        if (value === undefined)
            value = "";
        cnf.teamR = value;
        updateJSON(cnf);
        if (!options.quiet)
            console.log("Current teamR set to: ", cnf.teamR);
    }
    if (options.assignment) {
        if (value === undefined)
            value = "";
        cnf.assignmentR = value;
        updateJSON(cnf);
        if (!options.quiet)
            console.log("Current assignment set to: ", cnf.assignmentR);
    }
}
