const { gql } = require('apollo-server-express')
const axios = require('axios')

const { SECRET_TOKEN } = process.env

const baseURL = `https://api.teller.io/accounts`

// fetch teller data
const getData = (route, id) => {
    let url = route ? `${baseURL}/${id}/${route}` : id ? `${baseURL}/${id}` : baseURL
    return axios
        .get(url, {
            // auth token required by teller api
            headers: { Authorization: `Bearer ${SECRET_TOKEN}` },
        })
        .then(res => {
            return res.data
        })
        .catch(error => console.log(error))
}

const typeDefs = gql`
    type Query {
        accounts: [Account!]!
        account(id: ID!): Account
        transactions(id: ID!): [Transactions!]!
        payees(id: ID!): [Payees!]!
    }

    type Account {
        name: String
        id: ID!
        enrollmentId: ID
        currency: String
        balance: Float
        bank_code: String
        account_number: Int
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

    type Transactions {
        type: String
        id: ID!
        running_balance: Float
        links: Links
        description: String
        date: String
        counterparty: String
        amount: Float
    }

    type Payees {
        name: String
        links: Links
        id: ID!
        bank_code: String
        account_number: Int
        reference: String
    }

`

const resolvers = {
    Query: {
        accounts: () => getData(),
        account: (parent, { id }) => getData(null, id),
        transactions: (parent, { id }) => getData('transactions', id),
        payees: (parent, { id }) => getData('payees', id),
    },
}

module.exports = { typeDefs, resolvers }
