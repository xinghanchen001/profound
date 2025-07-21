'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { CompetitorInsight } from '@/lib/api/analytics'

interface CompetitorComparisonChartProps {
  data: CompetitorInsight[]
  height?: number
}

export function CompetitorComparisonChart({ data, height = 300 }: CompetitorComparisonChartProps) {
  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'mentions':
        return [value, 'Mentions']
      case 'sentiment':
        return [value.toFixed(2), 'Sentiment Score']
      case 'share':
        return [`${value}%`, 'Share of Voice']
      default:
        return [value, name]
    }
  }

  const formatSentiment = (sentiment: number) => {
    if (sentiment > 0.2) return 'Positive'
    if (sentiment < -0.2) return 'Negative'
    return 'Neutral'
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.2) return '#10b981'
    if (sentiment < -0.2) return '#ef4444'
    return '#6b7280'
  }

  return (
    <div className="w-full space-y-6">
      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="competitor" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            yAxisId="count"
            orientation="left"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="percentage"
            orientation="right"
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Legend />
          
          <Bar
            yAxisId="count"
            dataKey="mentions"
            fill="#3b82f6"
            name="Mentions"
            radius={[2, 2, 0, 0]}
          />
          
          <Bar
            yAxisId="percentage"
            dataKey="share"
            fill="#8b5cf6"
            name="Share of Voice (%)"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((competitor, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{competitor.competitor}</h4>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSentimentColor(competitor.sentiment) }}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mentions:</span>
                <span className="text-sm font-medium">{competitor.mentions}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Share:</span>
                <span className="text-sm font-medium">{competitor.share}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sentiment:</span>
                <span 
                  className="text-sm font-medium"
                  style={{ color: getSentimentColor(competitor.sentiment) }}
                >
                  {formatSentiment(competitor.sentiment)}
                </span>
              </div>
              
              {/* Share visualization bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${competitor.share}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-2">Market Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Competitors:</span>
            <span className="ml-2 font-medium">{data.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Total Mentions:</span>
            <span className="ml-2 font-medium">
              {data.reduce((sum, c) => sum + c.mentions, 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Avg Sentiment:</span>
            <span className="ml-2 font-medium">
              {(data.reduce((sum, c) => sum + c.sentiment, 0) / data.length).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Market Leader:</span>
            <span className="ml-2 font-medium">
              {data.sort((a, b) => b.share - a.share)[0]?.competitor || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}