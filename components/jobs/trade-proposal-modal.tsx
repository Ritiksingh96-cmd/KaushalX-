"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRightLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface TradeProposalModalProps {
    isOpen: boolean
    onClose: () => void
    jobTitle: string
    jobOwner: string
}

export function TradeProposalModal({ isOpen, onClose, jobTitle, jobOwner }: TradeProposalModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [offeredSkill, setOfferedSkill] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsLoading(false)
        toast.success(`Trade proposal sent to ${jobOwner}!`)
        onClose()
        setOfferedSkill("")
        setMessage("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="h-5 w-5 text-primary" />
                        Propose Skill Trade
                    </DialogTitle>
                    <DialogDescription>
                        Offer your skills in exchange for <strong>{jobTitle}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="skill">Skill you offer</Label>
                            <Input
                                id="skill"
                                placeholder="e.g. Graphic Design, Python..."
                                value={offeredSkill}
                                onChange={(e) => setOfferedSkill(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message to {jobOwner}</Label>
                            <Textarea
                                id="message"
                                placeholder="Describe what you can do..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Proposal"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
