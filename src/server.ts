import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/resolver/user.resolver"; // Adjust the path if necessary
import { AdminSecret } from "./config"; // Importing admin-secret configuration
import dotenv from "dotenv";
import { errorHandler } from "./utils/errorHandler";
import logger from './utils/logger';
import {setupSocket} from "./sockets/socket.service"
dotenv.config();

const app: any = express();

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  // Apollo Server setup with a context function to check for admin-secret in headers
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      // Check for the admin-secret in the request headers
      const adminSecret = req.headers["admin-secret"];
      if (adminSecret !== AdminSecret) {
        throw new Error("Unauthorized: Invalid admin secret");
      }
      return {}; // You can add more context information here if necessary
    },
  });

  const app = express();

  await server.start();

  // Apply middleware to Apollo Server
   server.applyMiddleware({ app: app as any });
   app.use(errorHandler);
  // Start the server
  const httpServer = app.listen(3000, () => {
   logger.info("Server is running at http://localhost:3000");
  });
  setupSocket(httpServer);

}


bootstrap();
