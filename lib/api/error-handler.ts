import { NextResponse } from "next/server"
import { ZodError } from "zod"

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export function handleAPIError(error: unknown) {
  console.error("API Error:", error)

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation Error",
        message: "Invalid request data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 },
    )
  }

  // Custom API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.name,
        message: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    )
  }

  // Database errors
  if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
    return NextResponse.json(
      {
        error: "Database Connection Error",
        message: "Unable to connect to database",
      },
      { status: 503 },
    )
  }

  // Generic server errors
  return NextResponse.json(
    {
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    },
    { status: 500 },
  )
}
