'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Profound
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/brand-analysis" className="text-sm font-medium hover:text-primary">
              Brand Analysis
            </Link>
            <Link href="/conversations" className="text-sm font-medium hover:text-primary">
              Conversations
            </Link>
            <Link href="/actions" className="text-sm font-medium hover:text-primary">
              Actions
            </Link>
            <Link href="/test-db" className="text-sm font-medium hover:text-primary">
              Test DB
            </Link>
            <Link href="/test-query" className="text-sm font-medium hover:text-primary">
              Test Query
            </Link>
            <Link href="/settings" className="text-sm font-medium hover:text-primary">
              Settings
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}