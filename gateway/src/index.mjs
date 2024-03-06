import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { gql } from "graphql-tag";

const port = process.env.PORT;
const app = express();
const httpServer = http.createServer(app);

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello() {
      return "world";
    },
  },
};

const gateway = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await gateway.start();

// gateway.applyMiddleware({ app, path: "/" });
app.use(
  "/",
  cors(),
  express.json(),
  expressMiddleware(gateway, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise((resolve) => httpServer.listen({ port }, resolve));
console.log(`Gateway ready at http://localhost:${port}${gateway.graphqlPath}`);
