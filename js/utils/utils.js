import shell from "shelljs";
import { chooseOrgName } from "./constants/commands.js";
export const runCommand = (command, silent = false) => {
    const result = shell.exec(command, { silent });
    if (silent && result.code != 0) {
        console.error("Internal error: runCommand: ", command);
        process.stderr.write(result.stderr);
    }
    return result.stdout;
};
export const beautify = (json) => JSON.stringify(JSON.parse(json), null, 2);
const usersFromOrgQuery = (org) => `
query ($endCursor: String) {
  organization(login: "${org}") {
    membersWithRole(first: 60, after: $endCursor) {
      pageInfo {
        endCursor
        hasNextPage
      },
      nodes {
          login
      }
    }
  }
}
`;
export const getMembersFromOrg = (org) => {
    let members = executeQuery(usersFromOrgQuery(org), "--jq '.data.organization.membersWithRole.nodes[].login'").split("\n");
    members.pop();
    return members;
};
export const executeQuery = (query, ...options) => {
    let command = `gh api graphql --paginate ${options} -f query='${query}'`;
    let queryResult = shell.exec(command, { silent: true });
    if (queryResult.code !== 0) {
        let message = "Internal error: executeQuery\ncommand:\n";
        message += queryResult.stderr;
        // console.error("Internal error: executeQuery.");
        // console.error("command: ", command);
        // process.stderr.write(queryResult.stderr);
        // process.exit(1);
        throw message;
    }
    return queryResult.stdout;
};
/*
* tryExecuteQuery is like executeQuery but it also returns true if it was successful or false otherwise
* */
export const tryExecuteQuery = (query, debug = false, ...options) => {
    try {
        const result = executeQuery(query, ...options);
        if (debug)
            console.log(result);
        return [result, true];
    }
    catch (e) {
        if (debug)
            console.error(e);
        return ["", false];
    }
};
export const names2url = (repoNames) => {
    let urls = repoNames.map(repoName => runCommand("gh browse -n --repo " + repoName));
    return urls.map(u => u.replace(/\s*$/, '.git')); // TODO find a way to replace "\n" to "" earlier, avoid this line
};
export const prefixOrg = (reposNames, org) => {
    return reposNames.map(repoName => org + '/' + repoName);
};
// export const fetchOrgs = (name?: string): string | undefined => {
//   if (!name) {
//     return runCommand(chooseOrgName).trim(); // Delete "/n" at the end
//   }
//   const allOrgs = runCommand(allOrgNames, true).split("\n");
//   allOrgs.pop();
//   return allOrgs.find(orgName => orgName === name);
// }
export const isObjEmpty = (obj) => {
    // https://stackoverflow.com/a/32108184/13059089
    // because Object.keys(new Date()).length === 0;
    // we have to do some additional check
    return obj // 👈 null and undefined check
        && Object.keys(obj).length === 0
        && Object.getPrototypeOf(obj) === Object.prototype;
};
export const fetchOrgs = () => {
    return runCommand(chooseOrgName).trim();
};
export const isFirstParty = (plugin) => !(/.*\/.*/.test(plugin));
//# sourceMappingURL=utils.js.map