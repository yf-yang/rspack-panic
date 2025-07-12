from typing import cast

from bson.objectid import ObjectId
from pymongo import MongoClient
from pymongo.database import Database


def get_database() -> Database:
  client = MongoClient("localhost", 27017)

  # Get a database
  return client.sample_database


def sample_request() -> ObjectId:
  # Get database connection
  db = get_database()

  # Get a collection
  collection = db.sample_collection

  # Insert a document
  result = collection.insert_one({"name": "Sample Item", "value": 42})
  print(f"Inserted document with id: {result.inserted_id}")

  # Find documents
  items = collection.find({"value": {"$gt": 10}})
  for item in items:
    print(f"Found item: {item}")

  # Update a document
  update_result = collection.update_one({"name": "Sample Item"}, {"$set": {"value": 100}})
  print(f"Modified {update_result.modified_count} document(s)")

  return cast(ObjectId, result.inserted_id)


def main() -> None:
  sample_id = sample_request()
  print(f"Operation completed with document ID: {sample_id}")


if __name__ == "__main__":
  main()
