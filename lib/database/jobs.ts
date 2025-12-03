import { getDatabase } from "../mongodb"
import type { Job } from "../models/Job"
import { ObjectId } from "mongodb"

export class JobService {
    private static async getCollection() {
        const db = await getDatabase()
        return db.collection<Job>("jobs")
    }

    static async createJob(jobData: Omit<Job, "_id" | "createdAt" | "updatedAt" | "applicants">): Promise<Job> {
        const collection = await this.getCollection()

        const job: Job = {
            ...jobData,
            applicants: [],
            status: "open",
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const result = await collection.insertOne(job)
        return { ...job, _id: result.insertedId }
    }

    static async getJobs(limit = 20): Promise<Job[]> {
        const collection = await this.getCollection()
        return await collection.find({ status: "open" }).sort({ createdAt: -1 }).limit(limit).toArray()
    }

    static async getJobById(id: string): Promise<Job | null> {
        const collection = await this.getCollection()
        return await collection.findOne({ _id: new ObjectId(id) })
    }
}
