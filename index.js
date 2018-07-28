const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')

require('dotenv').load()
const token = process.env.TOKEN

const baseURL = `https://api.teller.io/accounts`

const getData = id => {
    return axios
        .get(() => (id ? `${baseURL}/${id}` : baseURL), {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
            return res.data
        })
        .catch(error => console.log(error))
}

const GetAllData = () => {
    return axios
        .get(baseURL, {
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
        enrollment_id: String
        currency: String
        balance: Float
        bank_code: String
        account_number: Int
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

const GetDataByID = id => {
    return axios
        .get(`${baseURL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
            return res.data
        })
        .catch(error => console.log(error))
}

const resolvers = {
    Query: {
        accounts: () => GetAllData(),
    },
    Account: {
        name: parent => {
            const { id } = parent
            return GetDataByID(id).then(data => data.name)
        },
        tellerId: parent => {
            const { id } = parent
            return GetDataByID(id).then(data => data.id)
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
