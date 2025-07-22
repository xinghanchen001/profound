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
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

// Mock data for the overview - replace with real data later
const mockMetrics = {
  visibilityScore: 48.3,
  visibilityChange: 5.5,
  visibilityRank: 1,
  shareOfVoice: 18.9,
  shareOfVoiceChange: -0.1,
  totalMentions: 1247,
  mentionsChange: 12.3,
  activePlatforms: 4
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
                  <div className="text-sm text-green-600 font-medium">
                    +{mockMetrics.visibilityChange}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Visibility Score</div>
                <div className="text-sm text-gray-600">Rank #{mockMetrics.visibilityRank}</div>
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
                  <div className="text-sm text-red-600 font-medium">
                    {mockMetrics.shareOfVoiceChange}%
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Share of Voice</div>
                <div className="text-sm text-gray-600">vs competitors</div>
              </div>
            </div>

            {/* Total Mentions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
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

            {/* Active Platforms */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockMetrics.activePlatforms}
                  </div>
                  <div className="text-sm text-gray-500">
                    platforms
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Active Platforms</div>
                <div className="text-sm text-gray-600">Being monitored</div>
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