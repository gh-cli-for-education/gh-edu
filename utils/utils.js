//@ts-check
import shell from "shelljs";
/** 
* @param command {string}
* @param silent {boolean=} [silent=false]
*/
export const runCommand = (command, silent) => {
  let shellString;
  if (silent)
    shellString = shell.exec(command, {silent: true});
  else
    shellString = shell.exec(command);
  return shellString.stdout;
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
