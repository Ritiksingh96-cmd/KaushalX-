"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Settings } from "lucide-react"

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  participant: {
    name: string
    avatar: string
    role: "student" | "instructor"
  }
  callType: "incoming" | "outgoing" | "active"
}

export function VideoCallModal({ isOpen, onClose, participant, callType }: VideoCallModalProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState("00:00")

  const handleAcceptCall = () => {
    // In real app, accept the video call
    console.log("Call accepted")
  }

  const handleRejectCall = () => {
    // In real app, reject the video call
    onClose()
  }

  const handleEndCall = () => {
    // In real app, end the video call
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        <div className="relative h-full bg-black rounded-lg overflow-hidden">
          {/* Video Area */}
          <div className="relative h-full">
            {callType === "active" ? (
              <div className="h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-medium mb-2">{participant.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {participant.role === "instructor" ? "Instructor" : "Student"}
                  </Badge>
                  <p className="text-sm text-gray-400">Call Duration: {callDuration}</p>
                </div>
              </div>
            ) : (
              <div className="h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <div className="text-center text-white">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-medium mb-2">{participant.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {participant.role === "instructor" ? "Instructor" : "Student"}
                  </Badge>
                  <p className="text-sm opacity-80">{callType === "incoming" ? "Incoming call..." : "Calling..."}</p>
                </div>
              </div>
            )}

            {/* Self Video (Picture-in-Picture) */}
            {callType === "active" && (
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-white/20 overflow-hidden">
                <div className="h-full flex items-center justify-center text-white text-sm">
                  {isVideoEnabled ? "Your Video" : "Video Off"}
                </div>
              </div>
            )}

            {/* Call Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                {callType === "active" ? (
                  <>
                    <Button
                      size="sm"
                      variant={isAudioEnabled ? "secondary" : "destructive"}
                      className="rounded-full w-12 h-12"
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    >
                      {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>

                    <Button
                      size="sm"
                      variant={isVideoEnabled ? "secondary" : "destructive"}
                      className="rounded-full w-12 h-12"
                      onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    >
                      {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>

                    <Button size="sm" variant="outline" className="rounded-full w-12 h-12 bg-transparent">
                      <Settings className="h-5 w-5" />
                    </Button>

                    <Button size="sm" variant="destructive" className="rounded-full w-12 h-12" onClick={handleEndCall}>
                      <PhoneOff className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    {callType === "incoming" && (
                      <>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-full w-12 h-12"
                          onClick={handleRejectCall}
                        >
                          <PhoneOff className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600"
                          onClick={handleAcceptCall}
                        >
                          <Phone className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                    {callType === "outgoing" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-full w-12 h-12"
                        onClick={handleRejectCall}
                      >
                        <PhoneOff className="h-5 w-5" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Call Status */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                {callType === "active" ? "Connected" : callType === "incoming" ? "Incoming Call" : "Connecting..."}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
