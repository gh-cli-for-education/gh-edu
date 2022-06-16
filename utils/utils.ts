import shell from "shelljs";
import { chooseOrgName } from "./constants/commands.js"

export const runCommand = (command: string, silent = false) => {
  const result = shell.exec(command, { silent });
  if (silent && result.code != 0) {
    console.error("Internal error: runCommand: ", command);
    process.stderr.write(result.stderr);
  }
  return result.stdout;
};

export const beautify = (json: any) => JSON.stringify(JSON.parse(json), null, 2)

const usersFromOrgQuery = (org: string) => `
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

export const getMembersFromOrg = (org: string) => {
  let members = executeQuery(usersFromOrgQuery(org), "--jq '.data.organization.membersWithRole.nodes[].login'").split("\n");
  members.pop();
  return members
}

export const executeQuery = (query: string, ...options: string[]) => {
  let command = `gh api graphql --paginate ${options} -f query='${query}'`;
  let queryResult = shell.exec(command, { silent: true });
  if (queryResult.code !== 0) {
    let message = "Internal error: executeQuery\ncommand:\n"
    message += queryResult.stderr
    // console.error("Internal error: executeQuery.");
    // console.error("command: ", command);
    // process.stderr.write(queryResult.stderr);
    // process.exit(1);
    throw message
  }
  return queryResult.stdout;
};

/*
* tryExecuteQuery is like executeQuery but it also returns true if it was successful or false otherwise
* */
export const tryExecuteQuery = (query: string, debug = false, ...options: string[]): [any, boolean] => {
  try {
    const result = executeQuery(query, ...options)
    if (debug) console.log(result)
    return [result, true]
  } catch(e) {
    if (debug) console.error(e)
    return [{}, false]
  }
}

export const names2url = (repoNames: string[]) => {
  let urls = repoNames.map(repoName => runCommand("gh browse -n --repo " + repoName));
  return urls.map(u => u.replace(/\s*$/, '.git')); // TODO find a way to replace "\n" to "" earlier, avoid this line
};

export const prefixOrg = (reposNames: string[], org: string) => {
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

export const fetchOrgs = () => {
  return runCommand(chooseOrgName).trim();
}

export const isFirstParty = (plugin: string) => !(/.*\/.*/.test(plugin));
