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
        name: parent => {
            const { id } = parent
            return GetData(id).then(({ name }) => name)
        },
        tellerId: parent => {
            const { id } = parent
            return GetData(id).then(({ enrollment_id }) => enrollment_id)
        },
        enrollmentId: parent => {
            const { id } = parent
            return GetData(id).then(({ enrollment_id }) => enrollment_id)
        },
        currency: parent => {
            const { id } = parent
            return GetData(id).then(({ currency }) => currency)
        },
        balance: parent => {
            const { id } = parent
            return GetData(id).then(({ balance }) => balance)
        },
        bankCode: parent => {
            const { id } = parent
            return GetData(id).then(({ bank_code }) => bank_code)
        },
        accountNumber: parent => {
            const { id } = parent
            return GetData(id).then(({ account_number }) => account_number)
        },
        institution: parent => {
            const { id } = parent
            return GetData(id).then(({ institution }) => institution)
        },

        links: parent => {
            const { id } = parent
            return GetData(id).then(({ links }) => links)
        },
    },

    Links: {
        transactions: (parent, args) => {
            const { id } = args
            return GetData(id).then(({ links: { transactions } }) => transactions)
        },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => {
    console.log(`ready at ${url}`)
})
