"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const authState = localStorage.getItem("medcontext_auth")
      setIsAuthenticated(authState === "true")
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated === null) return // Still loading

    if (requireAuth && !isAuthenticated) {
      router.push("/login")
    } else if (!requireAuth && isAuthenticated) {
      router.push("/dashboard/chat")
    }
  }, [isAuthenticated, requireAuth, router])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null // Will redirect to login
  }

  if (!requireAuth && isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return <>{children}</>
}
