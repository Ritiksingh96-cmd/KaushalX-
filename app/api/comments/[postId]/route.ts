import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { UserService } from "@/lib/database/users"
import type { Comment } from "@/lib/models/Message"
import { ObjectId } from "mongodb"
import { z } from "zod"

interface RouteParams {
  params: Promise<{
    postId: string
  }>
}

const addCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(500, "Comment too long"),
  parentCommentId: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { postId } = await params
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const db = await getDatabase()
    const commentsCollection = db.collection<Comment>("comments")

    const comments = await commentsCollection
      .find({
        postId: new ObjectId(postId),
        parentCommentId: { $exists: false }, // Only top-level comments
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()

    // Get author info and replies for each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await UserService.findUserById(comment.authorId)

        // Get replies
        const replies = await commentsCollection
          .find({ parentCommentId: comment._id })
          .sort({ createdAt: 1 })
          .limit(10)
          .toArray()

        const repliesWithAuthors = await Promise.all(
          replies.map(async (reply) => {
            const replyAuthor = await UserService.findUserById(reply.authorId)
            return {
              id: reply._id,
              content: reply.content,
              likes: reply.likes.length,
              createdAt: reply.createdAt,
              author: replyAuthor
                ? {
                  id: replyAuthor._id,
                  name: replyAuthor.name,
                  avatar: replyAuthor.avatar,
                  isVerified: replyAuthor.isVerified,
                }
                : null,
            }
          }),
        )

        return {
          id: comment._id,
          content: comment.content,
          likes: comment.likes.length,
          repliesCount: comment.replies.length,
          createdAt: comment.createdAt,
          author: author
            ? {
              id: author._id,
              name: author.name,
              avatar: author.avatar,
              isVerified: author.isVerified,
            }
            : null,
          replies: repliesWithAuthors,
        }
      }),
    )

    return NextResponse.json({ comments: commentsWithAuthors })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { postId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = addCommentSchema.parse(body)

    const db = await getDatabase()
    const commentsCollection = db.collection<Comment>("comments")

    const comment: Comment = {
      postId: new ObjectId(postId),
      authorId: new ObjectId(session.user.id),
      content: validatedData.content,
      parentCommentId: validatedData.parentCommentId ? new ObjectId(validatedData.parentCommentId) : undefined,
      likes: [],
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await commentsCollection.insertOne(comment)
    const createdComment = { ...comment, _id: result.insertedId }

    // If this is a reply, add to parent comment
    if (validatedData.parentCommentId) {
      await commentsCollection.updateOne(
        { _id: new ObjectId(validatedData.parentCommentId) },
        { $push: { replies: result.insertedId } },
      )
    }

    const author = await UserService.findUserById(session.user.id)

    return NextResponse.json({
      comment: {
        id: createdComment._id,
        content: createdComment.content,
        likes: 0,
        repliesCount: 0,
        createdAt: createdComment.createdAt,
        author: author
          ? {
            id: author._id,
            name: author.name,
            avatar: author.avatar,
            isVerified: author.isVerified,
          }
          : null,
        replies: [],
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Add comment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
