import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import sqlite3 from 'sqlite3';

// Setup SQLite
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE items (id TEXT PRIMARY KEY, name TEXT)");
});

// GraphQL type definitions and resolvers
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

const resolvers = {
    Query: {
        items: () => {
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

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();


async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () => {
        console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    });
}

// Call the function to start the server
startServer();