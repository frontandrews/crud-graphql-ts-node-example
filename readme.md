# GraphQL CRUD using Node, TypeScript, Apollo, Express, and SQLite

This project provides a simple GraphQL-based CRUD (Create, Read, Update, Delete) API using Apollo Server, Express, and SQLite as the database. With TypeScript for static typing.


## Requirements

 Node.js

## Install the dependencies:

`npm install`

## Run the server:

`yarn build`

`yarn dev`

## Usage

Navigate to http://localhost:4000 in your web browser to access the Apollo Server Playground.

**GraphQL Operations**

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