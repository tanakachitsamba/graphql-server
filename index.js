const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')

require('dotenv').load()
const token = process.env.TOKEN

const baseURL = `https://api.teller.io/accounts`

const typeDefs = gql`
    type Query {
        accounts: [Account!]!
    }

    type Account {
        name: String
        tellerId: String
    }

`

const resolvers = {
    Query: {
        accounts: () => {
            return axios
                .get(baseURL, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(res => {
                    return res.data
                })
        },
    },
    Account: {
        name: parent => {
            const { id } = parent

            return axios
                .get(`${baseURL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(res => {
                    return res.data.name
                })
        },
        tellerId: parent => {
            const { id } = parent

            return axios
                .get(`${baseURL}/${id}`, {
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
