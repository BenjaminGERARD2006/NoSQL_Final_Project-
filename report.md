# Project Report

## Project Idea
This project is a smart event recommendation system that suggests events based on user interests, social connections, and trending activity.

## MongoDB
MongoDB stores users and events.

### Aggregation 1: Trending Events
Counts attendees and sorts by popularity.

### Aggregation 2: Events by Interest
Filters events by category.

## Neo4j
Neo4j models relationships between users and events.

### Query
MATCH (u:User {id: "u1"})-[:FRIENDS_WITH*1..2]->(f)-[:ATTENDING]->(e)
RETURN e

This finds events attended by friends.

## Redis
Redis is used for caching recommendations and improving performance.
