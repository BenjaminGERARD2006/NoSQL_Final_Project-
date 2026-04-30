# Smart Event Recommendation System

## Final Project Report

---

## 1. Project Idea

The goal of this project is to build a **Smart Event Recommendation System** that suggests events to users based on their interests, social connections, and overall popularity of events.

The application combines three different NoSQL databases to demonstrate how each type of database solves a specific problem:

* **MongoDB** is used for storing structured application data such as users and events.
* **Neo4j** is used to model relationships between users and events.
* **Redis** is used to improve performance through caching and fast data access.

This system simulates a real-world recommendation engine similar to platforms like Eventbrite or social media event suggestions.

---

## 2. MongoDB Usage

### Why MongoDB?

MongoDB was used as the primary database because it stores data in a flexible JSON-like format (documents). This is ideal for representing entities like users and events, which may have varying attributes.

---

### Data Stored in MongoDB

* Users (id, name, interests, location)
* Events (id, title, category, attendees, date)

Example:

```json
{
  "_id": "e1",
  "title": "Tech Meetup",
  "category": "tech",
  "attendees": ["u1", "u2"],
  "date": "2026-05-01"
}
```

---

### Aggregation Pipeline 1: Trending Events

```js
db.events.aggregate([
  {
    $project: {
      title: 1,
      attendeeCount: { $size: "$attendees" }
    }
  },
  { $sort: { attendeeCount: -1 } },
  { $limit: 5 }
])
```

#### Explanation:

* `$project` calculates the number of attendees for each event.
* `$sort` orders events by popularity (descending).
* `$limit` returns only the top 5 events.

Purpose:
This pipeline identifies **trending events** based on user participation.

---

### Aggregation Pipeline 2: Events by Interest

```js
db.events.aggregate([
  {
    $match: {
      category: { $in: ["tech", "music"] }
    }
  },
  { $sort: { date: 1 } }
])
```

#### Explanation:

* `$match` filters events that match user interests.
* `$sort` orders them by date (upcoming events first).

Purpose:
This pipeline enables **personalized recommendations** based on user preferences.

---

## 3. Neo4j Usage

### Why Neo4j?

Neo4j is a graph database designed to efficiently handle relationships between entities. In this project, it is used to model social connections and event participation.

---

### Graph Structure

Nodes:

* User
* Event

Relationships:

* `FRIENDS_WITH`
* `ATTENDING`

---

### Path Traversal Query

```cypher
MATCH (u:User {id: "u1"})-[:FRIENDS_WITH*1..2]->(f)-[:ATTENDING]->(e)
RETURN e
```

---

### Explanation:

* Starts from a specific user (`u1`)
* Traverses up to 2 levels of friendships (friends and friends-of-friends)
* Finds events those users are attending

Purpose:
This query returns **events attended by a user’s social network**, enabling social-based recommendations.

---

### Why This Is Useful

Without a graph database, this type of query would require complex joins and be inefficient. Neo4j allows fast and natural traversal of relationships.

---

## 4. Redis Usage

### Why Redis?

Redis is an in-memory database used for high-speed data access. It is ideal for caching and real-time operations.

---

### Data Types Used

* **Strings** → for caching recommendations
* **Sorted Sets** → for ranking trending events
* **Hashes (optional)** → for session storage

---

### Example Usage

```bash
SET rec:u1 "[e1,e2,e3]"
ZADD trending_events 100 e1
```

---

### Role in the Project

Redis was used for:

1. **Caching**

   * Store recommended events for each user
   * Avoid repeated database queries

2. **Performance Optimization**

   * Reduce load on MongoDB and Neo4j
   * Provide faster API responses

3. **Ranking**

   * Track event popularity using sorted sets

---

## 5. System Architecture

The system integrates three databases, each serving a specific purpose:

* MongoDB → stores main application data
* Neo4j → handles relationships and graph queries
* Redis → improves performance with caching

Workflow:

1. User requests recommendations
2. Redis is checked for cached results
3. If not found:

   * MongoDB provides events based on interests
   * Neo4j provides events based on social connections
4. Results are cached in Redis
5. Response is returned to the user

---

## 6. How to Run the Project

### Start Services

```bash
docker-compose up --build
```

### Seed Data

```bash
node app/seed/seed.js
node app/seed/neo4jSeed.js
```

### API Endpoints

* `/events/trending` → Trending events
* `/events/interest` → Events by category
* `/events/friends/u1` → Social-based recommendations
* `/events/recommend/u1` → Cached recommendations

---

## 7. Conclusion

This project demonstrates how multiple NoSQL databases can be combined to build a scalable and efficient application:

* MongoDB provides flexible document storage
* Neo4j enables powerful relationship queries
* Redis improves performance and responsiveness

By integrating these technologies, the system delivers personalized and efficient event recommendations, showcasing real-world database design principles.

