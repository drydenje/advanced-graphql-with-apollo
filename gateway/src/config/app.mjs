import express from "express";
import { expressjwt as jwt } from "express-jwt";
import jwksClient from "jwks-rsa";

const app = express();

const jwtCheck = jwt({
  secret: jwksClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
  credentialsRequired: false,
});

app.use(jwtCheck, (err, req, res, next) => {
  if (err.code === "invalid_token") {
    console.log("INVALID TOKEN");
    return next();
  }
  return next(err);
});

export default app;
