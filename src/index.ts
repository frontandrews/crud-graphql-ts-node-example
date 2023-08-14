import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import { json } from 'body-parser';
import sqlite3 from 'sqlite3';
import { gql } from 'graphql-tag';

// Initialize SQLite in-memory database
const db = new sqlite3.Database(':memory:');

// Create a table named 'items' in the database
db.serialize(() => {
  db.run("CREATE TABLE items (id TEXT PRIMARY KEY, name TEXT)");
});

// Define GraphQL type definitions for our API
const typeDefs = gql`
    type Item {
        id: ID!
        name: String!
    }

    type Query {
        items: [Item!]!
    }

    type Mutation {
        addItem(name: String!): Item
    }
`;

// Define resolvers for the GraphQL API
const resolvers = {
    Query: {
        items: () => {
            // Fetch all items from the database
            return new Promise((resolve, reject) => {
                db.all("SELECT id, name FROM items", [], (err, rows) => {
                    if (err) {
                        reject([]);
                    } else {
                        resolve(rows);
                    }
                });
            });
        }
    },
    Mutation: {
        addItem: (_: any, { name }: any) => {
            // Add a new item to the database
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO items (id, name) VALUES (?, ?)");
                const id = Date.now().toString();
                stmt.run([id, name], (err) => {
                    if (err) {
                        reject(null);
                    } else {
                        resolve({ id, name });
                    }
                });
                stmt.finalize();
            });
        }
    }
};

// Initialize Express application and HTTP server
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
});

// Function to start the GraphQL server
async function startServer() {
    await server.start();

    // Set up middleware for GraphQL server
    app.use(
      '/graphql',
      cors(),  // Allow cross-origin requests
      json(),  // Parse JSON request bodies
      expressMiddleware(server)  // Connect Apollo server with Express
    );

    // Start the HTTP server on port 4000
    await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

// Kick off the server
startServer();