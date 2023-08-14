# GraphQL CRUD using Node, TypeScript, Apollo, Express, and SQLite

This project provides a simple GraphQL-based CRUD (Create, Read, Update, Delete) API using Apollo Server, Express, and SQLite as the database. With TypeScript for static typing, the project achieves better code quality and developer experience.

## Features

- **SQLite Database**: Uses an in-memory SQLite database. 
- **Apollo Server**: Implements a GraphQL server with Apollo.
- **TypeScript**: Ensures type-safety with typescript.

## Installation & Setup

1. Ensure you have [Node.js](https://nodejs.org/) installed.
   ```

## Install the dependencies:

`npm install`

## Run the server:

`yarn build`

`yarn dev`

## Usage

Navigate to http://localhost:4000 in your web browser to access the Apollo Server Playground.

GraphQL Operations

#### Add an Item:

```
mutation {
  addItem(name: "Sample Item") {
    id
    name
  }
}
```
#### Retrieve All Items:

```
query {
  items {
    id
    name
  }
}
```