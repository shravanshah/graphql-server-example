const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type LocationMeta {
    _links: Links
    _meta: Meta
    items: [Location]
  }

  type Links {
    self: String
  }

  type Meta {
    total: Int
  }

#Location as a type
  type Location {
  #  _meta: Meta
    # _links: Links
    id: Int!
    name: String
    state_code: String
    location_type: String
    listings: [Listing]
    # parent_city: City
    parent_county: County
    # nearby_locations: Nearby_Locations
    # monthly_listing_trends: Monthly_Listing_Trends
    # school: School
  }

  type County {
    id: Int!
    name: String
    state_code: String
    location_type: String
  }

  # Listing as a type
  type Listing {
    
    "an interesting web name"
    web_name: String
    
    "where someone lives, I dunno"
    address: String
    
    "where someone lives in a different way"
    city: String
    
    "where someone lives according to voting"
    state_code: String
    
    "where someone lives according to a zipper"
    zip_code: String
    
    "when this house was born"
    year_build: String

    # "expands something"
    # expand: Listing
    
    "expands similar listings"
    similar_listings: [Listing]

    "expands something else i.e.photos"
    something_else: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getListings: [Listing]
    
    """
     returns one or more locations matching the search query
    """
    getLocations: LocationMeta

    """
     returns one or more locations matching the search query and filters
    """
    getFilteredLocations(
      """
      name comment
      """
      name: String, 
      """
      state comment
      """
      state_code: String, 
      """
      location type comment
      """
      location_type: String): [Location]

  }
`;

const meta = {
  total: 2
}

const links = {
  self: "/api/v1/to/something/awesome"
}

const similar_listings = [
  {
      web_name: 'similar-1234-fake-street',
      address: 'similar-1234 Fake Street',
      city: 'FakeCityS',
      state_code: 'FC',
  }
]

const listings = [
    {
      web_name: '1234-fake-street',
      address: '1234 Fake Street',
      city: 'FakeCity',
      state_code: 'FC',
      zip_code: '000000',
      year_build: '2004',
      similar_listings: similar_listings
    },
    {
      web_name: '124-faux-rd',
      address: '124 Faux Rd',
      city: 'FakeCity',
      state_code: 'FC',
      zip_code: '000001',
      year_build: '2010',
      similar_listings: similar_listings
    }
  ];

  const parent_county = {
      id: 12,
      name: 'fake-county-name',
      location_type: 'parent_county',
      state_code: 'FC'
  }
  
  const locations = [
    {
      id: 1,
      name: 'fake-name',
      location_type: 'city',
      state_code: 'FC',
      listings: listings,
      parent_county: parent_county
    },
    {
      id: 2,
      name: 'fake-name2',
      location_type: 'city2',
      state_code: 'FC',
      listings: listings,
      parent_county: parent_county
    }
  ];

  const location_wrapper = {
    _links: links,
    _meta: meta,
    items: locations
  }

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      getListings: () => listings,
      getLocations: () => location_wrapper,
      getFilteredLocations: () => locations,
    },
  };
  
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

