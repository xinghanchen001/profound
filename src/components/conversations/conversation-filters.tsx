'use client'

import { Search } from 'lucide-react'

interface ConversationFiltersProps {
  filters: {
    platform: string
    sentiment: string
    dateRange: string
    company: string
    searchQuery: string
  }
  companies: Array<{id: string, name: string}>
  platforms: Array<{id: string, name: string}>
  onFilterChange: (filters: Partial<ConversationFiltersProps['filters']>) => void
}

export function ConversationFilters({ 
  filters, 
  companies, 
  platforms, 
  onFilterChange 
}: ConversationFiltersProps) {
  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Filter Conversations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Company Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={filters.company}
            onChange={(e) => onFilterChange({ company: e.target.value })}
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">AI Platform</label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={filters.platform}
            onChange={(e) => onFilterChange({ platform: e.target.value })}
          >
            <option value="all">All Platforms</option>
            {platforms.map(platform => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sentiment Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Sentiment</label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={filters.sentiment}
            onChange={(e) => onFilterChange({ sentiment: e.target.value })}
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive Only</option>
            <option value="negative">Negative Only</option>
            <option value="neutral">Neutral Only</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ dateRange: e.target.value })}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        {/* Search Query */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search in queries and responses..."
              className="w-full border rounded-md pl-10 pr-3 py-2 text-sm"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.platform !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            Platform: {platforms.find(p => p.id === filters.platform)?.name}
            <button
              onClick={() => onFilterChange({ platform: 'all' })}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        )}
        
        {filters.sentiment !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            Sentiment: {filters.sentiment}
            <button
              onClick={() => onFilterChange({ sentiment: 'all' })}
              className="ml-1 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </span>
        )}
        
        {filters.searchQuery && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
            Search: &quot;{filters.searchQuery}&quot;
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="ml-1 text-purple-600 hover:text-purple-800"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  )
}