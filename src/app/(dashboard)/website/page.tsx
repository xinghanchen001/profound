'use client'

import { useState } from 'react'
import { useBrand } from '@/contexts/brand-context'
import { Button } from '@/components/ui/button'
import { 
  Globe, 
  Bot, 
  Activity, 
  ExternalLink,
  TrendingUp,
  Users,
  Clock,
  Search
} from 'lucide-react'

// Mock data for bot traffic
const mockBotData = {
  totalVisits: 547,
  platforms: [
    { name: 'ChatGPT', visits: 532, lastIndexed: '3 hours ago', userAgent: 'ChatGPT-User' },
    { name: 'Google AI', visits: 89, lastIndexed: '1 day ago', userAgent: 'Google-Extended' },
    { name: 'Perplexity', visits: 45, lastIndexed: '2 days ago', userAgent: 'PerplexityBot' },
    { name: 'Copilot', visits: 23, lastIndexed: '5 days ago', userAgent: 'Microsoft-Copilot' },
  ],
  recentVisits: [
    { timestamp: '2 minutes ago', bot: 'ChatGPT', page: '/about', reason: 'Answer generation' },
    { timestamp: '5 minutes ago', bot: 'ChatGPT', page: '/products', reason: 'Citation lookup' },
    { timestamp: '12 minutes ago', bot: 'Google AI', page: '/pricing', reason: 'Training data' },
    { timestamp: '18 minutes ago', bot: 'ChatGPT', page: '/features', reason: 'Answer generation' },
    { timestamp: '25 minutes ago', bot: 'Perplexity', page: '/blog/guide', reason: 'Citation lookup' },
  ]
}

export default function Website() {
  const { selectedBrand } = useBrand()

  if (!selectedBrand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <Globe className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Selected</h3>
        <p className="text-gray-500 mb-4">Select a company to analyze website bot activity</p>
        <Button onClick={() => window.location.href = '/setup'}>
          Add Company
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Website</h1>
          <p className="text-gray-600 mt-1">
            How answer engines access, scrape, and refer traffic to your pages
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Configure Website
          </Button>
          <Button variant="outline" size="sm">
            View Analytics
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {mockBotData.totalVisits}
              </div>
              <div className="text-sm text-green-600 font-medium">
                +12%
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Total Bot Visits</div>
            <div className="text-sm text-gray-600">Last 7 days</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                4
              </div>
              <div className="text-sm text-gray-500">
                platforms
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Active Platforms</div>
            <div className="text-sm text-gray-600">Indexing content</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                156
              </div>
              <div className="text-sm text-green-600 font-medium">
                +8%
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Referral Traffic</div>
            <div className="text-sm text-gray-600">From AI platforms</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                3h
              </div>
              <div className="text-sm text-gray-500">
                ago
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Last Indexed</div>
            <div className="text-sm text-gray-600">ChatGPT bot</div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Bot Activity by Platform</h3>
          <p className="text-sm text-gray-600 mt-1">
            Broken out by the key answer engines accessing your website
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockBotData.platforms.map((platform, index) => (
            <div key={platform.name} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{platform.name}</div>
                  <div className="text-sm text-gray-600">{platform.userAgent}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-8 text-right">
                <div>
                  <div className="font-medium text-gray-900">{platform.visits} visits</div>
                  <div className="text-sm text-gray-600">Last indexed {platform.lastIndexed}</div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Bot Activity</h3>
              <p className="text-sm text-gray-600 mt-1">
                Real-time log of AI bot visits to your website
              </p>
            </div>
            <Button variant="outline" size="sm">
              View All Logs
            </Button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockBotData.recentVisits.map((visit, index) => (
            <div key={index} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{visit.bot}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{visit.page}</span>
                  </div>
                  <div className="text-sm text-gray-600">{visit.reason}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">{visit.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Analysis */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Most Accessed Pages</h3>
          <p className="text-sm text-gray-600 mt-1">
            Which pages are being indexed and cited most frequently
          </p>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Page Analysis Coming Soon</h4>
            <p className="text-gray-500 mb-4">
              Detailed page-by-page analysis of bot activity and citation patterns
            </p>
            <p className="text-sm text-gray-400">
              Available in the next development phase
            </p>
          </div>
        </div>
      </div>

      {/* Configure Website */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Configure Website Monitoring
            </h3>
            <p className="text-blue-700 mb-4">
              Add your website domain to start tracking AI bot activity and referral traffic from answer engines.
            </p>
            <div className="flex items-center gap-4">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Add Website
              </Button>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}