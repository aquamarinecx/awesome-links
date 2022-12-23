import { ApolloClient, InMemoryCache } from '@apollo/client'

const apolloClient = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
})

export default apolloClient;


// PAGINATION:

`
query allLinksQuery($first: Int, $after: String) {
    links(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          imageUrl
          title
          description
          url
          category
        }
      }
    }
  }

  INPUTS:
    first: Int that specifies how many items you want the API to return
    after: a String argument that bookmarks the last item in a result set, this is the cursor
  OUTPUTS:
    pageInfo: an object that helps the client determine if there is more data to be fetched:
        endCursor: the cursor of the last item in a result set, type String
        hasNextPage: a boolean returned by the API that lets the client know if there are more pages that can be fetched
    edges: an array of objects, where each object has a cursor and a node fields








    IN THIS PROJECT WE WILL DO ONE-WAY PAGINATION; SHOW MORE BUTTON:

    Approach:
    1. fetch some initial data on first load
    2. after clicking button: send a second request to the API, includes how many items you want returned and the cursor (bookmark)
    3. return data and display on client
    4. repeat steps 2, 3
`