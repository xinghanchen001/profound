'use client'

import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Users } from 'lucide-react'

interface CompanyInsights {
  company_id: string
  company_name: string
  total_mentions: number
  sentiment_score: number
  citation_count: number
  top_platforms: string[]
  weakest_platform: string
  trending_keywords: string[]
  competitor_gaps: string[]
  content_opportunities: string[]
}

interface ActionableInsightsProps {
  insights: CompanyInsights
}

export function ActionableInsights({ insights }: ActionableInsightsProps) {
  const getSentimentStatus = () => {
    if (insights.sentiment_score >= 0.5) return { status: 'excellent', icon: CheckCircle, color: 'text-green-600' }
    if (insights.sentiment_score >= 0.2) return { status: 'good', icon: TrendingUp, color: 'text-blue-600' }
    if (insights.sentiment_score >= 0) return { status: 'neutral', icon: Target, color: 'text-yellow-600' }
    return { status: 'needs attention', icon: AlertTriangle, color: 'text-red-600' }
  }

  const getCitationRate = () => {
    const rate = insights.total_mentions > 0 ? (insights.citation_count / insights.total_mentions) * 100 : 0
    return rate
  }

  const sentiment = getSentimentStatus()
  const citationRate = getCitationRate()

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Target className="h-5 w-5 mr-2 text-blue-600" />
        Quick Insights & Opportunities
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sentiment Analysis */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Brand Sentiment</h4>
            <sentiment.icon className={`h-5 w-5 ${sentiment.color}`} />
          </div>
          <div className="text-2xl font-bold mb-1">{insights.sentiment_score.toFixed(2)}</div>
          <div className={`text-sm ${sentiment.color} capitalize`}>
            {sentiment.status}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {insights.sentiment_score >= 0.2 
              ? 'Your brand sentiment is positive across AI platforms'
              : 'Focus on improving brand perception and addressing concerns'
            }
          </div>
        </div>

        {/* Citation Performance */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Citation Rate</h4>
            {citationRate >= 30 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-orange-600" />
            )}
          </div>
          <div className="text-2xl font-bold mb-1">{citationRate.toFixed(1)}%</div>
          <div className={`text-sm ${citationRate >= 30 ? 'text-green-600' : 'text-orange-600'}`}>
            {citationRate >= 30 ? 'Strong authority' : 'Room for improvement'}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {citationRate >= 30 
              ? 'Your content is frequently cited as a source'
              : 'Optimize content to increase source attribution'
            }
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Platform Coverage</h4>
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold mb-1">{insights.top_platforms.length}</div>
          <div className="text-sm text-purple-600">Active platforms</div>
          <div className="text-xs text-gray-500 mt-2">
            Strongest on: {insights.top_platforms[0] || 'N/A'}
          </div>
        </div>
      </div>

      {/* Key Opportunities */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Keywords */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Trending Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {insights.trending_keywords.slice(0, 5).map((keyword, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
          {insights.trending_keywords.length === 0 && (
            <p className="text-sm text-gray-500 italic">No trending keywords identified</p>
          )}
        </div>

        {/* Immediate Actions */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Priority Actions</h4>
          <div className="space-y-2">
            {insights.sentiment_score < 0.2 && (
              <div className="flex items-center text-sm text-red-700 bg-red-50 p-2 rounded">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Address negative sentiment patterns
              </div>
            )}
            
            {citationRate < 20 && (
              <div className="flex items-center text-sm text-orange-700 bg-orange-50 p-2 rounded">
                <TrendingUp className="h-4 w-4 mr-2" />
                Improve content authority and citations
              </div>
            )}
            
            {insights.weakest_platform !== 'Unknown' && (
              <div className="flex items-center text-sm text-blue-700 bg-blue-50 p-2 rounded">
                <Target className="h-4 w-4 mr-2" />
                Expand presence on {insights.weakest_platform}
              </div>
            )}

            {insights.content_opportunities.length > 0 && (
              <div className="flex items-center text-sm text-green-700 bg-green-50 p-2 rounded">
                <CheckCircle className="h-4 w-4 mr-2" />
                Create content for {insights.content_opportunities.length} opportunity areas
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
        <h4 className="font-medium text-gray-900 mb-2">Strategic Focus Areas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-800">Short Term (1-30 days)</div>
            <ul className="text-gray-600 mt-1 space-y-1">
              <li>• Monitor sentiment trends</li>
              <li>• Optimize existing content</li>
              <li>• Address immediate concerns</li>
            </ul>
          </div>
          
          <div>
            <div className="font-medium text-blue-800">Medium Term (1-3 months)</div>
            <ul className="text-gray-600 mt-1 space-y-1">
              <li>• Expand platform presence</li>
              <li>• Create authority content</li>
              <li>• Competitive positioning</li>
            </ul>
          </div>
          
          <div>
            <div className="font-medium text-blue-800">Long Term (3+ months)</div>
            <ul className="text-gray-600 mt-1 space-y-1">
              <li>• Thought leadership</li>
              <li>• Market share growth</li>
              <li>• AI platform partnerships</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}