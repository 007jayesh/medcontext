"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Save, 
  Database, 
  Shield, 
  Bell, 
  User, 
  Key,
  Globe,
  Settings,
  FileText,
  Stethoscope,
  Zap,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile
    name: "Dr. John Smith",
    email: "john.smith@hospital.com",
    organization: "City General Hospital",
    specialty: "Internal Medicine",
    
    // AI Configuration
    confidenceThreshold: 85,
    enableRAG: true,
    enableFineTuning: true,
    contextWindow: 4096,
    temperature: 0.7,
    
    // Integrations
    ehrSystem: "Epic",
    fhirEndpoint: "https://api.hospital.com/fhir",
    apiKey: "sk-••••••••••••••••",
    
    // Notifications
    emailNotifications: true,
    criticalAlerts: true,
    weeklyReports: false,
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: 30,
    auditLogging: true
  })

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving settings:", settings)
  }

  const integrationStatus = {
    epic: { connected: true, lastSync: "2024-01-15 14:30" },
    cerner: { connected: false, lastSync: null },
    allscripts: { connected: true, lastSync: "2024-01-15 12:15" },
    fhir: { connected: true, lastSync: "2024-01-15 15:45" }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Configure your Med Context platform and integrations</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI Config
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={settings.organization}
                        onChange={(e) => setSettings(prev => ({ ...prev, organization: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Medical Specialty</Label>
                      <Input
                        id="specialty"
                        value={settings.specialty}
                        onChange={(e) => setSettings(prev => ({ ...prev, specialty: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    AI Model Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="confidence">Confidence Threshold (%)</Label>
                      <Input
                        id="confidence"
                        type="number"
                        min="0"
                        max="100"
                        value={settings.confidenceThreshold}
                        onChange={(e) => setSettings(prev => ({ ...prev, confidenceThreshold: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature</Label>
                      <Input
                        id="temperature"
                        type="number"
                        min="0"
                        max="2"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="context">Context Window Size</Label>
                    <Input
                      id="context"
                      type="number"
                      value={settings.contextWindow}
                      onChange={(e) => setSettings(prev => ({ ...prev, contextWindow: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>RAG (Retrieval-Augmented Generation)</Label>
                        <p className="text-sm text-gray-500">Enable real-time knowledge retrieval</p>
                      </div>
                      <Switch
                        checked={settings.enableRAG}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRAG: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Fine-Tuning</Label>
                        <p className="text-sm text-gray-500">Use custom medical knowledge fine-tuning</p>
                      </div>
                      <Switch
                        checked={settings.enableFineTuning}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableFineTuning: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      EHR System Integrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(integrationStatus).map(([system, status]) => (
                        <div key={system} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Stethoscope className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium capitalize">{system}</p>
                              <p className="text-sm text-gray-500">
                                {status.lastSync ? `Last sync: ${status.lastSync}` : "Not connected"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={status.connected ? "default" : "secondary"} className={
                              status.connected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }>
                              {status.connected ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <AlertTriangle className="w-3 h-3 mr-1" />
                              )}
                              {status.connected ? "Connected" : "Disconnected"}
                            </Badge>
                            <Button variant="outline" size="sm">
                              {status.connected ? "Configure" : "Connect"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      FHIR Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fhir-endpoint">FHIR Endpoint URL</Label>
                      <Input
                        id="fhir-endpoint"
                        value={settings.fhirEndpoint}
                        onChange={(e) => setSettings(prev => ({ ...prev, fhirEndpoint: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={settings.apiKey}
                        onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email updates about system activities</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Critical Alerts</Label>
                      <p className="text-sm text-gray-500">Immediate notifications for urgent medical alerts</p>
                    </div>
                    <Switch
                      checked={settings.criticalAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, criticalAlerts: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-gray-500">Summary reports of AI performance and usage</p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      min="5"
                      max="480"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-gray-500">Track all system access and activities</p>
                    </div>
                    <Switch
                      checked={settings.auditLogging}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auditLogging: checked }))}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6">
            <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}