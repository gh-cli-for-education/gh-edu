//@ts-check
import * as commands from "../../utils/constants/commands.js"
import * as queries from "../../utils/constants/queries.js"
import * as utils from "../../utils/utils.js"
import shell from "shelljs";
import jq  from "node-jq"
import tmp from "tmp";
import fs from "fs";

"use strict"

const chooseOrg = () => {
  return utils.runCommand(commands.chooseOrgName).trim();
}

/** @param org {string} */
const chooseRepo = async(org) => { // TODO delete this async
  if (!org) {
    throw("internal error. chooseRepo needs to know the organization");
  }
  let resultQuery = utils.executeQuery(queries.allRepos(org));
  const filter = ".data.organization.repositories.edges[].node.name"
  /** @type string */
  let allRepos;
  await jq.run(filter, resultQuery, {input: "string", output: "string"})
  .then(result => {
    if (typeof result === "string")
      allRepos = result
  })
  .catch(err => {
    throw("internal error: jq in chooseRepo -> " + err);
  })
  allRepos = allRepos.replace(/"/g, "");
  const tmpFile = tmp.tmpNameSync();
  fs.writeFileSync(tmpFile, allRepos);
  let command = `cat ${tmpFile} | ${commands.chooseRepo(org)}`;
  let fzfresult = shell.exec(command); // TODO: what happend if I press esc
  let result = fzfresult.stdout.split("\n");
  result.pop();
  return utils.prefixOrg(result, org);
}

/** @param urls {string[]} 
  * @param numberOfProcess {number}
  * @return {void}
  * */
const cloneRepo = (urls, numberOfProcess = 2) => {
  if (urls.length === 0) {
    console.info("Nothing to clone");
    return;
  }
  numberOfProcess = Math.min(numberOfProcess, urls.length);
  console.log(`Cloning with ${numberOfProcess} concurrent processes ...`);
  let command = `npx concurrently -m ${numberOfProcess} `;
  for (const url of urls) {
    command += `"gh repo clone ${url}" `;
  }
  let result = shell.exec(command, { silent: true });
  if (result.code !== 0) {
    console.error(`Error: Command "${command}" failed\n${result.stderr}`);
  }
};

export default async function main (org) { 
  org = org || chooseOrg();
  let repos = await chooseRepo(org);
  cloneRepo(repos);
  console.log("Done!!")
};
