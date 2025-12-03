"use client";
// import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  MessageCircle,
  Star,
  CheckCircle,
  Coins,
  TrendingUp,
  Shield,
  Globe,
  ArrowRight,
  Zap,
  BookOpen,
  Brain,
  Trophy,
  Repeat,
} from "lucide-react";
import HeroSceneLoader from "@/components/3d/hero-scene-loader";

const heroStats = [
  { label: "Active Users", value: "10K+" },
  { label: "Skills Listed", value: "500+" },
  { label: "Total Earned", value: "$2M+" },
  { label: "Countries", value: "45+" },
];

const trustLogos = ["Polygon Labs", "Chainlink", "ETHIndia", "Devfolio", "Supabase"];

const experienceBadges = [
  {
    title: "Curated Mentors",
    description: "Every expert is verified on-chain and rated by learners.",
    icon: Users,
    accent: "from-purple-500/20 via-transparent to-transparent",
  },
  {
    title: "Live Pods",
    description: "Micro learning sprints with accountability partners.",
    icon: BookOpen,
    accent: "from-cyan-500/20 via-transparent to-transparent",
  },
  {
    title: "Reputation Tokens",
    description: "Badges you earn are soul-bound and travel with you.",
    icon: Star,
    accent: "from-amber-400/20 via-transparent to-transparent",
  },
];

const journeySteps = [
  { icon: Zap, title: "Connect", desc: "Link your wallet securely" },
  { icon: Users, title: "Profile", desc: "List your expertise" },
  { icon: Globe, title: "Match", desc: "Find global students" },
  { icon: Coins, title: "Earn", desc: "Get paid in crypto" },
];

const testimonials = [
  {
    quote: "I swapped my UI skills for solidity mentoring and doubled my freelance income within weeks.",
    name: "Neha Prasad",
    role: "Product Designer",
    result: "+68% booked sessions",
  },
  {
    quote: "The gamified badges made our internal upskilling program actually stick.",
    name: "Luis Romero",
    role: "L&D Lead, Finverse",
    result: "4.9/5 team satisfaction",
  },
  {
    quote: "Escrowed payments removed all the awkward DMs about invoices. It's just smooth now.",
    name: "Maya Patel",
    role: "Web3 Coach",
    result: "$12k secured payouts",
  },
];

