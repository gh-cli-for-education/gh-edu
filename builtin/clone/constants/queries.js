/** @param org {string} */
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
