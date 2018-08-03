const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const { typeDefs, resolvers } = require('./schema')

const { PORT = 4000 } = process.env

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const app = express()
server.applyMiddleware({ app, path: '/' })

app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
)
