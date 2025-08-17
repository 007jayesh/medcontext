"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, AlertCircle, Calculator } from "lucide-react"

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const suggestions = [
    {
      icon: FileText,
      title: "Document Summary",
      query: "Give me a summary of all processed documents from this week",
      category: "Overview",
    },
    {
      icon: TrendingUp,
      title: "Processing Trends",
      query: "Show me the processing volume trends for the last 30 days",
      category: "Analytics",
    },
    {
      icon: AlertCircle,
      title: "Error Analysis",
      query: "What are the most common errors in document processing?",
      category: "Issues",
    },
    {
      icon: Calculator,
      title: "Financial Metrics",
      query: "Calculate the total loan amounts from mortgage applications",
      category: "Calculations",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Suggested Queries</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start h-auto p-3 text-left bg-transparent"
            onClick={() => onSuggestionClick(suggestion.query)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <suggestion.icon className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{suggestion.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{suggestion.query}</p>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
