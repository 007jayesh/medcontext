"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  X, 
  FileSpreadsheet, 
  ImageIcon, 
  File,
  Maximize2,
  Minimize2
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadProgress: number
  status: "uploading" | "processing" | "ready" | "error"
  thumbnail?: string
}

interface DocumentViewerProps {
  file: UploadedFile | null
  isOpen: boolean
  onClose: () => void
}

export function DocumentViewer({ file, isOpen, onClose }: DocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!file) return null

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon className="w-5 h-5" />
    if (type.includes("spreadsheet") || type.includes("excel")) return <FileSpreadsheet className="w-5 h-5" />
    if (type.includes("pdf")) return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const renderDocumentContent = () => {
    if (file.type.includes("image")) {
      return (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <img 
            src={file.thumbnail || "/placeholder.jpg"} 
            alt={file.name}
            className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
          />
        </div>
      )
    }

    if (file.type.includes("pdf")) {
      return (
        <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
          <div className="text-center">
            <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">PDF Document</h3>
            <p className="text-gray-600 mb-4">
              PDF viewer will be integrated with backend
            </p>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      )
    }

    if (file.type.includes("spreadsheet") || file.type.includes("excel")) {
      return (
        <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
          <div className="text-center">
            <FileSpreadsheet className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Spreadsheet</h3>
            <p className="text-gray-600 mb-4">
              Spreadsheet viewer will be integrated with backend
            </p>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        </div>
      )
    }

    if (file.type.includes("text")) {
      return (
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="bg-white p-4 rounded border font-mono text-sm">
            <p className="text-gray-600 mb-4">Text content preview:</p>
            <div className="text-gray-800 whitespace-pre-wrap">
              {/* TODO: Replace with actual text content from backend */}
              Sample text content will be displayed here once integrated with the backend...
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
        <div className="text-center">
          <File className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Document Preview</h3>
          <p className="text-gray-600 mb-4">
            Document viewer will be integrated with backend
          </p>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download File
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? "max-w-[95vw] max-h-[95vh]" : "max-w-4xl max-h-[80vh]"} p-0 gap-0`}>
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-indigo-600">
                {getFileIcon(file.type)}
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold truncate max-w-md" title={file.name}>
                  {file.name}
                </DialogTitle>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                  <Badge 
                    variant={file.status === "ready" ? "default" : "secondary"} 
                    className={`text-xs ${
                      file.status === "ready" 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {file.status === "ready" && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>}
                    {file.status}
                  </Badge>
                  <span className="text-xs text-gray-500 uppercase">{file.type.split('/')[1]}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6 py-4">
          {renderDocumentContent()}
        </ScrollArea>
        
        <div className="px-6 py-4 border-t bg-gray-50/50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Document uploaded and processed successfully
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}