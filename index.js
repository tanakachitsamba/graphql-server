const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')

// the personal token for the teller api
require('dotenv').load()
const token = process.env.TOKEN

const baseURL = `https://api.teller.io/accounts`

// fetches data by url
const getData = id => {
    let url = id ? `${baseURL}/${id}` : baseURL

    return axios
        .get(url, {
            // auth token required by teller api
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.data)
        .catch(error => console.log(error))
}

const typeDefs = gql`
    type Query {
        accounts: [Account!]!
        account(id: ID!): Account
    }

    type Account {
        name: String
        id: ID!
        enrollmentId: ID
        currency: String
        balance: Float
        bankCode: String
        accountNumber: Int
        institution: String
        links: Links
    }

    type Links {
        transactions: String
        standingOrders: String
        self: String
        payments: String
        payee: String
    }

`

const resolvers = {
    Query: {
        accounts: () => getData(),
        account: (parent, { id }) => getData(id),
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => {
    console.log(`ready at ${url}`)
})
