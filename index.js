const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')

require('dotenv').load()
const token = process.env.TOKEN

const baseURL = `https://api.teller.io/accounts`

const typeDefs = gql`
    type Query {
        account: Account
    }

    type Account {
        name: String
        tellerId: String
    }

`

const resolvers = {
    Query: {
        account: () => {
            return axios
                .get(`${baseURL}/0a8f0aa8-14de-44e7-abdd-1c95bad906f5`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(res => {
                    return res.data
                })
        },
    },
    Account: {
        name: () => {
            return axios
                .get(`${baseURL}/0a8f0aa8-14de-44e7-abdd-1c95bad906f5`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(res => {
                    return res.data.name
                })
        },
        tellerId: () => {
            return axios
                .get(`${baseURL}/0a8f0aa8-14de-44e7-abdd-1c95bad906f5`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(res => {
                    return res.data.id
                })
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
