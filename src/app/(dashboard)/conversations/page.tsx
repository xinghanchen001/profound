'use client'

import { useState } from 'react'
import { useBrand } from '@/contexts/brand-context'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Download,
  Calendar,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'

// Mock data for conversation analysis
const mockConversationData = {
  totalConversations: 3247,
  totalMentions: 156,
  avgSentiment: 0.34,
  topPlatforms: [
    { name: 'ChatGPT', conversations: 1523, mentions: 89, sentiment: 0.42 },
    { name: 'Perplexity', conversations: 945, mentions: 34, sentiment: 0.18 },
    { name: 'Claude', conversations: 523, mentions: 21, sentiment: 0.56 },
    { name: 'Copilot', conversations: 256, mentions: 12, sentiment: 0.29 },
  ],
  recentConversations: [
    {
      id: '1',
      query: 'What are the best project management tools for remote teams?',
      platform: 'ChatGPT',
      timestamp: '2 minutes ago',
      mentions: 3,
      sentiment: 'positive',
      response: 'For remote teams, I recommend several excellent project management tools...',
    },
    {
      id: '2', 
      query: 'How do I choose between different SaaS solutions for my startup?',
      platform: 'Perplexity',
      timestamp: '8 minutes ago',
      mentions: 1,
      sentiment: 'neutral',
      response: 'When selecting SaaS solutions for your startup, consider factors like...',
    },
    {
      id: '3',
      query: 'What are the latest trends in business automation software?',
      platform: 'Claude',
      timestamp: '15 minutes ago',
      mentions: 2,
      sentiment: 'positive',
      response: 'Business automation is rapidly evolving with several key trends...',
    },
  ]
}

export default function Conversations() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedSentiment, setSelectedSentiment] = useState('all')
  const { selectedBrand } = useBrand()

  if (!selectedBrand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Selected</h3>
        <p className="text-gray-500 mb-4">Select a company to analyze AI conversations</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
          <p className="text-gray-600 mt-1">
            AI conversations mentioning {selectedBrand.name} across platforms
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range */}
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Conversations
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {mockConversationData.totalConversations.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 font-medium">
                +15%
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Total Conversations</div>
            <div className="text-sm text-gray-600">Across all platforms</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {mockConversationData.totalMentions}
              </div>
              <div className="text-sm text-green-600 font-medium">
                +23%
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Brand Mentions</div>
            <div className="text-sm text-gray-600">In conversations</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {mockConversationData.avgSentiment > 0 ? '+' : ''}{(mockConversationData.avgSentiment * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-600 font-medium">
                +5.2%
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Avg Sentiment</div>
            <div className="text-sm text-gray-600">Overall sentiment</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                2m
              </div>
              <div className="text-sm text-gray-500">
                ago
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Latest Mention</div>
            <div className="text-sm text-gray-600">Most recent</div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Platform Performance</h3>
          <p className="text-sm text-gray-600 mt-1">
            Conversation volume and mention rates by AI platform
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockConversationData.topPlatforms.map((platform, index) => (
            <div key={platform.name} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{platform.name}</div>
                  <div className="text-sm text-gray-600">
                    {platform.conversations.toLocaleString()} conversations
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8 text-right">
                <div>
                  <div className="font-medium text-gray-900">{platform.mentions} mentions</div>
                  <div className="text-sm text-gray-600">
                    Sentiment: {platform.sentiment > 0 ? '+' : ''}{(platform.sentiment * 100).toFixed(1)}%
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Conversations</h3>
              <p className="text-sm text-gray-600 mt-1">
                Latest AI conversations mentioning your brand
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Platforms</option>
                <option value="chatgpt">ChatGPT</option>
                <option value="perplexity">Perplexity</option>
                <option value="claude">Claude</option>
              </select>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockConversationData.recentConversations.map((conversation) => (
            <div key={conversation.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{conversation.platform}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{conversation.timestamp}</span>
                  </div>
                  <p className="text-gray-900 mb-2 font-medium">
                    "{conversation.query}"
                  </p>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {conversation.response}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    {conversation.mentions} mentions
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    conversation.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    conversation.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {conversation.sentiment}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  View Full Conversation
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Coming Soon */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Search className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Advanced Conversation Analytics
            </h3>
            <p className="text-blue-700 mb-4">
              Deep conversation analysis, sentiment tracking over time, topic clustering, and competitor mention analysis coming soon.
            </p>
            <div className="flex items-center gap-4">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Request Early Access
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