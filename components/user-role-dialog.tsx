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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, Crown, Shield, User, Eye } from "lucide-react"

interface UserRoleDialogProps {
  currentRole: string
  userName: string
}

export function UserRoleDialog({ currentRole, userName }: UserRoleDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(currentRole)

  const roles = [
    {
      value: "admin",
      label: "Admin",
      icon: Crown,
      description: "Full system access and user management",
      permissions: ["All permissions", "User management", "Billing access", "Security settings"],
    },
    {
      value: "manager",
      label: "Manager",
      icon: Shield,
      description: "Pipeline management and team oversight",
      permissions: ["Pipeline management", "Team oversight", "Report generation", "User invitation"],
    },
    {
      value: "analyst",
      label: "Analyst",
      icon: User,
      description: "Document processing and data analysis",
      permissions: ["Document processing", "Data analysis", "Report viewing", "Chat with AI"],
    },
    {
      value: "viewer",
      label: "Viewer",
      icon: Eye,
      description: "View-only access to documents and reports",
      permissions: ["View documents", "View reports", "Basic chat access"],
    },
  ]

  const handleRoleChange = () => {
    // Handle role change logic here
    console.log(`Changing ${userName}'s role from ${currentRole} to ${selectedRole}`)
    setIsOpen(false)
  }

  const selectedRoleData = roles.find((role) => role.value === selectedRole)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-3 h-3 mr-2" />
          Change Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>Update {userName}'s role and permissions</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Role</label>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center space-x-2">
                      <role.icon className="w-4 h-4" />
                      <span>{role.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRoleData && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <selectedRoleData.icon className="w-5 h-5 text-accent" />
                <h4 className="font-medium">{selectedRoleData.label}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{selectedRoleData.description}</p>
              <div>
                <p className="text-sm font-medium mb-2">Permissions:</p>
                <ul className="space-y-1">
                  {selectedRoleData.permissions.map((permission, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={selectedRole === currentRole}>
              Update Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
