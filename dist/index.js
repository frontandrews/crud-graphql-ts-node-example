"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const http_1 = __importDefault(require("http"));
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const sqlite3_1 = __importDefault(require("sqlite3"));
const graphql_tag_1 = require("graphql-tag");
// Initialize SQLite in-memory database
const db = new sqlite3_1.default.Database(':memory:');
// Create a table named 'items' in the database
db.serialize(() => {
    db.run("CREATE TABLE items (id TEXT PRIMARY KEY, name TEXT)");
});
// Define GraphQL type definitions for our API
const typeDefs = (0, graphql_tag_1.gql) `
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
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        }
    },
    Mutation: {
        addItem: (_, { name }) => {
            // Add a new item to the database
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO items (id, name) VALUES (?, ?)");
                const id = Date.now().toString();
                stmt.run([id, name], (err) => {
                    if (err) {
                        reject(null);
                    }
                    else {
                        resolve({ id, name });
                    }
                });
                stmt.finalize();
            });
        }
    }
};
// Initialize Express application and HTTP server
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
    ],
});
// Function to start the GraphQL server
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server.start();
        // Set up middleware for GraphQL server
        app.use('/graphql', (0, cors_1.default)(), // Allow cross-origin requests
        (0, body_parser_1.json)(), // Parse JSON request bodies
        (0, express4_1.expressMiddleware)(server) // Connect Apollo server with Express
        );
        // Start the HTTP server on port 4000
        yield new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
        console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    });
}
// Kick off the server
startServer();
