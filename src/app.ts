import "reflect-metadata";
import express, { Application } from "express";  // Import Application type
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { sequelize } from "./database"; // Database connection
import { UserResolver } from "./graphql/resolver/user.resolver";
import { authMiddleware } from "./auth/auth.middleware";
import { setupSocket } from "./sockets/socket.service";
import { redisClient } from "./utils/cache/redisClient";

// Initialize Express
const app: Application = express();  // Cast app to Application type

// Middleware for authentication
app.use(authMiddleware);

// Function to start the application
const startApp = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Redis connection
    await redisClient.connect();
    console.log("Redis connected successfully.");

    // Build GraphQL schema
    const schema = await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    });

    // Setup Apollo Server
    const apolloServer = new ApolloServer({
      schema,
      context: ({ req }) => ({ req }), // Pass the request object for authentication
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: app as any });

    // Create HTTP server and setup WebSocket
    const httpServer = createServer(app);
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*", // Adjust for production to allow only trusted origins
      },
    });

    // Setup WebSocket communication
    setupSocket(io);

    // Start the server
    const PORT = 4000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`GraphQL playground available at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  } catch (error) {
    console.error("Error starting the application:", error);
    process.exit(1);
  }
};

startApp();
