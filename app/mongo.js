const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://mongodb:27017");

async function getDB() {
  await client.connect();
  return client.db("project");
}

module.exports = getDB;