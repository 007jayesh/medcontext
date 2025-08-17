"use client"

import { useState, useRef, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, Brain, Activity } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  confidence?: number
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your Med Context AI assistant, trained on expert medical knowledge. I can help with clinical guidance, treatment recommendations, drug interactions, and evidence-based medical information. What would you like to know?",
      timestamp: new Date(),
      confidence: 95
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "Based on current medical guidelines, I can provide evidence-based recommendations. For Type 2 diabetes management, the American Diabetes Association recommends: 1) Lifestyle modifications (Mediterranean diet, 150min/week exercise), 2) Metformin as first-line therapy, 3) HbA1c target <7% for most adults. Would you like specific information about any of these approaches?",
          confidence: 92
        },
        {
          content: "For hypertension management in diabetic patients, the target BP is typically <130/80 mmHg. ACE inhibitors or ARBs are preferred due to cardiovascular and renal protection. DASH diet can reduce systolic BP by 8-14 mmHg. Regular monitoring and medication adherence are crucial.",
          confidence: 88
        },
        {
          content: "Drug interactions are important to consider. Always check for contraindications, especially with polypharmacy in elderly patients. I can help identify potential interactions if you provide specific medications. Would you like me to review a particular drug combination?",
          confidence: 94
        }
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: randomResponse.content,
        timestamp: new Date(),
        confidence: randomResponse.confidence
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Medical AI Chat</h1>
            <p className="text-gray-600">Chat with your fine-tuned medical AI assistant</p>
            
            <div className="flex gap-2 mt-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Brain className="w-3 h-3 mr-1" />
                RAG Enabled
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Sparkles className="w-3 h-3 mr-1" />
                Fine-tuned
              </Badge>
            </div>
          </div>

          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 p-0 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === "user" ? "bg-indigo-500 ml-3" : "bg-gradient-to-r from-indigo-600 to-purple-600 mr-3"
                      }`}>
                        {message.type === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`rounded-lg px-4 py-3 ${
                        message.type === "user" 
                          ? "bg-indigo-500 text-white" 
                          : "bg-gray-100 text-gray-900 border"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.type === "assistant" && message.confidence && (
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span>Confidence: {message.confidence}%</span>
                          </div>
                        )}
                        <div className="mt-1 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about treatments, dosages, interactions, guidelines..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This AI provides medical information for educational purposes. Always consult healthcare professionals for medical decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}