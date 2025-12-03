import { MongoClient, type Db } from "mongodb"

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("your-mongodb-uri")) {
  console.warn("MONGODB_URI is missing or placeholder. Database features will not work.")
  // Return a promise that rejects when accessed, or a mock if we want to be fancier.
  // For now, let's make it a promise that rejects with a clear message.
  clientPromise = Promise.reject(new Error("MONGODB_URI is not configured"))
} else {
  const uri = process.env.MONGODB_URI
  const options = {
    serverSelectionTimeoutMS: 5000,
  }

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise

export const connectToDatabase = getDatabase

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise
    return client.db("kaushalx_skillswap")
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Database connection failed");
  }
}
