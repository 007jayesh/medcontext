"use client"
// home
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileText, MessageSquare, Zap, Shield, BarChart3, Users, Bot, TrendingUp, CheckCircle, Database } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function ExperimentPage() {
  useEffect(() => {
    // Ensure page starts at top on refresh
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="relative overflow-hidden bg-gradient-hero text-gray-800">
      {/* Deployment Banner */}
      <div className="relative z-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span className="hidden sm:inline">🚀</span>
          <span className="font-medium">Under Development</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-blue-100">Demo deployment for testing purposes</span>
        </div>
      </div>

      {/* Animated background element - left top sphere */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-gradient-primary opacity-8 rounded-full animate-float z-0"></div>

      {/* Navigation */}
      <header className="relative z-10 animate-fade-in-up">
        <nav className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="font-medium text-xl">Parsr</div>
            <div className="hidden md:flex space-x-8 text-sm">
              <Link href="#features" className="hover:text-gray-600 transition-colors">Features</Link>
              <Link href="#solutions" className="hover:text-gray-600 transition-colors">Solutions</Link>
              <Link href="#pricing" className="hover:text-gray-600 transition-colors">Pricing</Link>
              <Link href="#contact" className="hover:text-gray-600 transition-colors">Contact</Link>
            </div>
            <div>
              <Button 
                variant="outline" 
                className="border border-black/10 px-5 py-2 rounded-full text-sm font-medium hover:border-black/20 transition-all duration-300 bg-transparent"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Divider - Removed */}

      {/* Hero content with Animation */}
      <main className="relative z-10 container mx-auto px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <h1 className="font-medium text-4xl md:text-5xl mb-6 leading-tight tracking-tight">
                Transform Your Document Processing with{' '}
                <span className="text-indigo-600 font-bold text-5xl md:text-6xl" style={{
                  border: 'none', 
                  outline: 'none', 
                  boxShadow: 'none',
                  display: 'inline-block',
                  animation: 'parsrFloat 1.5s ease-in-out infinite',
                  transform: 'translateY(0px)'
                }}>
                  Parsr
                </span>
                <br />
                <span className="text-gray-800">
                  AI Intelligence
                </span>
              </h1>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <p className="text-lg text-gray-600 mb-10">
                Unlock insights from your document repositories through advanced AI pipelines, intelligent agents, and conversational AI. Create custom AI agents for automated processing tailored to your specific needs. Built for financial services and enterprise teams.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <Button 
                className="btn-primary bg-gradient-primary text-white px-8 py-3 rounded-full text-sm font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                asChild
              >
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="btn-secondary border-2 border-indigo-200 px-8 py-3 rounded-full text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                asChild
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Cinematic User Journey */}
          <div className="relative animate-fade-in-up" style={{animationDelay: '1s'}}>
            <div className="bg-gradient-to-br from-white/80 to-indigo-50/80 backdrop-blur-xl border border-indigo-200/30 rounded-3xl p-8 shadow-2xl overflow-hidden relative h-[520px] movie-container">
              
              {/* Ambient Glow Effects */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>

              {/* Movie Container */}
              <div className="relative h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner movie-screen">
                
                {/* Scene 1: Document Upload & Pipeline Fetch (0-3s) */}
                <div className="absolute inset-0 animate-scene-1">
                  <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                    <div className="flex space-x-12 items-start">
                      {/* Upload Section */}
                      <div className="text-center">
                        <div className="w-16 h-20 bg-white border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center mb-4 animate-document-drop">
                          <FileText className="w-8 h-8 text-indigo-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">mortgage_application.pdf</p>
                        <p className="text-xs text-gray-500 mt-1">Uploading to Parsr...</p>
                        <div className="w-32 h-1 bg-gray-200 rounded-full mt-2 mx-auto">
                          <div className="h-full bg-indigo-500 rounded-full animate-upload-progress"></div>
                        </div>
                      </div>

                      {/* Parallel Indicator */}
                      <div className="flex flex-col items-center mt-8">
                        <div className="text-xs text-gray-500 font-medium mb-2">Parallel Processing</div>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>

                      {/* Pipeline Fetch Section */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 animate-pipeline-fetch">
                          <Database className="w-8 h-8 text-white animate-spin-slow" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Fetching related docs</p>
                        <p className="text-xs text-gray-500 mt-1">Pipeline processing...</p>
                        <div className="w-32 h-1 bg-gray-200 rounded-full mt-2 mx-auto">
                          <div className="h-full bg-purple-500 rounded-full animate-fetch-progress"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scene 2: AI Processing (3-6s) */}
                <div className="absolute inset-0 animate-scene-2">
                  <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-ai-process">
                        <Bot className="w-8 h-8 text-white animate-spin-slow" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">AI Extracting Data...</p>
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-600">Borrower: John Smith</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-xs animate-data-extract" style={{animationDelay: '0.5s'}}>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-600">Income: $85,000</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-xs animate-data-extract" style={{animationDelay: '1s'}}>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-600">Loan Amount: $420,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scene 3: Data Storage (6-8s) */}
                <div className="absolute inset-0 animate-scene-3">
                  <div className="h-full bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 animate-database-store">
                        <Database className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">Storing Structured Data</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/60 backdrop-blur rounded p-2 animate-data-card" style={{animationDelay: '0.2s'}}>
                          <div className="font-medium text-gray-700">Personal Info</div>
                          <div className="text-gray-500">✓ Stored</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur rounded p-2 animate-data-card" style={{animationDelay: '0.4s'}}>
                          <div className="font-medium text-gray-700">Financial Data</div>
                          <div className="text-gray-500">✓ Stored</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scene 4: Chat Interface (8-12s) */}
                <div className="absolute inset-0 animate-scene-4">
                  <div className="h-full bg-white flex flex-col">
                    {/* Chat Header */}
                    <div className="flex items-center p-3 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-2">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">Parsr AI Assistant</div>
                        <div className="text-xs text-gray-500">Ready to answer questions</div>
                      </div>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="flex-1 p-3 space-y-3">
                      <div className="flex items-start space-x-2 animate-bot-message" style={{animationDelay: '1s'}}>
                        <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                          I've processed your mortgage application. What would you like to know?
                        </div>
                      </div>
                      
                      {/* User typing animation */}
                      <div className="flex items-start justify-end space-x-2 animate-user-message" style={{animationDelay: '2.5s'}}>
                        <div className="bg-indigo-500 text-white rounded-lg px-3 py-2 text-sm">
                          What's the debt-to-income ratio?
                        </div>
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-600">JS</span>
                        </div>
                      </div>
                      
                      {/* AI Response */}
                      <div className="flex items-start space-x-2 animate-ai-response" style={{animationDelay: '4s'}}>
                        <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                          <div className="font-medium text-green-800">Debt-to-Income Ratio: 28%</div>
                          <div className="text-green-700 text-xs mt-1">✓ Meets lending criteria (below 36% threshold)</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chat Input */}
                    <div className="p-3 border-t bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-white rounded-full px-3 py-1 text-sm text-gray-500 border">
                          Ask me anything about this document...
                        </div>
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scene 5: AI Agent Creation Interface (24-30s) */}
                <div className="absolute inset-0 animate-scene-5">
                  <div className="h-full bg-gradient-to-br from-emerald-50 to-cyan-50 flex flex-col">
                    {/* Agent Builder Header */}
                    <div className="flex items-center p-3 border-b bg-gradient-to-r from-emerald-50 to-cyan-50">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center mr-2">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">AI Agent Builder</div>
                        <div className="text-xs text-gray-500">Create custom processing workflows</div>
                      </div>
                    </div>
                    
                    {/* Agent Creation Process */}
                    <div className="flex-1 p-3 space-y-3">
                      <div className="animate-agent-step-1" style={{animationDelay: '1s'}}>
                        <div className="bg-white/70 backdrop-blur rounded-lg p-3">
                          <div className="text-xs font-medium text-gray-700 mb-1">Step 1: Agent Configuration</div>
                          <div className="text-xs text-gray-600">Name: Mortgage Credit Scorer</div>
                          <div className="text-xs text-gray-600">Database: Mortgage Applications DB</div>
                        </div>
                      </div>
                      
                      <div className="animate-agent-step-2" style={{animationDelay: '2.5s'}}>
                        <div className="bg-white/70 backdrop-blur rounded-lg p-3">
                          <div className="text-xs font-medium text-gray-700 mb-1">Step 2: Objective Definition</div>
                          <div className="text-xs text-gray-600">✓ Extract borrower information</div>
                          <div className="text-xs text-gray-600">✓ Calculate debt-to-income ratio</div>
                          <div className="text-xs text-gray-600">✓ Generate credit score</div>
                        </div>
                      </div>
                      
                      <div className="animate-agent-step-3" style={{animationDelay: '4s'}}>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600 mr-1" />
                            <div className="text-xs font-medium text-emerald-800">Agent Created Successfully!</div>
                          </div>
                          <div className="text-xs text-emerald-700">Ready to process mortgage applications</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Agent Controls */}
                    <div className="p-3 border-t bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">Agent status: Active</div>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <ArrowRight className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Progress Indicator */}
              <div className="mt-6 flex justify-center space-x-3">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-lg animate-progress-dot border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Upload</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg animate-progress-dot-pipeline border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Pipeline</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full shadow-lg animate-progress-dot-2 border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Process</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full shadow-lg animate-progress-dot-3 border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Store</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full shadow-lg animate-progress-dot-4 border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Chat</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full shadow-lg animate-progress-dot-5 border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Agent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features with subtle borders */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="gradient-border pt-6 card-hover animate-fade-in-left" style={{animationDelay: '7s'}}>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-lg mb-2">AI-Powered Extraction</h3>
            </div>
            <p className="text-gray-600 text-sm">Advanced AI pipelines with quality assurance ensure perfect data extraction from any document format.</p>
          </div>
          <div className="gradient-border pt-6 card-hover animate-fade-in-up" style={{animationDelay: '7.2s'}}>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-lg mb-2">Enterprise Scale</h3>
            </div>
            <p className="text-gray-600 text-sm">Bulk processing pipelines handle thousands of documents with structured storage and retrieval capabilities.</p>
          </div>
          <div className="gradient-border pt-6 card-hover animate-fade-in-right" style={{animationDelay: '7.4s'}}>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-lg mb-2">Conversational AI</h3>
            </div>
            <p className="text-gray-600 text-sm">Chat with your extracted data using natural language queries and get instant insights.</p>
          </div>
        </div>
      </main>

      {/* Rest of the sections remain the same as original homepage */}
      {/* Divider */}
      <div className="container mx-auto px-6 mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
      </div>

      {/* Solutions Section */}
      <section id="solutions" className="relative z-10 py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-medium text-3xl md:text-4xl mb-4">Built for Financial Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Specialized solutions for the unique document processing needs of financial institutions and professional services.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Mortgage Brokers", desc: "Streamline loan applications and compliance documentation", icon: FileText },
              { title: "Financial Advisors", desc: "Process client documents and generate reports efficiently", icon: BarChart3 },
              { title: "Accounting Firms", desc: "Automate tax document processing and client communications", icon: Users },
              { title: "Insurance Companies", desc: "Handle claims processing and policy documentation", icon: Shield },
              { title: "Legal Firms", desc: "Analyze contracts and legal documents with precision", icon: FileText },
              { title: "Healthcare", desc: "Process insurance claims and medical documentation", icon: Users },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="gradient-border pt-6 card-hover bg-white/60 backdrop-blur-md rounded-lg p-6 border border-indigo-100/50">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Agents Section - Enhanced */}
      <div className="container mx-auto px-6 mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
      </div>

      <section id="ai-agents" className="relative z-10 py-20 px-6 overflow-hidden">
        {/* Background Enhancement */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-cyan-50/50"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-primary/10 rounded-full mb-6">
              <Bot className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-700">Intelligent Automation</span>
            </div>
            <h2 className="font-medium text-4xl md:text-5xl mb-6 bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              AI Agents for Financial Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Deploy specialized AI agents to automate complex financial workflows. Each agent is trained on domain-specific data to deliver precise, actionable insights with enterprise-grade reliability.
            </p>
          </div>
          {/* Moving Agents Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex space-x-6 animate-agent-carousel">
              {/* Duplicate the array to create seamless infinite scroll */}
              {[...Array(2)].map((_, duplicateIndex) => (
                [
                  { 
                    title: "Document Analyzer", 
                    desc: "Extract and classify financial data with 99.8% accuracy",
                    icon: FileText,
                    features: ["Multi-format support", "Smart extraction"],
                    status: "Active",
                    gradient: "from-blue-500 to-indigo-600",
                    bgGradient: "from-blue-50 to-indigo-50"
                  },
                  { 
                    title: "Risk Assessment Agent", 
                    desc: "Evaluate loan applications using advanced risk modeling",
                    icon: Shield,
                    features: ["Credit scoring", "Risk metrics"],
                    status: "Active",
                    gradient: "from-emerald-500 to-teal-600",
                    bgGradient: "from-emerald-50 to-teal-50"
                  },
                  { 
                    title: "Workflow Optimizer", 
                    desc: "Streamline approval processes and identify bottlenecks",
                    icon: TrendingUp,
                    features: ["Process mining", "Automation"],
                    status: "Active",
                    gradient: "from-purple-500 to-violet-600",
                    bgGradient: "from-purple-50 to-violet-50"
                  },
                  { 
                    title: "Compliance Monitor", 
                    desc: "Monitor transactions for regulatory compliance",
                    icon: CheckCircle,
                    features: ["Real-time scanning", "Alert system"],
                    status: "Coming Soon",
                    gradient: "from-amber-500 to-orange-600",
                    bgGradient: "from-amber-50 to-orange-50"
                  },
                  { 
                    title: "Market Intelligence", 
                    desc: "Analyze market trends and generate recommendations",
                    icon: BarChart3,
                    features: ["Market analysis", "Trend prediction"],
                    status: "Coming Soon",
                    gradient: "from-rose-500 to-pink-600",
                    bgGradient: "from-rose-50 to-pink-50"
                  },
                  { 
                    title: "Customer Advisor", 
                    desc: "Provide personalized financial advice using AI",
                    icon: MessageSquare,
                    features: ["Natural language", "24/7 availability"],
                    status: "Coming Soon",
                    gradient: "from-cyan-500 to-blue-600",
                    bgGradient: "from-cyan-50 to-blue-50"
                  },
                ].map((agent, index) => {
                  const IconComponent = agent.icon;
                  const uniqueKey = `${duplicateIndex}-${index}`;
                  return (
                    <div key={uniqueKey} className={`flex-shrink-0 w-80 bg-gradient-to-br ${agent.bgGradient} backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 agent-card-small`}>
                      {/* Status indicator */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${agent.gradient} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <Badge variant={agent.status === "Active" ? "default" : "secondary"} className={`text-xs ${agent.status === "Active" ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {agent.status === "Active" && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>}
                          {agent.status}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">{agent.title}</h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{agent.desc}</p>

                      {/* Features */}
                      <div className="space-y-2">
                        {agent.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-xs text-gray-700">
                            <div className={`w-1.5 h-1.5 bg-gradient-to-r ${agent.gradient} rounded-full mr-2`}></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ))}
            </div>
          </div>
          <div className="text-center mt-16">
          </div>
        </div>
      </section>

      {/* Rest of the sections (Features, CTA, Footer) */}
      <div className="container mx-auto px-6 mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
      </div>

      <section className="relative z-10 py-20 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="font-medium text-3xl md:text-4xl mb-6">
            Ready to Transform Your Document Processing?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join leading financial institutions and professional services firms who trust Parsr for their document intelligence needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="btn-primary bg-gradient-primary text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              asChild
            >
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              variant="outline"
              className="btn-secondary border-2 border-indigo-200 px-8 py-4 rounded-full text-lg font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
              asChild
            >
              <Link href="#contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
      </div>

      <footer className="relative z-10 container mx-auto px-6 py-8">
        <div className="text-sm text-gray-500 text-center">
          © 2025 Parsr. All rights reserved.
        </div>
      </footer>
    </div>
  )
}