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
  ArrowDownRight,
  ExternalLink,
  Search,
  Heart,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  MapPin,
  Bot,
  Link
} from 'lucide-react'

// Enhanced mock data with comprehensive analytics
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
  ],
  sentimentData: {
    overall: 0.34,
    overallChange: 0.12,
    breakdown: {
      positive: 68.3,
      neutral: 23.1,
      negative: 8.6
    },
    sentimentTrends: [
      { date: '2024-01-15', positive: 65, neutral: 25, negative: 10 },
      { date: '2024-01-16', positive: 67, neutral: 24, negative: 9 },
      { date: '2024-01-17', positive: 70, neutral: 22, negative: 8 },
      { date: '2024-01-18', positive: 68, neutral: 23, negative: 9 },
      { date: '2024-01-19', positive: 69, neutral: 23, negative: 8 },
      { date: '2024-01-20', positive: 68, neutral: 23, negative: 9 },
      { date: '2024-01-21', positive: 71, neutral: 21, negative: 8 }
    ]
  },
  promptsData: {
    totalPrompts: 8547,
    totalAnswers: 6241,
    responseRate: 73.0,
    topPrompts: [
      { prompt: 'What are the best project management tools?', mentions: 247, responseRate: 89.2 },
      { prompt: 'How to manage remote teams effectively?', mentions: 189, responseRate: 76.8 },
      { prompt: 'Best collaboration software for startups?', mentions: 156, responseRate: 82.1 },
      { prompt: 'Project management for small businesses', mentions: 134, responseRate: 71.6 },
      { prompt: 'Team productivity tools comparison', mentions: 98, responseRate: 85.7 }
    ]
  },
  platformsData: [
    { platform: 'ChatGPT', score: 52.1, mentions: 1834, responseRate: 78.3, growth: 3.2 },
    { platform: 'Perplexity', score: 43.8, mentions: 892, responseRate: 68.7, growth: 1.9 },
    { platform: 'Claude', score: 49.2, mentions: 456, responseRate: 82.1, growth: -1.4 },
    { platform: 'Google AI', score: 38.7, mentions: 298, responseRate: 65.2, growth: 4.8 },
    { platform: 'Copilot', score: 35.4, mentions: 167, responseRate: 59.8, growth: 2.3 }
  ],
  regionsData: [
    { region: 'North America', score: 51.2, mentions: 2145, growth: 2.8 },
    { region: 'Europe', score: 44.7, mentions: 1456, growth: 1.5 },
    { region: 'Asia Pacific', score: 39.8, mentions: 892, growth: 8.2 },
    { region: 'Latin America', score: 32.1, mentions: 234, growth: -0.8 },
    { region: 'Middle East & Africa', score: 28.9, mentions: 178, growth: 3.4 }
  ],
  citationsData: {
    totalCitations: 1247,
    citationRate: 23.4,
    citationChange: 8.7,
    topSources: [
      { url: 'https://company.com/features', title: 'Product Features Overview', citations: 189, growth: 12.3 },
      { url: 'https://company.com/pricing', title: 'Pricing Plans', citations: 156, growth: -3.2 },
      { url: 'https://company.com/blog/guide', title: 'Ultimate Guide to Project Management', citations: 134, growth: 18.7 },
      { url: 'https://company.com/about', title: 'About Our Company', citations: 98, growth: 5.1 },
      { url: 'https://company.com/case-studies', title: 'Customer Success Stories', citations: 87, growth: 22.4 }
    ],
    citationTypes: {
      direct: 67.8,
      indirect: 24.1,
      contextual: 8.1
    }
  }
}

