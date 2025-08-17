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
          <span className="font-medium">Live Deployment</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-blue-100">Medical AI Platform Ready</span>
        </div>
      </div>

      {/* Animated background element - left top sphere */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-gradient-primary opacity-8 rounded-full animate-float z-0"></div>

      {/* Navigation */}
      <header className="relative z-10 animate-fade-in-up">
        <nav className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="font-medium text-xl">Med Context</div>
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

      {/* Hero content with Animation */}
      <main className="relative z-10 container mx-auto px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <h1 className="font-medium text-4xl md:text-5xl mb-6 leading-tight tracking-tight">
                Fine-Tuned Medical AI with{' '}
                <span className="text-indigo-600 font-bold text-5xl md:text-6xl" style={{
                  border: 'none', 
                  outline: 'none', 
                  boxShadow: 'none',
                  display: 'inline-block',
                  animation: 'parsrFloat 1.5s ease-in-out infinite',
                  transform: 'translateY(0px)'
                }}>
                  Advanced
                </span>
                <br />
                <span className="text-gray-800">
                  RAG Architecture
                </span>
              </h1>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <p className="text-lg text-gray-600 mb-10">
                Build specialized medical AI using advanced foundation models with fine-tuning on your expert knowledge base. Our platform combines RAG architecture with context engineering to create clinically-accurate AI assistants for health-tech applications.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <Button 
                variant="outline"
                className="btn-secondary border-2 border-indigo-200 px-8 py-3 rounded-full text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                asChild
              >
                <Link href="#contact">Contact Sales</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Demo Card */}
          <div className="relative animate-fade-in-up" style={{animationDelay: '1s'}}>
            <div className="bg-gradient-to-br from-white/80 to-indigo-50/80 backdrop-blur-xl border border-indigo-200/30 rounded-3xl p-8 shadow-2xl overflow-hidden relative h-[520px]">
              
              {/* Medical AI Demo Interface */}
              <div className="relative h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner">
                
                {/* Chat Interface */}
                <div className="h-full bg-white flex flex-col">
                  {/* Chat Header */}
                  <div className="flex items-center p-3 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-2">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Med Context Health Assistant</div>
                      <div className="text-xs text-gray-500">Fine-tuned • RAG-enabled • Live knowledge</div>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 p-3 space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                        Hello! I'm trained on expert medical knowledge and can provide evidence-based health guidance. What would you like to know?
                      </div>
                    </div>
                    
                    {/* User message */}
                    <div className="flex items-start justify-end space-x-2">
                      <div className="bg-indigo-500 text-white rounded-lg px-3 py-2 text-sm">
                        My patient has Type 2 diabetes and high blood pressure. What lifestyle interventions should I recommend?
                      </div>
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">Dr</span>
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                        <div className="font-medium text-green-800">Evidence-based recommendations:</div>
                        <div className="text-green-700 text-xs mt-1">• Mediterranean diet (reduces HbA1c by 0.3-0.5%)</div>
                        <div className="text-green-700 text-xs">• 150min/week moderate exercise (improves insulin sensitivity)</div>
                        <div className="text-green-700 text-xs">• DASH diet for BP control (10-15mmHg reduction)</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-3 border-t bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-white rounded-full px-3 py-1 text-sm text-gray-500 border">
                        Ask about treatments, dosages, interactions, guidelines...
                      </div>
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Progress Indicator */}
              <div className="mt-6 flex justify-center space-x-3">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-lg border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Database</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Fine-tune</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">RAG</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Context</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full shadow-lg border border-white/30"></div>
                  <span className="text-xs text-gray-600 font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="gradient-border pt-6 card-hover">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-lg mb-2">Medical AI Fine-Tuning</h3>
            </div>
            <p className="text-gray-600 text-sm">Fine-tune specialized medical foundation models using your expert knowledge base for clinical accuracy.</p>
          </div>
          <div className="gradient-border pt-6 card-hover">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-lg mb-2">RAG Architecture</h3>
            </div>
            <p className="text-gray-600 text-sm">Combine fine-tuned models with retrieval-augmented generation for up-to-date medical knowledge access.</p>
          </div>
          <div className="gradient-border pt-6 card-hover">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-lg mb-2">Context Engineering</h3>
            </div>
            <p className="text-gray-600 text-sm">Next-generation prompt engineering with advanced context optimization to ensure accurate, relevant medical responses.</p>
          </div>
        </div>
      </main>

      {/* Divider */}
      <div className="container mx-auto px-6 mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
      </div>

      {/* Solutions Section */}
      <section id="solutions" className="relative z-10 py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-medium text-3xl md:text-4xl mb-4">Built for Health-Tech Innovation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Specialized AI training solutions for health-tech startups and medical applications requiring expert-level accuracy.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Telemedicine Platforms", desc: "Train AI to provide expert-level health consultations and recommendations", icon: MessageSquare },
              { title: "Health Advisory Apps", desc: "Create context-aware assistants for personalized health guidance", icon: BarChart3 },
              { title: "Medical Chatbots", desc: "Deploy AI trained on expert responses for patient interactions", icon: Bot },
              { title: "Wellness Coaching", desc: "Build AI coaches using validated expert knowledge and protocols", icon: TrendingUp },
              { title: "Symptom Checkers", desc: "Develop accurate diagnostic tools using expert-trained models", icon: CheckCircle },
              { title: "Mental Health Support", desc: "Create empathetic AI assistants trained on therapist responses", icon: Users },
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

      {/* CTA Section */}
      <div className="container mx-auto px-6 mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
      </div>

      <section className="relative z-10 py-20 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="font-medium text-3xl md:text-4xl mb-6">
            Ready to Build Expert-Level Health AI?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join innovative health-tech startups who trust Med Context for creating intelligent, context-aware medical assistants.
          </p>
          <div className="flex justify-center">
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
          © 2025 Med Context. All rights reserved.
        </div>
      </footer>
    </div>
  )
}