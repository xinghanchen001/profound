'use client'

import { useState, useEffect } from 'react'
import { useBrand } from '@/contexts/brand-context'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Globe,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

// Mock data - replace with real data later
const mockData = {
  visibilityScore: 48.3,
  visibilityChange: 5.5,
  visibilityRank: 1,
  shareOfVoice: 18.9,
  shareOfVoiceChange: -0.1,
  competitors: [
    { name: 'American Express', score: 55.6, change: 0.6, rank: 1 },
    { name: 'Ramp', score: 52.6, change: 1.3, rank: 2 },
    { name: 'Brex', score: 49.1, change: -2.3, rank: 3 },
    { name: 'Capital One', score: 45.6, change: -2.7, rank: 4 },
    { name: 'Chase', score: 43.1, change: 1.5, rank: 5 },
  ]
}

const tabs = [
  { id: 'visibility', name: 'Visibility', icon: BarChart3 },
  { id: 'sentiment', name: 'Sentiment', icon: TrendingUp },
  { id: 'prompts', name: 'Prompts', icon: MessageSquare },
  { id: 'platforms', name: 'Platforms', icon: Globe },
  { id: 'regions', name: 'Regions', icon: Globe },
  { id: 'citations', name: 'Citations', icon: ArrowUpRight },
]

export default function Insights() {
  const [activeTab, setActiveTab] = useState('visibility')
  const [timeRange, setTimeRange] = useState('7d')
  const [comparisonPeriod, setComparisonPeriod] = useState('previous')
  const { selectedBrand } = useBrand()

  if (!selectedBrand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Selected</h3>
        <p className="text-gray-500 mb-4">Select a company to view insights</p>
        <Button onClick={() => window.location.href = '/setup'}>
          Add Company
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{selectedBrand.name}</h1>
          <p className="text-gray-600 mt-1">
            Answer Engine Insights and Competitive Analysis
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-md px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Comparison Toggle */}
          <div className="relative">
            <select 
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-md px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="previous">vs. Previous Period</option>
              <option value="year">vs. Year Ago</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <Button variant="outline" size="sm">
            Export 6.3k answers
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'visibility' && (
        <div className="space-y-8">
          {/* Visibility Score */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Visibility Score</h3>
              <p className="text-sm text-gray-500">
                How often {selectedBrand.name} appears in AI-generated answers
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Display */}
              <div>
                <div className="flex items-end gap-4 mb-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {mockData.visibilityScore}%
                  </div>
                  <div className="flex items-center text-green-600 font-medium">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    +{mockData.visibilityChange}%
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">Visibility Score</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">#{mockData.visibilityRank}</span>
                    <span className="text-sm text-gray-500">Visibility Score Rank</span>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Visibility Trend Chart</p>
                  <p className="text-xs text-gray-400">Coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Competitor Rankings */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Asset</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Visibility Score</span>
                  <Button variant="outline" size="sm">
                    Compare competitors
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mockData.competitors.map((competitor, index) => (
                <div key={competitor.name} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium text-gray-500">
                      {index + 1}.
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {competitor.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{competitor.name}</span>
                      {index === 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="font-medium">{competitor.score}%</span>
                    <div className={`flex items-center text-sm font-medium ${
                      competitor.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {competitor.change > 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(competitor.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share of Voice */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share of Voice</h3>
              <p className="text-sm text-gray-500">
                Mentions of {selectedBrand.name} in AI-generated answers in relation to competitors
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-end gap-4 mb-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {mockData.shareOfVoice}%
                  </div>
                  <div className="flex items-center text-red-600 font-medium">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    {Math.abs(mockData.shareOfVoiceChange)}%
                  </div>
                </div>
                <div className="text-sm text-gray-500">Share of Voice</div>
              </div>

              {/* Pie Chart Placeholder */}
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Share of Voice Chart</p>
                  <p className="text-xs text-gray-400">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tab content placeholders */}
      {activeTab !== 'visibility' && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tabs.find(tab => tab.id === activeTab)?.name} Analysis
          </h3>
          <p className="text-gray-500 mb-4">
            Comprehensive {activeTab} analysis coming soon
          </p>
          <p className="text-sm text-gray-400">
            This feature will be available in the next development phase
          </p>
        </div>
      )}
    </div>
  )
}