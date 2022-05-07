//@ts-check
import shell from "shelljs";
import { chooseOrgName, allOrgNames} from "./constants/commands.js"
/** 
* @param command {string}
* @param silent {boolean} [silent=false]
*/
export const runCommand = (command, silent=false) => {
  return shell.exec(command, {silent}).stdout;
};

/** @param query {string}*/
export const executeQuery = (query) => {
  let command = `gh api graphql --paginate -f query='${query}'`;
  let queryResult = shell.exec(command, { silent: true });
  if (queryResult.code !== 0 || queryResult.length === 0) {
    console.error("No repos found in org")
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
