import { config as cnf, updateJSON } from '../../config.js';
import * as utils from "../../utils/utils.js";
import { updateOneOrg } from "../update/update.js";
function selectOrg(newDefaultOrg, config = cnf) {
    if (!newDefaultOrg)
        newDefaultOrg = utils.fetchOrgs();
    // console.log(JSON.stringify(newDefaultOrg));
    if (newDefaultOrg) {
        if (!(newDefaultOrg in config.cache.orgs)) {
            console.log("Not in cache. Fetching... (Cache will be updated)");
            config = updateOneOrg(newDefaultOrg, config);
            if (!(newDefaultOrg in config.cache.orgs)) { // Try again, now cache is updated
                return;
            }
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
    }
    if (options.identifier) {
        if (value === undefined)
            value = "";
        cnf.identifierR = value;
        updateJSON(cnf);
    }
    if (options.team) {
        if (value === undefined)
            value = "";
        cnf.teamR = value;
        updateJSON(cnf);
    }
    if (options.assignment) {
        if (value === undefined)
            value = "";
        cnf.assignmentR = value;
        updateJSON(cnf);
    }
}
//# sourceMappingURL=set.js.map