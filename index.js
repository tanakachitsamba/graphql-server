const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')

// the personal token for the teller api
require('dotenv').load()
const token = process.env.TOKEN

const baseURL = `https://api.teller.io/accounts`

// fetches data by url
const GetData = id => {
    let url = id ? `${baseURL}/${id}` : baseURL

    return axios
        .get(url, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
            return res.data
        })
        .catch(error => console.log(error))
}

const typeDefs = gql`
    type Query {
        accounts: [Account!]!
        links: Links
    }

    type Test {
        name: String
    }

    type Account {
        name: String
        tellerId: String!
        enrollmentId: String
        currency: String
        balance: Float
        bankCode: String
        accountNumber: Int
        institution: String
        links: Links
    }

    type Links {
        transactions: String
        standing_orders: String
        self: String
        payments: String
        payee: String
    }

`

const resolvers = {
    Query: {
        accounts: () => GetData(),
    },

    Account: {
        name: ({ id }) => GetData(id).then(({ name }) => name),
        tellerId: ({ id }) => GetData(id).then(({ enrollment_id }) => enrollment_id),
        enrollmentId: ({ id }) => GetData(id).then(({ enrollment_id }) => enrollment_id),
        currency: ({ id }) => GetData(id).then(({ currency }) => currency),
        balance: ({ id }) => GetData(id).then(({ balance }) => balance),
        bankCode: ({ id }) => GetData(id).then(({ bank_code }) => bank_code),
        accountNumber: ({ id }) => GetData(id).then(({ account_number }) => account_number),
        institution: ({ id }) => GetData(id).then(({ institution }) => institution),
        links: ({ id }) => GetData(id).then(({ links }) => links),
    },

    Links: {
        transactions: ({ transactions }) => transactions,
        standingOrders: ({ standing_orders }) => standing_orders,
        self: ({ self }) => self,
        payments: ({ payments }) => payments,
        payee: ({ payee }) => payee,
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => {
    console.log(`ready at ${url}`)
})
