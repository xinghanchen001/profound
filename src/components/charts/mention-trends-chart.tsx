'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { MentionTrend } from '@/lib/api/analytics'

interface MentionTrendsChartProps {
  data: MentionTrend[]
  height?: number
}

export function MentionTrendsChart({ data, height = 300 }: MentionTrendsChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'sentiment_score':
        return [value.toFixed(2), 'Avg Sentiment']
      case 'mentions':
        return [value, 'Total Mentions']
      case 'positive':
        return [value, 'Positive']
      case 'negative':
        return [value, 'Negative']
      case 'neutral':
        return [value, 'Neutral']
      default:
        return [value, name]
    }
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="mentions"
            orientation="left"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="sentiment"
            orientation="right"
            domain={[-1, 1]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            labelFormatter={(label) => `Date: ${formatDate(label)}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Legend />
          
          <Line
            yAxisId="mentions"
            type="monotone"
            dataKey="mentions"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="Total Mentions"
          />
          
          <Line
            yAxisId="mentions"
            type="monotone"
            dataKey="positive"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            name="Positive"
          />
          
          <Line
            yAxisId="mentions"
            type="monotone"
            dataKey="negative"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
            name="Negative"
          />
          
          <Line
            yAxisId="sentiment"
            type="monotone"
            dataKey="sentiment_score"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
            name="Avg Sentiment"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}