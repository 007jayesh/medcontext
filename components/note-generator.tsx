"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Copy, Wand2, CheckCircle, Clock } from "lucide-react"

interface GeneratedNote {
  id: string
  type: "application" | "summary"
  title: string
  content: string
  status: "generating" | "completed"
  createdAt: Date
}

export function NoteGenerator() {
  const [selectedDocument, setSelectedDocument] = useState("")
  const [noteType, setNoteType] = useState("")
  const [customInstructions, setCustomInstructions] = useState("")
  const [generatedNotes, setGeneratedNotes] = useState<GeneratedNote[]>([
    {
      id: "1",
      type: "application",
      title: "Mortgage Application Summary - John Smith",
      content: `BORROWER INFORMATION:
Name: John Smith
SSN: XXX-XX-1234
Employment: Software Engineer at TechCorp
Annual Income: $125,000
Credit Score: 785

LOAN DETAILS:
Loan Amount: $450,000
Property Value: $562,500
Loan-to-Value Ratio: 80%
Loan Type: Conventional 30-year fixed
Interest Rate: 6.75%

FINANCIAL SUMMARY:
Monthly Income: $10,417
Monthly Debts: $1,850
Debt-to-Income Ratio: 17.8%
Down Payment: $112,500 (20%)

PROPERTY INFORMATION:
Address: 123 Main Street, Anytown, ST 12345
Property Type: Single Family Residence
Year Built: 2018
Square Footage: 2,400 sq ft

DOCUMENTATION STATUS:
✓ W-2 Forms (2 years)
✓ Pay Stubs (recent 2 months)
✓ Bank Statements (3 months)
✓ Tax Returns (2 years)
✓ Purchase Agreement
✓ Property Appraisal

UNDERWRITING NOTES:
Strong borrower profile with excellent credit history and stable employment. Property appraisal supports loan amount. All required documentation complete and verified. Recommend approval with standard conditions.`,
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateNote = async () => {
    if (!selectedDocument || !noteType) return

    setIsGenerating(true)

    const newNote: GeneratedNote = {
      id: Date.now().toString(),
      type: noteType as "application" | "summary",
      title: `${noteType === "application" ? "Application" : "Summary"} Note - ${selectedDocument}`,
      content: "",
      status: "generating",
      createdAt: new Date(),
    }

    setGeneratedNotes((prev) => [newNote, ...prev])

    // Simulate note generation
    setTimeout(() => {
      const sampleContent =
        noteType === "application"
          ? `APPLICATION SUMMARY:
Document Type: ${selectedDocument}
Processing Date: ${new Date().toLocaleDateString()}

KEY FINDINGS:
• All required fields successfully extracted
• Financial calculations verified and accurate
• Supporting documentation complete
• Risk assessment: Low
• Compliance status: Approved

EXTRACTED DATA:
• Applicant Information: Complete
• Financial Details: Verified
• Property Information: Confirmed
• Employment History: Validated

RECOMMENDATIONS:
Ready for lender submission with all compliance requirements met.`
          : `EXECUTIVE SUMMARY:
Document: ${selectedDocument}
Analysis Date: ${new Date().toLocaleDateString()}

OVERVIEW:
Comprehensive analysis of submitted documentation reveals strong application profile with all regulatory requirements satisfied.

KEY METRICS:
• Data Accuracy: 99.8%
• Processing Time: 2.3 minutes
• Fields Extracted: 47
• Validation Status: Passed

NEXT STEPS:
Document package ready for immediate lender submission.`

      setGeneratedNotes((prev) =>
        prev.map((note) => (note.id === newNote.id ? { ...note, content: sampleContent, status: "completed" } : note)),
      )
      setIsGenerating(false)
    }, 3000)
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const downloadNote = (note: GeneratedNote) => {
    const blob = new Blob([note.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${note.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Note Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Application Notes</CardTitle>
          <CardDescription>
            Create clean, accurate application notes and summary notes ready for lender submission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Document</label>
              <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a processed document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mortgage_application_001.pdf">mortgage_application_001.pdf</SelectItem>
                  <SelectItem value="insurance_claim_form.pdf">insurance_claim_form.pdf</SelectItem>
                  <SelectItem value="tax_return_2023.pdf">tax_return_2023.pdf</SelectItem>
                  <SelectItem value="contract_agreement.pdf">contract_agreement.pdf</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Note Type</label>
              <Select value={noteType} onValueChange={setNoteType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select note type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application">Application Notes</SelectItem>
                  <SelectItem value="summary">Summary Notes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Instructions (Optional)</label>
            <Textarea
              placeholder="Add any specific requirements or formatting preferences..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="bg-background"
            />
          </div>

          <Button
            onClick={handleGenerateNote}
            disabled={!selectedDocument || !noteType || isGenerating}
            className="w-full"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Notes"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Notes</CardTitle>
          <CardDescription>Your AI-generated application and summary notes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Notes</TabsTrigger>
              <TabsTrigger value="application">Application Notes</TabsTrigger>
              <TabsTrigger value="summary">Summary Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {generatedNotes.map((note) => (
                <Card key={note.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{note.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={note.type === "application" ? "default" : "secondary"}>
                              {note.type === "application" ? "Application" : "Summary"}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              {note.status === "completed" ? (
                                <CheckCircle className="w-3 h-3 text-chart-1" />
                              ) : (
                                <Clock className="w-3 h-3 text-muted-foreground" />
                              )}
                              <span className="text-xs text-muted-foreground capitalize">{note.status}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{note.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      {note.status === "completed" && (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(note.content)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => downloadNote(note)}>
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {note.status === "generating" ? (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Generating note content...</span>
                      </div>
                    ) : (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <pre className="text-sm whitespace-pre-wrap font-mono">{note.content}</pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="application">
              {generatedNotes
                .filter((note) => note.type === "application")
                .map((note) => (
                  <div key={note.id}>{/* Same card structure as above */}</div>
                ))}
            </TabsContent>

            <TabsContent value="summary">
              {generatedNotes
                .filter((note) => note.type === "summary")
                .map((note) => (
                  <div key={note.id}>{/* Same card structure as above */}</div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
