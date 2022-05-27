export const chooseOrgName = "gh api --paginate /user/memberships/orgs  --jq '.[].organization.login' | fzf  --prompt='Choose an organization> ' --layout=reverse --border";

export const allOrgNames = "gh api --paginate /user/memberships/orgs --jq '.[].organization.login'"

export const orgExists = (org) => `gh api --paginate /user/memberships/orgs/${org}`

export const chooseRepo = (org) => `fzf -m --bind 'ctrl-a:toggle-all' --prompt='${org}:Use tab to choose repos to download> ' --layout=reverse --border`;

export const getUsersFromOrg = (org) => `gh api https://api.github.com/orgs/${org}/members --jq '.[].login'`
