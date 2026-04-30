const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "password")
);

async function seedNeo4j() {
  const session = driver.session();

  await session.run(`
    CREATE (u1:User {id: "u1"})
    CREATE (u2:User {id: "u2"})
    CREATE (u3:User {id: "u3"})

    CREATE (e1:Event {id: "e1"})
    CREATE (e2:Event {id: "e2"})

    CREATE (u1)-[:FRIENDS_WITH]->(u2)
    CREATE (u2)-[:FRIENDS_WITH]->(u3)

    CREATE (u2)-[:ATTENDING]->(e1)
    CREATE (u3)-[:ATTENDING]->(e2)
  `);

  console.log("Neo4j Seeded!");
  await session.close();
  await driver.close();
}

seedNeo4j();