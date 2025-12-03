import { connectToDatabase } from "../mongodb"
import type { Transaction, CryptoConversion } from "../models/Transaction"
import type { ObjectId } from "mongodb"

export async function createTransaction(transaction: Omit<Transaction, "_id" | "createdAt" | "updatedAt">) {
  const db = await connectToDatabase()

  const newTransaction = {
    ...transaction,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection("transactions").insertOne(newTransaction)

  // Update user's skillCredits
  if (transaction.status === "completed") {
    const creditChange = transaction.type === "earn" ? transaction.amount : -transaction.amount
    await db.collection("users").updateOne(
      { _id: transaction.userId },
      {
        $inc: { skillCredits: creditChange },
        $set: { updatedAt: new Date() },
      },
    )
  }

  return { ...newTransaction, _id: result.insertedId }
}

export async function getUserTransactions(userId: ObjectId, limit = 50) {
  const db = await connectToDatabase()

  return await db.collection("transactions").find({ userId }).sort({ createdAt: -1 }).limit(limit).toArray()
}

export async function awardCreditsForSkillSession(
  teacherId: ObjectId,
  learnerId: ObjectId,
  skillName: string,
  sessionDuration: number,
) {
  const baseCredits = Math.floor(sessionDuration / 15) * 10 // 10 credits per 15 minutes
  const teacherBonus = Math.floor(baseCredits * 1.5) // Teachers get 50% more

  // Award credits to teacher
  await createTransaction({
    userId: teacherId,
    type: "earn",
    amount: teacherBonus,
    description: `Taught ${skillName} for ${sessionDuration} minutes`,
    category: "skill_teaching",
    metadata: { skillName, sessionDuration },
    status: "completed",
  })

  // Award credits to learner
  await createTransaction({
    userId: learnerId,
    type: "earn",
    amount: baseCredits,
    description: `Learned ${skillName} for ${sessionDuration} minutes`,
    category: "skill_learning",
    metadata: { skillName, sessionDuration },
    status: "completed",
  })

  return { teacherCredits: teacherBonus, learnerCredits: baseCredits }
}

export async function createCryptoConversion(conversion: Omit<CryptoConversion, "_id" | "createdAt" | "updatedAt">) {
  const db = await connectToDatabase()

  const newConversion = {
    ...conversion,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection("crypto_conversions").insertOne(newConversion)

  // Deduct credits from user
  await createTransaction({
    userId: conversion.userId,
    type: "convert",
    amount: conversion.creditsAmount,
    description: `Converted ${conversion.creditsAmount} credits to ${conversion.cryptoAmount} ${conversion.cryptoType}`,
    category: "crypto_conversion",
    metadata: {
      cryptoType: conversion.cryptoType,
      cryptoAmount: conversion.cryptoAmount,
      conversionRate: conversion.conversionRate,
    },
    status: "completed",
  })

  return { ...newConversion, _id: result.insertedId }
}

export async function getEarningRules() {
  const db = await connectToDatabase()
  return await db.collection("earning_rules").find({ isActive: true }).toArray()
}

export async function getUserCryptoConversions(userId: ObjectId) {
  const db = await connectToDatabase()
  return await db.collection("crypto_conversions").find({ userId }).sort({ createdAt: -1 }).toArray()
}
