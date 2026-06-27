import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";
import { graphqlUploadExpress } from "graphql-upload";

import { ApolloServer } from "apollo-server-express";
import { sequelize } from "./models";
import schema from "./graphql";

// 25 MB cap on a single uploaded file. Matches the dropzone client guard and
// is comfortably above a typical interview-notes PDF. Tune here if product
// raises the limit.
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const CORS_ALLOW_LIST = [
  "http://localhost:3000",
  "https://uw-blueprint-starter-code.firebaseapp.com",
  "https://uw-blueprint-starter-code.web.app",
  /^https:\/\/uw-blueprint-starter-code--pr.*\.web\.app$/,
];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};

const app = express();
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// `graphql-upload` middleware must run BEFORE Apollo's request handler so
// that multipart/form-data bodies are parsed into `Promise<FileUpload>`
// arguments. Mount it on the same path Apollo will use.
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: MAX_UPLOAD_BYTES, maxFiles: 1 }),
);

const server = new ApolloServer({
  schema,
  // Disable apollo-server v2's built-in upload handling — we mount the
  // middleware ourselves above so we can control limits and ordering.
  uploads: false,
  context: ({ req, res }) => ({ req, res }),
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
});

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: { origin: CORS_ALLOW_LIST, credentials: true },
});

sequelize.authenticate();

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_SVC_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
    clientEmail: process.env.FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL,
  }),
});

app.listen({ port: process.env.PORT || 8080 }, () => {
  /* eslint-disable-next-line no-console */
  console.info(`Server is listening on port ${process.env.PORT || 8080}!`);
});
