export const allRepos = (org) => `
query($endCursor: String) {
  organization(login: "${org}") {
    repositories(first: 100, after: $endCursor) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node  {
          name
        }
      }
    }
  }
}
`;
/*
* Return the same repository from the GitHub API
* It is used to check repository existence, or get the full URL
* identityRepoFilter can be used to get the url from the response
* */
export const identityRepo = (repo) => `
query {
  viewer {
    repository(name: "${repo}", followRenames: false) {
      sshUrl
    }
  }
}
`;
export const identityRepoFilter = "--jq '.data.viewer.repository.sshUrl'";
