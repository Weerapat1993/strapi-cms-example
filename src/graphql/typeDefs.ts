
export const typeDefs = `
  type Address {
    id: ID!
    status: String!
    limit: Int!
  }

  input AddressInput {
    id: ID!
    status: String!
    limit: Int!
  }
  extend type Query {
    address(input: AddressInput!): Address
  }
`