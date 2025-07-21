'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface BrandSentimentChartProps {
  data: {
    positive: number
    negative: number
    neutral: number
  }
  height?: number
}

const COLORS = {
  positive: '#10b981',
  negative: '#ef4444', 
  neutral: '#6b7280'
}

export function BrandSentimentChart({ data, height = 300 }: BrandSentimentChartProps) {
  const chartData = [
    { name: 'Positive', value: data.positive, color: COLORS.positive },
    { name: 'Negative', value: data.negative, color: COLORS.negative },
    { name: 'Neutral', value: data.neutral, color: COLORS.neutral }
  ].filter(item => item.value > 0)

  const total = data.positive + data.negative + data.neutral

  const renderCustomTooltip = ({ active, payload }: {active?: boolean, payload?: Array<{name: string, value: number}>}) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0.0'
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            {data.value} mentions ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = (props: Record<string, unknown>) => {
    const value = Number(props.value) || 0
    if (!value) return ''
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
    return `${percentage}%`
  }

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No sentiment data available
      </div>
    )
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value} ({chartData.find(d => d.name === value)?.value || 0})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Summary stats below chart */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data.positive}</div>
          <div className="text-sm text-green-700">Positive</div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{data.negative}</div>
          <div className="text-sm text-red-700">Negative</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{data.neutral}</div>
          <div className="text-sm text-gray-700">Neutral</div>
        </div>
      </div>
    </div>
  )
}