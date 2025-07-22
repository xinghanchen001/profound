'use client'

import { useState } from 'react'
import { Search, Command } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // TODO: Implement search functionality
      console.log('Search:', query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={cn(
        "relative flex items-center transition-colors",
        isFocused ? "text-blue-600" : "text-gray-400"
      )}>
        <Search className="absolute left-3 h-4 w-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search..."
          className={cn(
            "w-full pl-10 pr-8 py-2 text-sm bg-gray-50 border-0 rounded-md transition-colors",
            "placeholder:text-gray-500",
            "focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none"
          )}
        />
        
        {/* Keyboard shortcut hint */}
        <div className="absolute right-3 flex items-center space-x-0.5 text-xs text-gray-400">
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </div>
      
      {/* Search suggestions could go here */}
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-30">
          <div className="py-2">
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
              Search Results
            </div>
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              Search functionality coming soon
            </div>
          </div>
        </div>
      )}
    </form>
  )
}