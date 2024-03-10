import express from "express";
import jwt from "express-jwt";
import jwksClient from "jwks-rsa";

const app = express();

const jwtCheck = jwt({
  secret: jwksClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwkRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
  credentialsRequired: false,
});

export default app;
