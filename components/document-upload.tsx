"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, CheckCircle } from "lucide-react"

interface UploadFile {
  id: string
  name: string
  size: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
}

export function DocumentUpload() {
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      progress: 0,
      status: "uploading",
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((file) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === file.id) {
              if (f.progress < 100) {
                return { ...f, progress: f.progress + 10 }
              } else if (f.status === "uploading") {
                return { ...f, status: "processing" }
              } else if (f.status === "processing") {
                return { ...f, status: "completed" }
              }
            }
            return f
          }),
        )
      }, 200)

      setTimeout(() => clearInterval(interval), 2400)
    })
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-chart-1" />
      case "error":
        return <X className="w-4 h-4 text-destructive" />
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90">
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>Upload your documents for AI-powered processing and analysis.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging ? "border-accent bg-accent/5" : "border-border"
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFileUpload(e.dataTransfer.files)
            }}
          >
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground mb-3">Supports PDF, DOC, DOCX, JPG, PNG (max 10MB each)</p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={file.progress} className="flex-1 h-1" />
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{file.status}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            {files.length > 0 && (
              <Button onClick={() => setFiles([])}>
                <Upload className="w-4 h-4 mr-2" />
                Process All
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
