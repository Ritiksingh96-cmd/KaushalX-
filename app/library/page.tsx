"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Clock, BookOpen, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for library content
const libraryContent = [
    {
        id: 1,
        title: "Introduction to Blockchain & Crypto",
        description: "Learn the fundamentals of blockchain technology and how cryptocurrencies work.",
        thumbnail: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
        duration: "15:30",
        category: "Crypto",
        level: "Beginner",
        views: "1.2k",
        url: "https://www.youtube.com/watch?v=SSo_EIwHSd4" // Example placeholder
    },
    {
        id: 2,
        title: "Mastering React.js for Beginners",
        description: "A complete guide to building modern web applications with React.",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        duration: "45:00",
        category: "Development",
        level: "Intermediate",
        views: "3.5k",
        url: "#"
    },
    {
        id: 3,
        title: "Digital Marketing Strategies 2024",
        description: "Top strategies to grow your brand online in the current market.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        duration: "22:15",
        category: "Marketing",
        level: "Beginner",
        views: "850",
        url: "#"
    },
    {
        id: 4,
        title: "Smart Contract Development with Solidity",
        description: "Write your first smart contract on Ethereum using Solidity.",
        thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
        duration: "30:45",
        category: "Crypto",
        level: "Advanced",
        views: "2.1k",
        url: "#"
    },
    {
        id: 5,
        title: "Graphic Design Principles",
        description: "Understand color theory, typography, and layout design.",
        thumbnail: "https://images.unsplash.com/photo-1626785774573-4b7993125486?w=800&q=80",
        duration: "18:20",
        category: "Design",
        level: "Beginner",
        views: "1.5k",
        url: "#"
    },
    {
        id: 6,
        title: "Advanced Python Programming",
        description: "Deep dive into Python features like decorators, generators, and more.",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
        duration: "55:10",
        category: "Development",
        level: "Advanced",
        views: "4.2k",
        url: "#"
    }
];

export default function LibraryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Crypto", "Development", "Design", "Marketing"];

    const filteredContent = libraryContent.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                            Learning Library
                        </h1>
                        <p className="text-gray-400 mt-2">Access free educational content to boost your skills.</p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Search tutorials..."
                                className="pl-9 bg-white/5 border-white/10 text-white focus:border-purple-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <Tabs defaultValue="All" className="w-full" onValueChange={setSelectedCategory}>
                    <TabsList className="bg-white/5 border border-white/10 p-1">
                        {categories.map(category => (
                            <TabsTrigger
                                key={category}
                                value={category}
                                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                            >
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContent.map((item) => (
                        <Card key={item.id} className="glass-panel border-white/10 overflow-hidden hover:border-purple-500/50 transition-all group">
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {item.duration}
                                </div>
                            </div>

                            <CardHeader className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
                                        {item.category}
                                    </Badge>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> {item.views} views
                                    </span>
                                </div>
                                <CardTitle className="text-lg leading-tight text-white group-hover:text-purple-300 transition-colors">
                                    {item.title}
                                </CardTitle>
                                <CardDescription className="text-gray-400 line-clamp-2 mt-2">
                                    {item.description}
                                </CardDescription>
                            </CardHeader>

                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                                    Watch Now
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {filteredContent.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p>No content found matching your criteria.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
