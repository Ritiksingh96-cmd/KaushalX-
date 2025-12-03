// File: app/api/ai/chat/route.ts

import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamText, type CoreMessage } from "ai"
import { findRelevantFAQs } from "@/lib/data/faq-data"

export const maxDuration = 30

// Custom rule-based response function
function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  const relevantFAQs = findRelevantFAQs(message, 1)
  if (relevantFAQs.length > 0) {
    const faq = relevantFAQs[0]
    return `${faq.answer}\n\n💡 **Need more help?**\n• Check our Help Center\n• Contact support\n\nIs there anything else I can help you with?`
  }

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return `Hello! 👋 I'm your KaushalX AI Assistant.\n\n**I can help you with:**\n• Finding skill partners\n• How the crypto system works\n• Platform features & navigation\n\nHow can I assist you today?`
  }

  if (lowerMessage.includes("credit") || lowerMessage.includes("earn") || lowerMessage.includes("money") || lowerMessage.includes("crypto")) {
    return `💰 **Crypto is KaushalX's reward system!**\n\n**How to earn:**\n• Teaching sessions\n• Completing learning goals\n• Community contributions\n• Daily bonuses & Referrals\n\nVisit your **Wallet** to see all earning opportunities!\n\nWant to know more about a specific earning method?`
  }

  if (lowerMessage.includes("match") || lowerMessage.includes("partner") || lowerMessage.includes("find")) {
    return `🤝 **Finding the perfect skill partner is easy!**\n\n**Steps:**\n1. Complete your profile with skills\n2. Go to the **Matches** section\n3. Use filters for skill, location, etc.\n4. Send a friendly message to connect!\n\n**Pro tip:** A complete profile with a clear photo gets the best matches!\n\nNeed help with your profile?`
  }

  if (lowerMessage.includes("testnet") || lowerMessage.includes("test transaction") || lowerMessage.includes("faucet")) {
    return `🧪 **Testnet Mode Information**\n\n**What is testnet?**\nTestnet allows you to test crypto transactions without using real money!\n\n**How to get test tokens:**\n• Visit our Wallet page\n• Click on "Get Test Tokens"\n• Use the faucet links provided\n\n**Supported testnets:**\n• Ethereum Sepolia\n• Polygon Mumbai\n\nTest transactions are free and safe to experiment with!`
  }

  return "DEFAULT_FALLBACK"
}

// Helper function to create a text stream response
function createTextStream(text: string): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text))
      controller.close()
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content
    const lastMessageText = typeof lastMessage === 'string' ? lastMessage : ''

    // 1. Try rule-based response first
    const customResponse = getAIResponse(lastMessageText)

    // 2. If we got a specific answer, return it
    if (customResponse !== "DEFAULT_FALLBACK") {
      return createTextStream(customResponse)
    }

    // 3. Check if Google API key is configured
    const apiKey = process.env.GOOGLE_API_KEY
    const isInvalidKey = !apiKey || apiKey === "your-google-gemini-api-key-here" || apiKey === ""

    if (isInvalidKey) {
      console.warn("Google API Key missing or invalid. Using fallback response.")
      // Fallback response to ensure chatbot always replies
      const fallbackResponse = `I see you're asking about "${lastMessageText}". \n\nSince I'm currently in offline mode, I can tell you that:\n• You can find skills in the Marketplace.\n• You can earn tokens by teaching.\n• Check your Dashboard for wallet balance.\n\nPlease contact support if you need advanced AI assistance.`
      return createTextStream(fallbackResponse)
    }

    // 4. Call Gemini API for generative response
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    })

    const result = await streamText({
      model: google("models/gemini-1.5-flash-latest"),
      system: `You are KaushalX AI, a friendly and encouraging assistant for the KaushalX skill exchange platform.
               Your goal is to help users navigate the platform, find skill partners, and understand how to earn crypto.
               The platform supports testnet transactions for testing crypto payments without real money.
               Keep your answers concise, positive, and focused on the KaushalX platform.`,
      messages,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("AI Chat error:", error)

    const errorMessage = `I apologize, but I'm experiencing technical difficulties right now. 😔\n\nYou can still:\n• Browse the Help Center\n• Contact our support team\n• Check the FAQ section\n\nPlease try again in a moment, or reach out to support if the issue persists.`

    return createTextStream(errorMessage)
  }
}