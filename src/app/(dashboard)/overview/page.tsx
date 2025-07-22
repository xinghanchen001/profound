'use client'

import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { useBrand } from '@/contexts/brand-context'
import { 
  BarChart3, 
  Globe, 
  MessageSquare, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  ExternalLink,
  Activity,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Bot
} from 'lucide-react'
import Link from 'next/link'

// Enhanced mock data for comprehensive dashboard
const mockMetrics = {
  visibilityScore: 48.3,
  visibilityChange: 5.5,
  visibilityRank: 1,
  shareOfVoice: 18.9,
  shareOfVoiceChange: -0.1,
  totalMentions: 1247,
  mentionsChange: 12.3,
  activePlatforms: 4,
  citationCount: 189,
  citationChange: 8.7,
  avgSentiment: 0.34,
  sentimentChange: 0.12,
  responseRate: 73.2,
  responseRateChange: -2.1,
  competitorRank: 2,
  topKeywords: ['project management', 'team collaboration', 'productivity', 'remote work'],
  recentActivity: [
    { platform: 'ChatGPT', mentions: 23, time: '2 hours ago', sentiment: 'positive' },
    { platform: 'Perplexity', mentions: 8, time: '5 hours ago', sentiment: 'neutral' },
    { platform: 'Claude', mentions: 12, time: '6 hours ago', sentiment: 'positive' },
    { platform: 'Copilot', mentions: 5, time: '8 hours ago', sentiment: 'neutral' }
  ],
  platformPerformance: [
    { platform: 'ChatGPT', score: 52.1, change: 3.2, mentions: 734 },
    { platform: 'Perplexity', score: 43.8, change: 1.9, mentions: 312 },
    { platform: 'Claude', score: 49.2, change: -1.4, mentions: 156 },
    { platform: 'Copilot', score: 38.7, change: 4.8, mentions: 45 }
  ]
}

const getStartedCards = [
  {
    title: 'Learn how your brand shows up in AI',
    description: 'Review your visibility, sentiment, and citations to learn how platforms like ChatGPT, Perplexity, Google AI Overview, and Microsoft Copilot perceive your brand.',
    action: 'View your insights',
    href: '/insights',
    icon: BarChart3,
    color: 'blue'
  },
  {
    title: 'Personalize your brand',
    description: 'Add competitors, configure topics, and customize your analysis parameters to get deeper insights.',
    action: 'Manage settings',
    href: '/setup',
    icon: Target,
    color: 'purple'
  },
  {
    title: 'Learn how AI interprets your website',
    description: 'See which pages get cited, track bot traffic, and understand how AI platforms access your content.',
    action: 'Analyze my website',
    href: '/website',
    icon: Globe,
    color: 'green'
  },
  {
    title: 'Build your answer engine optimization strategy',
    description: 'Get actionable recommendations to improve your visibility and citation share across AI platforms.',
    action: 'View recommendations',
    href: '/actions',
    icon: Zap,
    color: 'orange'
  }
]

export default function Overview() {
  const { selectedBrand, brands } = useBrand()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-600 mt-1">
            {selectedBrand 
              ? `Launch pad for ${selectedBrand.name} analysis`
              : 'Your Answer Engine Optimization launch pad'
            }
          </p>
        </div>
        
        {brands.length === 0 && (
          <Button asChild>
            <Link href="/setup">
              Add Your First Company
            </Link>
          </Button>
        )}
      </div>

      {/* Get Started Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Get Started</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/setup">
              Add Company
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {getStartedCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.href} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-${card.color}-50`}>
                    <Icon className={`h-6 w-6 text-${card.color}-600`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {card.description}
                    </p>
                    
                    <Button variant="outline" size="sm" asChild>
                      <Link href={card.href} className="inline-flex items-center gap-2">
                        {card.action}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* High-Level Metrics Preview */}
      {selectedBrand && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedBrand.name} Performance
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/insights">
                View Full Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Primary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Visibility Score */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockMetrics.visibilityScore}%
                  </div>
                  <div className="text-sm text-green-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{mockMetrics.visibilityChange}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Visibility Score</div>
                <div className="text-sm text-gray-600">Rank #{mockMetrics.visibilityRank} overall</div>
              </div>
            </div>

            {/* Share of Voice */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockMetrics.shareOfVoice}%
                  </div>
                  <div className="text-sm text-red-600 font-medium flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    {mockMetrics.shareOfVoiceChange}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Share of Voice</div>
                <div className="text-sm text-gray-600">vs competitors</div>
              </div>
            </div>

            {/* Citations */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <ExternalLink className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockMetrics.citationCount}
                  </div>
                  <div className="text-sm text-green-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{mockMetrics.citationChange}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Total Citations</div>
                <div className="text-sm text-gray-600">Last 30 days</div>
              </div>
            </div>

            {/* Sentiment Score */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockMetrics.avgSentiment > 0 ? '+' : ''}{(mockMetrics.avgSentiment * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{(mockMetrics.sentimentChange * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Avg Sentiment</div>
                <div className="text-sm text-gray-600">Overall tone</div>
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockMetrics.totalMentions.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    +{mockMetrics.mentionsChange}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Total Mentions</div>
                <div className="text-sm text-gray-600">Last 7 days</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Target className="h-5 w-5 text-teal-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockMetrics.responseRate}%
                  </div>
                  <div className="text-sm text-red-600 font-medium">
                    {mockMetrics.responseRateChange}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Response Rate</div>
                <div className="text-sm text-gray-600">Brand mentioned in answers</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    #{mockMetrics.competitorRank}
                  </div>
                  <div className="text-sm text-gray-500">
                    of {mockMetrics.activePlatforms + 3}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Competitor Rank</div>
                <div className="text-sm text-gray-600">In your category</div>
              </div>
            </div>
          </div>
          {/* Platform Performance */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Visibility scores across AI platforms for {selectedBrand.name}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/insights">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mockMetrics.platformPerformance.map((platform) => (
                <div key={platform.platform} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{platform.platform}</div>
                      <div className="text-sm text-gray-600">
                        {platform.mentions} mentions
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <div className="font-medium text-gray-900">{platform.score}%</div>
                      <div className="text-sm text-gray-600">visibility score</div>
                    </div>
                    <div className={`text-sm font-medium flex items-center ${
                      platform.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {platform.change > 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(platform.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity & Top Keywords */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600 mt-1">Latest brand mentions across platforms</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {mockMetrics.recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{activity.platform}</div>
                        <div className="text-xs text-gray-600">{activity.time}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.mentions} mentions
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        activity.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        activity.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.sentiment}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/conversations">
                    View All Activity
                  </Link>
                </Button>
              </div>
            </div>

            {/* Top Keywords */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Top Keywords</h3>
                <p className="text-sm text-gray-600 mt-1">Most mentioned topics related to your brand</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {mockMetrics.topKeywords.map((keyword, index) => (
                    <div key={keyword} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{keyword}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.max(20, 100 - index * 20)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-8 text-right">
                          {Math.max(20, 100 - index * 20)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/insights?tab=prompts">
                    View All Keywords
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What's New Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What's New</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900">Enhanced Competitive Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">
              New competitor ranking system with real-time visibility comparisons across all AI platforms.
            </p>
            <div className="text-xs text-gray-500 mt-2">Added this week</div>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-900">Citations Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">
              Track which pages get cited by AI platforms and optimize your content for better citation share.
            </p>
            <div className="text-xs text-gray-500 mt-2">Coming soon</div>
          </div>
        </div>
      </div>
    </div>
  )
}