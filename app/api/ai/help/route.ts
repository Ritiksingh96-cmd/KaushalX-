import { auth } from "@/lib/auth"

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const helpRequestSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  context: z.string().optional(),
  userLevel: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
})

const helpResponses = {
  "skill matching": {
    beginner:
      "Welcome to TamuPro's skill matching! Start by completing your profile with your current skills and what you want to learn. Then visit the Dashboard > Matches to see compatible learning partners. Our algorithm considers your skill level, location, and learning preferences to find the best matches.",
    intermediate:
      "To optimize your skill matching, make sure your profile showcases your expertise areas and learning goals clearly. Use the Skill SOS feature for immediate help, and don't forget to engage with the community through comments and messages to build your reputation score.",
    advanced:
      "As an advanced user, you can mentor beginners while learning new skills. Your high reputation score will attract quality matches. Consider creating educational videos to share your expertise and earn additional badges that make you more visible to potential learning partners.",
  },
  badges: {
    beginner:
      "Badges are your achievement milestones on TamuPro! Start with basic badges like 'First Login', 'Profile Complete', and 'First Match'. Each badge you earn increases your reputation and makes you more attractive to potential learning partners. Check your Achievements page to see all available badges.",
    intermediate:
      "Focus on consistency badges like 'Weekly Learner' and community badges like 'Helpful Mentor'. Upload educational content to earn 'Content Creator' badges, and maintain high ratings to unlock premium badges. These show your commitment to the learning community.",
    advanced:
      "Aim for rare badges like 'Master Mentor', 'Community Leader', and 'Expert Contributor'. These require sustained excellence and community contribution. Your badge collection becomes a powerful signal of your expertise and reliability as a learning partner.",
  },
  "video upload": {
    beginner:
      "Sharing knowledge through videos is easy! Go to Videos > Upload, drag and drop your video file, add a clear title and description with relevant tags. Our system automatically processes videos for optimal viewing. Start with short, focused tutorials on topics you know well.",
    intermediate:
      "Create structured video series on complex topics. Use good lighting and clear audio for better engagement. Add detailed descriptions and use relevant tags to help others find your content. Engage with comments to build a following and earn reputation points.",
    advanced:
      "Develop comprehensive learning paths through video series. Use advanced features like chapters and interactive elements. Your videos can become valuable resources that earn you ongoing reputation and attract high-quality learning partnerships.",
  },
  messaging: {
    beginner:
      "Connect with other learners through our messaging system! Click on any user's profile and select 'Send Message' to start a conversation. Be respectful, introduce yourself, and clearly state what you're looking to learn or teach.",
    intermediate:
      "Use messaging to coordinate learning sessions, share resources, and provide feedback. Create group conversations for collaborative learning projects. Remember that good communication builds strong learning relationships and improves your reputation.",
    advanced:
      "Leverage messaging for mentoring relationships and professional networking. Share advanced resources, coordinate complex projects, and provide detailed feedback. Your communication quality directly impacts your reputation and matching success.",
  },
  profile: {
    beginner:
      "A complete profile is crucial for good matches! Add your skills, learning goals, location, and availability. Upload a professional photo and write a brief bio about your learning journey. The more complete your profile, the better your matches will be.",
    intermediate:
      "Optimize your profile by showcasing specific achievements, adding portfolio links, and regularly updating your skill levels. Use keywords that other learners might search for. A well-crafted profile attracts quality learning partners.",
    advanced:
      "Your profile should reflect your expertise and mentoring capabilities. Include detailed experience, certifications, and examples of your work. Regular updates and engagement metrics make your profile more attractive to serious learners.",
  },
  default: {
    beginner:
      "Welcome to TamuPro! This platform connects you with learning partners who complement your skills. Start by completing your profile, then explore the matching system to find compatible learners. Don't hesitate to reach out to potential partners!",
    intermediate:
      "You're making great progress! Focus on building meaningful learning relationships, contributing to the community through videos and comments, and earning badges that showcase your growth. Consistency is key to success on TamuPro.",
    advanced:
      "As an experienced user, consider mentoring others while continuing your own learning journey. Your expertise is valuable to the community - share it through videos, detailed profile information, and helpful interactions with other learners.",
  },
}

function getHelpResponse(topic: string, userLevel: string, context?: string): string {
  const normalizedTopic = topic.toLowerCase()

  // Find matching topic
  for (const [key, responses] of Object.entries(helpResponses)) {
    if (normalizedTopic.includes(key)) {
      return responses[userLevel as keyof typeof responses] || responses.beginner
    }
  }

  // Default response based on user level
  return helpResponses.default[userLevel as keyof typeof helpResponses.default] || helpResponses.default.beginner
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { topic, context, userLevel } = helpRequestSchema.parse(body)

    const response = getHelpResponse(topic, userLevel, context)

    return NextResponse.json({
      response,
      topic,
      userLevel,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("AI Help error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
