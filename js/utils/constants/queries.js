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
* Return the same repository from the GitHub API. Is used to check repository existence
* */
export const identityRepo = (repo) => `
query {
  viewer {
    repository(name: "${repo}", followRenames: false) {
      url
    }
  }
}
`;