export default function HomePage() {
  // Temporarily disable session check to allow home page to load
  // const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
  //       <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  // if (session) {
  //   if (typeof window !== "undefined") {
  //     window.location.href = "/dashboard";
  //   }
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Background Effects - Adaptive for Light/Dark */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background dark:from-purple-900/40 dark:via-black dark:to-black" />
        <Suspense fallback={null}>
          <div className="absolute inset-0 mx-auto hidden max-w-5xl opacity-30 pointer-events-none lg:block">
            <HeroSceneLoader />
          </div>
        </Suspense>

        <div className="relative z-10 container px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted/60 border border-border/60 backdrop-blur-md animate-fade-in-up">
            <Badge variant="outline" className="rounded-full border-primary/40 bg-primary/10 text-primary">
              Beta v2
            </Badge>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live on Sepolia Testnet
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight animate-fade-in-up delay-100">
            Skill Exchange <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-500 dark:to-cyan-400">
              Reimagined.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            The decentralized platform where your expertise becomes your currency.
            <span className="block mt-2 text-foreground font-medium">AI-Matched. Gamified. Secure.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fade-in-up delay-300">
            <Button
              size="lg"
              asChild
              className="h-14 px-8 text-lg rounded-full transition-transform hover:scale-105 font-bold shadow-lg shadow-primary/25"
            >
              <Link href="/auth/signup" className="flex items-center gap-2">
                Start Earning <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-8 text-lg rounded-full border-border bg-background/50 backdrop-blur-sm hover:bg-accent transition-all"
            >
              <Link href="/library">Browse Library</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="h-14 px-8 text-lg rounded-full text-muted-foreground hover:text-foreground"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Talk to Team <MessageCircle className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {experienceBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <Card key={badge.title} className="border border-border/60 bg-card/50 backdrop-blur-xl shadow-lg shadow-primary/5">
                  <CardContent className="p-6 space-y-4 text-left">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${badge.accent} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm tracking-widest uppercase text-muted-foreground">Why it matters</p>
                      <h3 className="text-2xl font-semibold mt-1">{badge.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{badge.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="w-full border-y border-border bg-muted/30 backdrop-blur-md mt-20 py-8 relative z-10">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-border/60 bg-card/20 backdrop-blur-md">
        <div className="container text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Trusted by builders at</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            {trustLogos.map((logo) => (
              <span key={logo} className="text-sm md:text-base font-semibold tracking-wide px-4 py-2 rounded-full bg-muted/60 border border-border/60">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars Section - The "Whole Vision" */}
      <section className="py-32 relative bg-muted/10">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Future of Skill Swapping</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've combined the best of blockchain, AI, and gamification to create a seamless learning ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: AI Matching */}
            <div className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Matching</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced algorithms analyze your skills and learning goals to connect you with the perfect peer. No more endless searching—get matched instantly.
              </p>
            </div>

            {/* Pillar 2: Credits & Barter */}
            <div className="group p-8 rounded-3xl bg-card border border-border hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Repeat className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Barter System</h3>
              <p className="text-muted-foreground leading-relaxed">
                Exchange skills directly or use our universal credits. Teach a guitar lesson to earn credits, then use them to learn coding. Flexible, fair, and decentralized.
              </p>
            </div>

            {/* Pillar 3: Gamification */}
            <div className="group p-8 rounded-3xl bg-card border border-border hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Gamified Growth</h3>
              <p className="text-muted-foreground leading-relaxed">
                Earn badges, climb leaderboards, and unlock exclusive perks as you teach and learn. Your reputation is verified on-chain, creating a trustless resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Step by Step Flow */}
      <section className="py-32 relative">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Journey Starts Here</h2>
            <p className="text-muted-foreground text-lg">Four simple steps to monetize your skills</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              {journeySteps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.title} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary transition-all duration-300 shadow-lg">
                      <StepIcon className="w-10 h-10 text-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase - Alternating Layout */}
      <section className="py-20 space-y-32 bg-muted/5">
        {/* Feature 1 */}
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-block p-3 rounded-lg bg-green-500/10 text-green-500 mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                Marketplace for <br />
                <span className="text-green-500">Modern Skills</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Forget traditional job boards. Our decentralized marketplace connects you directly with people who need your specific skills. Set your own rates, manage your schedule, and build your reputation on the blockchain.
              </p>
              <ul className="space-y-4 pt-4">
                {['Transparent Pricing', 'Instant Booking', 'Verified Reviews'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80">
                    <CheckCircle className="w-5 h-5 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full" />
              <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/indian-woman-developer.png"
                  alt="Developer working on code"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-white font-medium">Open for work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="container">
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-block p-3 rounded-lg bg-purple-500/10 text-purple-500 mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                Secure Crypto <br />
                <span className="text-purple-500">Payments</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                No more chasing invoices. Payments are held in secure smart contracts and released instantly upon session completion. Earn in ETH, MATIC, or our native KushalX token.
              </p>
              <Button variant="link" className="text-purple-500 p-0 h-auto text-lg hover:text-purple-400">
                Learn about Smart Contracts <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full" />
              <div className="relative bg-card/50 border border-border rounded-3xl p-8 backdrop-blur-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Abstract UI Representation */}
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
                      <Coins className="w-10 h-10 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">+ 500 KSHL</div>
                    <div className="text-sm text-green-500">Payment Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="rounded-full px-6 py-1 border-primary/40 text-primary">
              Social proof
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">Loved by modern learning teams</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real feedback from creators, mentors, and operators using KushalX daily.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="h-full border-border/60 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-6 flex flex-col gap-6">
                  <p className="text-lg leading-relaxed text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <div className="text-sm font-semibold text-primary">{testimonial.result}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-background" />
        <div className="container relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-foreground">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Level Up?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join the community of forward-thinking learners and earners.
            The future of education is decentralized.
          </p>
          <Button
            size="lg"
            asChild
            className="h-16 px-12 text-xl rounded-full transition-all hover:scale-105 font-bold shadow-xl"
          >
            <Link href="/auth/signup">Get Started for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}