"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Bot, 
  Heart, 
  Brain, 
  Stethoscope, 
  Pill, 
  Activity, 
  Users, 
  AlertTriangle,
  Play,
  Pause,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  icon: any
  status: "active" | "inactive" | "training"
  accuracy: number
  lastTrained: string
  specialty: string
  tasks: number
}

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Clinical Diagnosis Assistant",
      description: "Analyzes symptoms and suggests potential diagnoses based on medical literature and clinical guidelines",
      icon: Stethoscope,
      status: "active",
      accuracy: 94,
      lastTrained: "2024-01-15",
      specialty: "General Medicine",
      tasks: 1247
    },
    {
      id: "2", 
      name: "Drug Interaction Checker",
      description: "Identifies potential drug interactions and contraindications for medication safety",
      icon: Pill,
      status: "active",
      accuracy: 98,
      lastTrained: "2024-01-12",
      specialty: "Pharmacology",
      tasks: 892
    },
    {
      id: "3",
      name: "Mental Health Counselor",
      description: "Provides evidence-based mental health support and therapeutic guidance",
      icon: Brain,
      status: "training",
      accuracy: 89,
      lastTrained: "2024-01-10",
      specialty: "Psychiatry",
      tasks: 456
    },
    {
      id: "4",
      name: "Cardiology Specialist",
      description: "Specialized in cardiovascular conditions, ECG analysis, and cardiac risk assessment",
      icon: Heart,
      status: "active",
      accuracy: 91,
      lastTrained: "2024-01-14",
      specialty: "Cardiology",
      tasks: 723
    },
    {
      id: "5",
      name: "Emergency Triage Assistant",
      description: "Rapid assessment and prioritization of emergency cases based on severity",
      icon: AlertTriangle,
      status: "inactive",
      accuracy: 87,
      lastTrained: "2024-01-08",
      specialty: "Emergency Medicine",
      tasks: 334
    },
    {
      id: "6",
      name: "Patient Care Coordinator",
      description: "Manages patient workflows, appointment scheduling, and care plan coordination",
      icon: Users,
      status: "active",
      accuracy: 92,
      lastTrained: "2024-01-13",
      specialty: "Care Management",
      tasks: 1156
    }
  ])

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === "active" ? "inactive" : "active" }
        : agent
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "training": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Activity className="w-3 h-3" />
      case "inactive": return <Pause className="w-3 h-3" />
      case "training": return <TrendingUp className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Agents</h1>
            <p className="text-gray-600">Manage your specialized medical AI agents for different clinical workflows</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Agents</p>
                    <p className="text-2xl font-bold text-green-600">
                      {agents.filter(a => a.status === "active").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {agents.reduce((sum, a) => sum + a.tasks, 0).toLocaleString()}
                    </p>
                  </div>
                  <Bot className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Accuracy</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(agents.reduce((sum, a) => sum + a.accuracy, 0) / agents.length)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Specialties</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {new Set(agents.map(a => a.specialty)).size}
                    </p>
                  </div>
                  <Stethoscope className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const IconComponent = agent.icon
              return (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <Badge variant="secondary" className={getStatusColor(agent.status)}>
                            {getStatusIcon(agent.status)}
                            <span className="ml-1 capitalize">{agent.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={agent.status === "active"}
                        onCheckedChange={() => toggleAgentStatus(agent.id)}
                        disabled={agent.status === "training"}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{agent.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Accuracy</span>
                        <span className="font-medium">{agent.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${agent.accuracy}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Specialty</p>
                        <p className="font-medium">{agent.specialty}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tasks Completed</p>
                        <p className="font-medium">{agent.tasks.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-gray-500">Last Training</p>
                      <p className="font-medium">{new Date(agent.lastTrained).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                      {agent.status === "active" && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Play className="w-4 h-4 mr-1" />
                          Test
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Add New Agent Card */}
          <Card className="mt-6 border-dashed border-2 border-gray-300 hover:border-indigo-400 transition-colors">
            <CardContent className="p-8 text-center">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Agent</h3>
              <p className="text-gray-600 mb-4">
                Train a new specialized AI agent for your medical workflow
              </p>
              <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <Bot className="w-4 h-4 mr-2" />
                Add New Agent
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}