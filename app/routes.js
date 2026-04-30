const express = require("express");
const router = express.Router();

const getDB = require("./mongo");
const driver = require("./neo4j");
const redis = require("./redis");


// 🔥 MongoDB Aggregation → Trending Events
router.get("/events/trending", async (req, res) => {
  const db = await getDB();

  const events = await db.collection("events").aggregate([
    {
      $project: {
        title: 1,
        attendeeCount: { $size: "$attendees" }
      }
    },
    { $sort: { attendeeCount: -1 } },
    { $limit: 5 }
  ]).toArray();

  res.json(events);
});


// 🎯 MongoDB Aggregation → By Interest
router.get("/events/interest", async (req, res) => {
  const db = await getDB();

  const events = await db.collection("events").aggregate([
    {
      $match: { category: { $in: ["tech", "music"] } }
    },
    { $sort: { date: 1 } }
  ]).toArray();

  res.json(events);
});


// 👥 Neo4j → Friends' Events
router.get("/events/friends/:userId", async (req, res) => {
  const session = driver.session();

  const result = await session.run(
    `
    MATCH (u:User {id: $id})-[:FRIENDS_WITH*1..2]->(f)-[:ATTENDING]->(e)
    RETURN DISTINCT e.id AS eventId
    `,
    { id: req.params.userId }
  );

  res.json(result.records.map(r => r.get("eventId")));
});


// ⚡ Redis → Cached Recommendations
router.get("/events/recommend/:userId", async (req, res) => {
  const key = `rec:${req.params.userId}`;

  const cached = await redis.get(key);
  if (cached) return res.json(JSON.parse(cached));

  const db = await getDB();
  const events = await db.collection("events").find().limit(5).toArray();

  await redis.set(key, JSON.stringify(events));

  res.json(events);
});

module.exports = router;