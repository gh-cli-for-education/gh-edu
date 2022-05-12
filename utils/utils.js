//@ts-check
import shell from "shelljs";
import { chooseOrgName, allOrgNames } from "./constants/commands.js"
/** 
* @param command {string}
* @param silent {boolean} [silent=false]
*/
export const runCommand = (command, silent = false) => {
  const result = shell.exec(command, { silent });
  if (silent && result.code != 0) {
    console.error("Internal error: runCommand: ", command);
    process.stderr.write(result.stderr);
  }
  return result.stdout;
};

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
export const getMembersFromOrg = (org, silent = false) => {
  let members = executeQuery(usersFromOrgQuery(org), "--jq '.data.organization.membersWithRole.nodes[].login'").split("\n");
  members.pop();
  return members
}

/** @param query {string}*/
export const executeQuery = (query, ...options) => {
  let command = `gh api graphql --paginate ${options} -f query='${query}'`;
  let queryResult = shell.exec(command, { silent: true });
  if (queryResult.code !== 0) {
    console.error("Internal error: executeQuery.");
    console.error("command: ", command);
    process.stderr.write(queryResult.stderr);
    process.exit(1);
  }
  return queryResult.stdout;
};

/** @param repoNames {string[]}*/
export const names2url = (repoNames) => {
  let urls = repoNames.map(repoName => runCommand("gh browse -n --repo " + repoName));
  return urls.map(u => u.replace(/\s*$/, '.git')); // TODO find a way to replace "\n" to "" earlier, avoid this line
};

/** @param reposNames {string[]} 
  * @param org {string}
  * */
export const prefixOrg = (reposNames, org) => {
  return reposNames.map(repoName => org + '/' + repoName);
};

/**
 * @param name {string=}
*   @returns {string | undefined}
 * */
export const fetchOrgs = (name) => {
  if (!name) {
    return runCommand(chooseOrgName).trim(); // Delete "/n" at the end
  }
  const allOrgs = runCommand(allOrgNames, true).split("\n");
  allOrgs.pop();
  return allOrgs.find(orgName => orgName == name);
}

export const isFirstParty = plugin => !(/.*\/.*/.test(plugin));
