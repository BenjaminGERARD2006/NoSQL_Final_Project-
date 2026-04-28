const { MongoClient } = require("mongodb");

async function seed() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();

  const db = client.db("project");

  await db.collection("events").insertMany([
    {
      _id: "e1",
      title: "Tech Meetup",
      category: "tech",
      attendees: ["u1", "u2"],
      date: "2026-05-01"
    },
    {
      _id: "e2",
      title: "Music Festival",
      category: "music",
      attendees: ["u2"],
      date: "2026-06-01"
    }
  ]);

  console.log("Seeded data!");
}

seed();