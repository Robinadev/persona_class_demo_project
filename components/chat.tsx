"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

type Message = {
  id: number
  text: string
  sender: "user" | "support"
  timestamp: Date
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load messages from local storage
    const storedMessages = localStorage.getItem("chatMessages")
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    } else {
      // If no stored messages, add initial greeting
      const initialMessage: Message = {
        id: Date.now(),
        text: "Hello! How can I assist you today?",
        sender: "support",
        timestamp: new Date(),
      }
      setMessages([initialMessage])
    }
  }, [])

  useEffect(() => {
    // Save messages to local storage
    localStorage.setItem("chatMessages", JSON.stringify(messages))

    // Scroll to bottom on new message
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() === "") return

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate a support response
    setTimeout(
      () => {
        const supportResponse: Message = {
          id: Date.now(),
          text: generateResponse(inputMessage),
          sender: "support",
          timestamp: new Date(),
        }
        setMessages((prevMessages) => [...prevMessages, supportResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
  }

  const generateResponse = (userMessage: string): string => {
    // Simple response generation logic
    const lowercaseMessage = userMessage.toLowerCase()
    if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
      return "Hello! How can I help you today?"
    } else if (lowercaseMessage.includes("balance")) {
      return "To check your balance, please go to the Account Overview section on the dashboard."
    } else if (lowercaseMessage.includes("recharge")) {
      return "You can recharge your account by clicking the 'Recharge' button in the Account Overview section."
    } else if (lowercaseMessage.includes("call")) {
      return "To make a call, navigate to the 'Call' section from the main menu and enter the phone number you wish to dial."
    } else if (lowercaseMessage.includes("problem") || lowercaseMessage.includes("issue")) {
      return "I'm sorry to hear you're having a problem. Can you please provide more details about the issue you're experiencing?"
    } else {
      return "Thank you for your message. I'll forward this to our support team, and they'll get back to you as soon as possible."
    }
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric" }).format(date)
  }

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-grow p-4 bg-[#E0FFF5]" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.sender === "support" && (
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="/support-avatar.png" alt="Support" />
                <AvatarFallback>SP</AvatarFallback>
              </Avatar>
            )}
            <div className={`max-w-[70%] ${message.sender === "user" ? "order-1" : "order-2"}`}>
              <div
                className={`p-2 rounded-lg ${
                  message.sender === "user" ? "bg-[#038E7D] text-white" : "bg-[#F0FFF9] text-[#025E52]"
                }`}
              >
                {message.text}
              </div>
              <div className={`text-xs mt-1 ${message.sender === "user" ? "text-right" : "text-left"} text-gray-500`}>
                {formatTimestamp(new Date(message.timestamp))}
              </div>
            </div>
            {message.sender === "user" && (
              <Avatar className="w-8 h-8 ml-2">
                <AvatarImage src="/user-avatar.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center text-[#025E52] text-sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Support is typing...
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="mt-4 flex p-2 bg-white border-t border-[#038E7D]/20">
        <Input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow mr-2 border-[#038E7D]"
          ref={inputRef}
        />
        <Button type="submit" className="bg-[#038E7D] hover:bg-[#025E52] text-white">
          Send
        </Button>
      </form>
    </div>
  )
}
