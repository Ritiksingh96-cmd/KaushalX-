"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Message sent successfully! We'll get back to you soon.");
        setIsLoading(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Have questions about KushalX? We're here to help you start your decentralized learning journey.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Email Us</h3>
                                    <p className="text-gray-400">support@kushalx.com</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Call Us</h3>
                                    <p className="text-gray-400">+91 9315908389</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Visit Us</h3>
                                    <p className="text-gray-400">Tech Hub, Bangalore, India</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Contact Form */}
                <Card className="glass-panel border-white/10">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Send a Message</CardTitle>
                        <CardDescription className="text-gray-400">
                            Fill out the form below and our team will respond within 24 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">First Name</label>
                                    <Input required placeholder="John" className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Last Name</label>
                                    <Input required placeholder="Doe" className="bg-black/50 border-white/10 text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <Input required type="email" placeholder="john@example.com" className="bg-black/50 border-white/10 text-white" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Subject</label>
                                <Input required placeholder="How can we help?" className="bg-black/50 border-white/10 text-white" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Message</label>
                                <Textarea required placeholder="Tell us more about your inquiry..." className="min-h-[150px] bg-black/50 border-white/10 text-white" />
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                                {isLoading ? "Sending..." : (
                                    <>
                                        Send Message <Send className="ml-2 w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
