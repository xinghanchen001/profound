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
            <Link href="/setup" className="text-sm font-medium hover:text-primary">
              Setup
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/brand-analysis" className="text-sm font-medium hover:text-primary">
              Brand Analysis
            </Link>
            <Link href="/conversations" className="text-sm font-medium hover:text-primary">
              Conversations
            </Link>
            <Link href="/test-query" className="text-sm font-medium hover:text-primary">
              Test Query
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