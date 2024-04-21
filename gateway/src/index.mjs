import http from "http";
import app from "./config/app.mjs";
import initGateway from "./config/apollo.mjs";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";

const port = process.env.PORT;
const httpServer = http.createServer(app);

const gateway = initGateway(httpServer);
await gateway.start();

// console.log(gateway);

app.use(
  "/",
  cors(),
  express.json(),
  expressMiddleware(gateway, {
    context: async ({ req }) => {
      // token: req.headers.token
      // console.log("US:", req.headers.user);
      // console.log("US:", req);
      const user = req.user || null;
      // console.log("USER:", user);
      // this line isn't firing...
      // console.log("APOLLO_SERVER REQ:", req);
      return { user };
    },
  })
);

// gateway.applyMiddleware({ app, path: "/" });

await new Promise((resolve) => httpServer.listen({ port }, resolve));
console.log(`Gateway ready at http://localhost:${port}`);
