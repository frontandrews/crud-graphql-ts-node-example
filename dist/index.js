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
const apollo_server_express_1 = require("apollo-server-express");
const sqlite3_1 = __importDefault(require("sqlite3"));
// Setup SQLite
const db = new sqlite3_1.default.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE items (id TEXT PRIMARY KEY, name TEXT)");
});
// GraphQL type definitions and resolvers
const typeDefs = (0, apollo_server_express_1.gql) `
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
const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
const app = (0, express_1.default)();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server.start();
        server.applyMiddleware({ app });
        app.listen({ port: 4000 }, () => {
            console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
        });
    });
}
// Call the function to start the server
startServer();
