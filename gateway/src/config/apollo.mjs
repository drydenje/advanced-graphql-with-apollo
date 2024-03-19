import {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

function initGateway(httpServer) {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [{ name: "accounts", url: process.env.ACCOUNTS_ENDPOINT }],
      pollIntervalInMs: 1000,
    }),
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          request.http.headers.set(
            "user",
            // is this is setting null properly? the ternary is right
            context.user ? JSON.stringify(context.user) : null
          );
        },
      });
    },
  });
  console.log("BAH");
  return new ApolloServer({
    // const temp = new ApolloServer({
    gateway,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      const user = req.user || null;
      console.log("APOLLO_SERVER REQ:", req);
      return { user };
    },
  });
  // console.log(temp.internals.plugins);
  // return temp;
}

export default initGateway;
