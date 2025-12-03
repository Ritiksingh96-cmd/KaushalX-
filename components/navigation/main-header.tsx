"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  Menu,
  X,
  Search,
  Bell,
  MessageCircle,
  Trophy,
  User,
  Settings,
  LogOut,
  Upload,
  Users,
  Zap,
  HelpCircle,
  Coins,
  Wallet,
  BookOpen,
  Mail,
  Home,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"

const publicNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Marketplace", href: "/marketplace", icon: Users },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Contact", href: "/contact", icon: Mail },
]

const privateNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Explore", href: "/community", icon: Globe },
  { name: "Trade", href: "/jobs", icon: Users },
  { name: "Upload", href: "/library/upload", icon: Upload },
  { name: "Marketplace", href: "/marketplace", icon: Users },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Crypto", href: "/crypto", icon: Wallet },
]

export function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { data: session, status } = useSession({ required: false })
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    const searchJobs = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/jobs`)
        if (response.ok) {
          const data = await response.json()
          // Filter client-side since API doesn't support search yet
          const filtered = data.jobs.filter((job: any) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.skillsRequired.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          setSearchResults(filtered)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchJobs, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSignOut = () => {
    try {
      signOut({ callbackUrl: "/" })
    } catch (error) {
      console.log("Sign out error:", error);
    }
  }

  const navigation = hasMounted && session && status === "authenticated" ? privateNavigation : publicNavigation

  // Split navigation for desktop layout
  const leftNav = navigation.filter(item => ["Dashboard", "Explore", "Trade", "Marketplace", "Library", "Home", "Contact"].includes(item.name))
  const rightNavActions = navigation.filter(item => ["Upload", "Crypto"].includes(item.name))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Left Side: Logo + Main Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center space-x-5">
            {leftNav.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative mx-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skills, gigs, or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full bg-secondary/50 border-transparent focus:border-primary transition-all focus:bg-background shadow-sm"
          />
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-md shadow-lg z-50 overflow-hidden">
              <div className="p-2">
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">Posted Skills</h3>
                {searchResults.map((job) => (
                  <Link
                    key={job._id}
                    href={`/jobs/${job._id}`}
                    className="block px-2 py-2 hover:bg-secondary/50 rounded-md transition-colors"
                    onClick={() => {
                      setSearchQuery("")
                      setSearchResults([])
                    }}
                  >
                    <div className="text-sm font-medium">{job.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {job.skillsRequired.join(", ")}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search Toggle (Optional, if we want to show search icon on mobile instead of full bar) */}

          {hasMounted && session && status === "authenticated" ? (
            <>
              {/* Action Buttons (Upload, Crypto) - Moved to Dashboard/Pages
              <div className="hidden md:flex items-center space-x-2 mr-2">
                 <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
                    <Link href="/crypto">
                        <Wallet className="h-4 w-4 mr-2" />
                        Crypto
                    </Link>
                 </Button>
                 <Button size="sm" asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-md shadow-purple-500/20">
                    <Link href="/library/upload">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                    </Link>
                 </Button>
              </div>
              */}

              <div className="hidden md:flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">{(session.user as any)?.skillCredits || 0}</span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center bg-red-500">3</Badge>
              </Button>

              {/* Messages */}
              <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary">
                <Link href="/chat">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all ml-1">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                      <div className="flex items-center space-x-1 text-xs text-primary font-medium mt-1">
                        <Coins className="h-3 w-3" />
                        <span>{(session.user as any)?.skillCredits || 0} Credits</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/earnings" className="flex items-center cursor-pointer">
                      <Coins className="mr-2 h-4 w-4" />
                      <span>Earnings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/achievements" className="flex items-center cursor-pointer">
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>Achievements</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/auth/signin">Log in</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-md shadow-purple-500/20">
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top-5">
          <div className="container py-4 space-y-2">
            {hasMounted && session && status === "authenticated" && (
              <div className="flex items-center justify-between bg-secondary/50 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-primary font-bold text-sm">
                  <Coins className="h-4 w-4" />
                  <span>{(session.user as any)?.skillCredits}</span>
                </div>
              </div>
            )}

            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>

            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}

            {(!hasMounted || !session || status !== "authenticated") && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/signin">Log in</Link>
                </Button>
                <Button asChild className="w-full bg-primary text-primary-foreground">
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
