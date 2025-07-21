'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { PlatformPerformance } from '@/lib/api/analytics'

interface PlatformPerformanceChartProps {
  data: PlatformPerformance[]
  height?: number
}

export function PlatformPerformanceChart({ data, height = 300 }: PlatformPerformanceChartProps) {
  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'avgSentiment':
        return [value.toFixed(2), 'Avg Sentiment']
      case 'responseTime':
        return [`${value}ms`, 'Response Time']
      case 'cost':
        return [`$${value}`, 'Cost']
      default:
        return [value, name]
    }
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="platform" 
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
            yAxisId="sentiment"
            orientation="right"
            domain={[-1, 1]}
            tick={{ fontSize: 12 }}
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
            yAxisId="count"
            dataKey="citations"
            fill="#10b981"
            name="Citations"
            radius={[2, 2, 0, 0]}
          />
          
          <Bar
            yAxisId="sentiment"
            dataKey="avgSentiment"
            fill="#8b5cf6"
            name="Avg Sentiment"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}