const tabs = [
  { id: 'visibility', name: 'Visibility', icon: BarChart3 },
  { id: 'sentiment', name: 'Sentiment', icon: Heart },
  { id: 'prompts', name: 'Prompts', icon: MessageSquare },
  { id: 'platforms', name: 'Platforms', icon: Bot },
  { id: 'regions', name: 'Regions', icon: MapPin },
  { id: 'citations', name: 'Citations', icon: ExternalLink },
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

      {/* Sentiment Analysis Tab */}
      {activeTab === 'sentiment' && (
        <div className="space-y-8">
          {/* Sentiment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Overall Sentiment</h3>
              <div className="flex items-end gap-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  {mockData.sentimentData.overall > 0 ? '+' : ''}{(mockData.sentimentData.overall * 100).toFixed(1)}%
                </div>
                <div className="flex items-center text-green-600 font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +{(mockData.sentimentData.overallChange * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-6">Overall sentiment score</div>

              {/* Sentiment Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smile className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Positive</span>
                  </div>
                  <span className="text-sm font-medium">{mockData.sentimentData.breakdown.positive}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${mockData.sentimentData.breakdown.positive}%` }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Meh className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Neutral</span>
                  </div>
                  <span className="text-sm font-medium">{mockData.sentimentData.breakdown.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: `${mockData.sentimentData.breakdown.neutral}%` }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Frown className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Negative</span>
                  </div>
                  <span className="text-sm font-medium">{mockData.sentimentData.breakdown.negative}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: `${mockData.sentimentData.breakdown.negative}%` }}></div>
                </div>
              </div>
            </div>

            {/* Sentiment Trends Chart Placeholder */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Sentiment Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Sentiment Trend Chart</p>
                  <p className="text-xs text-gray-400">7-day sentiment progression</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompts Analysis Tab */}
      {activeTab === 'prompts' && (
        <div className="space-y-8">
          {/* Prompts Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockData.promptsData.totalPrompts.toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Total Prompts</div>
                <div className="text-sm text-gray-600">Analyzed queries</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockData.promptsData.totalAnswers.toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Brand Answers</div>
                <div className="text-sm text-gray-600">Mentions generated</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockData.promptsData.responseRate}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Response Rate</div>
                <div className="text-sm text-gray-600">Brand mentioned</div>
              </div>
            </div>
          </div>

          {/* Top Prompts */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Top Performing Prompts</h3>
              <p className="text-sm text-gray-600 mt-1">
                Queries that mention {selectedBrand.name} most frequently
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mockData.promptsData.topPrompts.map((prompt, index) => (
                <div key={index} className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">"{prompt.prompt}"</p>
                      <p className="text-sm text-gray-600">
                        {prompt.mentions} mentions • {prompt.responseRate}% response rate
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm">
                      Optimize
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platforms Analysis Tab */}
      {activeTab === 'platforms' && (
        <div className="space-y-8">
          {/* Platform Performance */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Platform Performance</h3>
              <p className="text-sm text-gray-600 mt-1">
                Brand visibility across AI platforms
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mockData.platformsData.map((platform) => (
                <div key={platform.platform} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Bot className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{platform.platform}</div>
                        <div className="text-sm text-gray-600">
                          {platform.mentions} mentions • {platform.responseRate}% response rate
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <div className="font-medium text-gray-900">{platform.score}%</div>
                        <div className="text-sm text-gray-600">visibility score</div>
                      </div>
                      <div className={`text-sm font-medium flex items-center ${
                        platform.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {platform.growth > 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(platform.growth)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${platform.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Regional Analysis Tab */}
      {activeTab === 'regions' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Regional Performance</h3>
              <p className="text-sm text-gray-600 mt-1">
                Brand visibility by geographic region
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mockData.regionsData.map((region, index) => (
                <div key={region.region} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{region.region}</div>
                      <div className="text-sm text-gray-600">
                        {region.mentions} mentions
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <div className="font-medium text-gray-900">{region.score}%</div>
                      <div className="text-sm text-gray-600">visibility score</div>
                    </div>
                    <div className={`text-sm font-medium flex items-center ${
                      region.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {region.growth > 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(region.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Citations Analysis Tab */}
      {activeTab === 'citations' && (
        <div className="space-y-8">
          {/* Citation Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockData.citationsData.totalCitations.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    +{mockData.citationsData.citationChange}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Total Citations</div>
                <div className="text-sm text-gray-600">All time</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Link className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockData.citationsData.citationRate}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Citation Rate</div>
                <div className="text-sm text-gray-600">Responses with citations</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockData.citationsData.citationTypes.direct}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Direct Citations</div>
                <div className="text-sm text-gray-600">Primary references</div>
              </div>
            </div>
          </div>

          {/* Top Cited Sources */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Most Cited Sources</h3>
              <p className="text-sm text-gray-600 mt-1">
                Pages from your website referenced by AI platforms
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mockData.citationsData.topSources.map((source, index) => (
                <div key={index} className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{source.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{source.url}</p>
                      <p className="text-sm text-gray-500">
                        {source.citations} citations
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-4">
                    <div className={`text-sm font-medium flex items-center ${
                      source.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {source.growth > 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(source.growth)}%
                    </div>
                    <Button variant="outline" size="sm">
                      Optimize
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citation Types */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Citation Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Direct Citations</span>
                <span className="text-sm font-medium">{mockData.citationsData.citationTypes.direct}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${mockData.citationsData.citationTypes.direct}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Indirect Citations</span>
                <span className="text-sm font-medium">{mockData.citationsData.citationTypes.indirect}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${mockData.citationsData.citationTypes.indirect}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contextual Citations</span>
                <span className="text-sm font-medium">{mockData.citationsData.citationTypes.contextual}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${mockData.citationsData.citationTypes.contextual}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}