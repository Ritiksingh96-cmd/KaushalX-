"use client"

import { useState, useEffect } from "react"
import { JobCard } from "@/components/jobs/job-card"
import { WalletBalance } from "@/components/crypto/wallet-balance"
import { SkillSOSList } from "@/components/jobs/skill-sos-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { Job } from "@/lib/models/Job"

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("/api/jobs")
                const data = await res.json()
                setJobs(data.jobs || [])
            } catch (error) {
                console.error("Failed to fetch jobs:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchJobs()
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4">
                <WalletBalance />

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Trade Center</h1>
                        <p className="text-muted-foreground">Exchange skills, find work, or get urgent help</p>
                    </div>
                    <Link href="/jobs/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Post Opportunity
                        </Button>
                    </Link>
                </div>

                <Tabs defaultValue="opportunities" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                        <TabsTrigger value="sos">Skill SOS</TabsTrigger>
                    </TabsList>

                    <TabsContent value="opportunities" className="space-y-6">
                        {isLoading ? (
                            <div className="text-center py-12 text-muted-foreground">Loading...</div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">No opportunities posted yet</p>
                                <Link href="/jobs/create">
                                    <Button>Post the first opportunity</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {jobs.map((job) => (
                                    <JobCard key={job._id?.toString()} job={job} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="sos">
                        <SkillSOSList />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
