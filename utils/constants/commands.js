export const chooseOrgName = "gh api --paginate /user/memberships/orgs  --jq '.[].organization.login' | fzf  --prompt='Choose an organization> ' --layout=reverse --border";

export const allOrgNames = "gh api --paginate /user/memberships/orgs --jq '.[].organization.login'"

export const chooseRepo = (org) => `fzf -m --bind 'ctrl-a:toggle-all' --prompt='${org}:Use tab to choose repos to download> ' --layout=reverse --border`;
