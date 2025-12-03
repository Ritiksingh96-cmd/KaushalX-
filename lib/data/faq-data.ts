export interface FAQItem {
  id: string
  question: string
  answer: string
  category: "getting-started" | "credits" | "matching" | "features" | "troubleshooting"
  keywords: string[]
  priority: number
}

export const faqData: FAQItem[] = [
  // Getting Started
  {
    id: "gs-1",
    question: "How do I get started on TamuPro?",
    answer:
      "Welcome to TamuPro! Here's how to get started:\n\n1. **Complete your profile** - Add your skills, bio, and location\n2. **Set your learning goals** - Tell us what skills you want to learn\n3. **Find matches** - Browse potential skill partners in the Matches section\n4. **Start connecting** - Send messages and schedule learning sessions\n5. **Earn credits** - Get rewarded for teaching and learning\n\nVisit your Dashboard to see personalized recommendations and track your progress!",
    category: "getting-started",
    keywords: ["start", "begin", "new", "setup", "onboarding", "first time"],
    priority: 10,
  },
  {
    id: "gs-2",
    question: "How do I find skill partners?",
    answer:
      "Finding the perfect skill partner is easy:\n\n1. **Go to Matches** - Click 'Matches' in the navigation\n2. **Use filters** - Filter by skill, location, experience level\n3. **Browse profiles** - Check compatibility scores and user profiles\n4. **Send connection requests** - Reach out to interesting matches\n5. **Schedule sessions** - Use our built-in messaging to coordinate\n\nTip: Users with higher compatibility scores are more likely to be great learning partners!",
    category: "matching",
    keywords: ["find", "partner", "match", "connect", "skill exchange", "learning partner"],
    priority: 9,
  },
  {
    id: "gs-3",
    question: "What skills can I learn or teach?",
    answer:
      "TamuPro supports a wide range of skills across multiple categories:\n\n**Technology**: Programming, Web Development, Data Science, AI/ML, Cybersecurity\n**Design**: UI/UX, Graphic Design, Video Editing, Photography\n**Business**: Marketing, Sales, Project Management, Entrepreneurship\n**Languages**: English, Spanish, French, Mandarin, and many more\n**Creative**: Music, Writing, Art, Cooking, Crafts\n**Professional**: Public Speaking, Leadership, Negotiation\n\nDon't see your skill? You can add custom skills to your profile!",
    category: "getting-started",
    keywords: ["skills", "learn", "teach", "categories", "subjects", "topics"],
    priority: 8,
  },

  // Credits System
  {
    id: "cr-1",
    question: "How do I earn credits?",
    answer:
      "There are several ways to earn credits on TamuPro:\n\n**Teaching Sessions** (15-50 credits):\n- Teach skills to other users\n- Longer sessions = more credits\n- Get 50% bonus for teaching\n\n**Learning Sessions** (10-30 credits):\n- Complete learning sessions\n- Finish with good ratings\n\n**Community Activities** (5-20 credits):\n- Help in forums\n- Answer questions\n- Share resources\n\n**Achievements** (50-100 credits):\n- Complete skill verifications\n- Earn badges\n- Reach milestones\n\n**Daily Bonuses** (5-25 credits):\n- Daily check-ins\n- Streak bonuses\n\n**Referrals** (100 credits):\n- Invite friends who join\n\nCheck your Wallet to see all earning opportunities!",
    category: "credits",
    keywords: ["earn", "credits", "points", "rewards", "money", "teaching", "learning"],
    priority: 9,
  },
  {
    id: "cr-2",
    question: "How can I convert credits to crypto?",
    answer:
      "Converting credits to cryptocurrency is simple:\n\n**Requirements**:\n- Minimum 100 credits\n- Valid wallet address\n\n**Supported Cryptocurrencies**:\n- Bitcoin (BTC)\n- Ethereum (ETH)\n- Tether (USDT)\n- Binance Coin (BNB)\n\n**How to Convert**:\n1. Go to your **Wallet**\n2. Click **Convert to Crypto** tab\n3. Enter credits amount\n4. Select cryptocurrency\n5. Add your wallet address\n6. Confirm conversion\n\n**Processing Time**: 24-48 hours\n**Conversion Rates**: Updated in real-time\n\nNote: Conversions are irreversible, so double-check your wallet address!",
    category: "credits",
    keywords: ["convert", "crypto", "cryptocurrency", "bitcoin", "ethereum", "wallet", "cash out"],
    priority: 8,
  },
  {
    id: "cr-3",
    question: "What can I do with credits?",
    answer:
      "Credits are TamuPro's currency with multiple uses:\n\n**Convert to Crypto**:\n- Bitcoin, Ethereum, USDT, BNB\n- Minimum 100 credits\n\n**Platform Features** (Coming Soon):\n- Premium matching\n- Advanced analytics\n- Priority support\n- Exclusive content\n\n**Marketplace** (Coming Soon):\n- Buy learning materials\n- Access premium courses\n- Hire expert tutors\n\n**Donations**:\n- Support community projects\n- Help other learners\n\nCredits never expire and your balance is always visible in the header!",
    category: "credits",
    keywords: ["use", "spend", "credits", "features", "premium", "marketplace"],
    priority: 7,
  },

  // Features
  {
    id: "ft-1",
    question: "How do I upload and share videos?",
    answer:
      "Sharing educational videos helps the community and earns you credits:\n\n**Upload Process**:\n1. Go to **Videos** → **Upload**\n2. Select your video file\n3. Add title and description\n4. Choose skill tags\n5. Set thumbnail (optional)\n6. Publish to community\n\n**Video Guidelines**:\n- Educational content only\n- Max 30 minutes length\n- Good audio/video quality\n- Include skill demonstrations\n\n**Benefits**:\n- Earn credits from views\n- Build your reputation\n- Help other learners\n- Showcase expertise\n\nPopular videos can earn significant credits and boost your profile visibility!",
    category: "features",
    keywords: ["video", "upload", "share", "content", "tutorial", "record"],
    priority: 7,
  },
  {
    id: "ft-2",
    question: "How does messaging work?",
    answer:
      "TamuPro's messaging system helps you connect with skill partners:\n\n**Starting Conversations**:\n- Click 'Message' on any user profile\n- Send connection requests with introductions\n- Be specific about what you want to learn/teach\n\n**Message Features**:\n- Real-time chat\n- File sharing\n- Session scheduling\n- Video call integration (coming soon)\n\n**Best Practices**:\n- Be respectful and professional\n- Clearly state your learning goals\n- Suggest specific meeting times\n- Follow up after sessions\n\n**Safety**:\n- Report inappropriate messages\n- Block users if needed\n- Keep initial meetings in public spaces\n\nGood communication leads to better learning partnerships!",
    category: "features",
    keywords: ["message", "chat", "communication", "contact", "talk", "conversation"],
    priority: 8,
  },
  {
    id: "ft-3",
    question: "What are badges and how do I earn them?",
    answer:
      "Badges recognize your achievements and expertise on TamuPro:\n\n**Badge Categories**:\n\n**Skill Badges**:\n- Complete skill assessments\n- Get verified by experts\n- Teach specific number of sessions\n\n**Community Badges**:\n- Help others in forums\n- Share valuable resources\n- Maintain high ratings\n\n**Achievement Badges**:\n- Reach credit milestones\n- Complete learning streaks\n- Earn top ratings\n\n**Special Badges**:\n- Early adopter\n- Community leader\n- Expert contributor\n\n**Benefits**:\n- Increased profile visibility\n- Higher match priority\n- Bonus credits\n- Community recognition\n\nCheck your Profile → Badges to see available badges and progress!",
    category: "features",
    keywords: ["badges", "achievements", "awards", "recognition", "earn", "unlock"],
    priority: 6,
  },

  // Troubleshooting
  {
    id: "tr-1",
    question: "I'm not getting any matches. What should I do?",
    answer:
      "If you're not getting matches, try these solutions:\n\n**Profile Optimization**:\n- Complete all profile sections\n- Add a clear profile photo\n- Write a detailed bio\n- List specific skills you offer/want\n\n**Skill Settings**:\n- Add more skills to your profile\n- Be specific (e.g., 'React.js' vs 'Programming')\n- Update your experience levels\n- Set realistic availability\n\n**Activity Boost**:\n- Be active on the platform\n- Participate in forums\n- Upload videos or content\n- Respond to messages quickly\n\n**Location & Preferences**:\n- Check your location settings\n- Expand your search radius\n- Consider online-only sessions\n\nStill having issues? Contact our support team for personalized help!",
    category: "troubleshooting",
    keywords: ["no matches", "not working", "no results", "empty", "fix", "help"],
    priority: 8,
  },
  {
    id: "tr-2",
    question: "How do I report inappropriate behavior?",
    answer:
      "Your safety is our priority. Here's how to report issues:\n\n**Reporting Options**:\n\n**In Messages**:\n- Click the menu (⋯) in any conversation\n- Select 'Report User'\n- Choose reason and add details\n\n**On Profiles**:\n- Click 'Report' button on user profiles\n- Select appropriate category\n- Provide specific examples\n\n**In Forums**:\n- Use 'Report Post' on inappropriate content\n- Flag spam or offensive material\n\n**What We Review**:\n- Harassment or bullying\n- Inappropriate content\n- Spam or scams\n- Fake profiles\n- Violation of community guidelines\n\n**Response Time**: 24-48 hours\n**Action Taken**: Warnings, suspensions, or permanent bans\n\nYou can also block users immediately for your safety.",
    category: "troubleshooting",
    keywords: ["report", "inappropriate", "harassment", "spam", "safety", "block", "abuse"],
    priority: 9,
  },
  {
    id: "tr-3",
    question: "My credits are not showing correctly",
    answer:
      "If your credit balance seems incorrect:\n\n**Check Transaction History**:\n1. Go to **Wallet** → **Transaction History**\n2. Review recent transactions\n3. Look for pending or failed transactions\n\n**Common Issues**:\n\n**Delayed Updates**:\n- Credits may take a few minutes to appear\n- Refresh your browser\n- Check again in 5-10 minutes\n\n**Session Credits**:\n- Credits awarded after session completion\n- Both parties must confirm the session\n- May require rating/feedback\n\n**Conversion Issues**:\n- Check conversion status in Wallet\n- Pending conversions reduce available balance\n- Failed conversions are automatically refunded\n\n**Still Missing Credits?**:\n- Screenshot your transaction history\n- Note the specific session or activity\n- Contact support with details\n\nWe'll investigate and resolve credit discrepancies within 24 hours!",
    category: "troubleshooting",
    keywords: ["credits", "missing", "wrong", "balance", "not showing", "error", "transaction"],
    priority: 7,
  },
]

export function findRelevantFAQs(query: string, limit = 3): FAQItem[] {
  const queryLower = query.toLowerCase()
  const words = queryLower.split(" ").filter((word) => word.length > 2)

  const scoredFAQs = faqData.map((faq) => {
    let score = 0

    // Check question match
    if (faq.question.toLowerCase().includes(queryLower)) {
      score += 10
    }

    // Check keyword matches
    faq.keywords.forEach((keyword) => {
      if (queryLower.includes(keyword)) {
        score += 5
      }
    })

    // Check individual word matches
    words.forEach((word) => {
      if (
        faq.question.toLowerCase().includes(word) ||
        faq.answer.toLowerCase().includes(word) ||
        faq.keywords.some((k) => k.includes(word))
      ) {
        score += 1
      }
    })

    // Add priority bonus
    score += faq.priority

    return { ...faq, score }
  })

  return scoredFAQs
    .filter((faq) => faq.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function getFAQsByCategory(category: FAQItem["category"]): FAQItem[] {
  return faqData.filter((faq) => faq.category === category)
}

export function getAllFAQs(): FAQItem[] {
  return faqData.sort((a, b) => b.priority - a.priority)
}
