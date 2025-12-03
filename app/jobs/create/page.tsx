"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { toast } from "sonner"

export default function CreateJobPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [budget, setBudget] = useState("")
    const [currency, setCurrency] = useState<"INR" | "ETH" | "MATIC">("INR")
    const [skillInput, setSkillInput] = useState("")
    const [skills, setSkills] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()])
            setSkillInput("")
        }
    }

    const removeSkill = (skill: string) => {
        setSkills(skills.filter((s) => s !== skill))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    budget: parseFloat(budget),
                    currency,
                    skillsRequired: skills,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to create job")
            }

            toast.success("Posted to Skill Shop successfully!")
            router.push("/jobs")
        } catch (error: any) {
            toast.error(error.message || "Failed to post")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-10 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Post to Skill Shop</h1>
                        <p className="text-muted-foreground">Connect with skilled professionals</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Details</CardTitle>
                            <CardDescription>Provide clear information to attract the right candidates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Need help with React development"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the requirements, deliverables, and timeline..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Budget</Label>
                                        <Input
                                            id="budget"
                                            type="number"
                                            placeholder="1000"
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select value={currency} onValueChange={(val: any) => setCurrency(val)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INR">INR (₹)</SelectItem>
                                                <SelectItem value="ETH">ETH (Ξ)</SelectItem>
                                                <SelectItem value="MATIC">MATIC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="skills">Required Skills</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="skills"
                                            placeholder="e.g., JavaScript"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                        />
                                        <Button type="button" onClick={addSkill}>Add</Button>
                                    </div>
                                    {skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {skills.map((skill) => (
                                                <Badge key={skill} variant="secondary" className="gap-1">
                                                    {skill}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer"
                                                        onClick={() => removeSkill(skill)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                                        {isSubmitting ? "Posting..." : "Post to Skill Shop"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
