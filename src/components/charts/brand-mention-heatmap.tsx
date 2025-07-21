'use client'

interface HeatmapData {
  date: string
  hour: number
  mentions: number
  sentiment: number
}

interface BrandMentionHeatmapProps {
  data: HeatmapData[]
}

export function BrandMentionHeatmap({ data }: BrandMentionHeatmapProps) {
  // Get unique dates and sort them
  const dates = Array.from(new Set(data.map(d => d.date))).sort()
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Find max mentions for scaling
  const maxMentions = Math.max(...data.map(d => d.mentions), 1)

  // Get cell data for specific date and hour
  const getCellData = (date: string, hour: number) => {
    return data.find(d => d.date === date && d.hour === hour) || { 
      date, 
      hour, 
      mentions: 0, 
      sentiment: 0 
    }
  }

  // Get color intensity based on mentions
  const getIntensity = (mentions: number) => {
    return Math.min(mentions / maxMentions, 1)
  }

  // Get background color based on sentiment and intensity
  const getCellColor = (mentions: number, sentiment: number) => {
    const intensity = getIntensity(mentions)
    
    if (mentions === 0) {
      return '#f9fafb' // Very light gray for no mentions
    }
    
    if (sentiment > 0.1) {
      // Positive sentiment - green scale
      return `rgba(16, 185, 129, ${0.2 + intensity * 0.6})`
    } else if (sentiment < -0.1) {
      // Negative sentiment - red scale
      return `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`
    } else {
      // Neutral sentiment - blue scale
      return `rgba(59, 130, 246, ${0.2 + intensity * 0.6})`
    }
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Format hour for display
  const formatHour = (hour: number) => {
    return hour === 0 ? '12 AM' : 
           hour === 12 ? '12 PM' :
           hour < 12 ? `${hour} AM` : 
           `${hour - 12} PM`
  }

  return (
    <div className="w-full space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Activity Level:</span>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border rounded" />
            <span>Low</span>
            <div className="w-4 h-4 bg-blue-300 rounded" />
            <span>Medium</span>
            <div className="w-4 h-4 bg-blue-600 rounded" />
            <span>High</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Sentiment:</span>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded" />
            <span>Negative</span>
            <div className="w-4 h-4 bg-blue-400 rounded" />
            <span>Neutral</span>
            <div className="w-4 h-4 bg-green-400 rounded" />
            <span>Positive</span>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="border rounded-lg p-4 bg-white overflow-x-auto">
        <div className="min-w-max">
          {/* Hour labels */}
          <div className="flex">
            <div className="w-20 flex-shrink-0" /> {/* Space for date labels */}
            {hours.map(hour => (
              <div 
                key={hour} 
                className="w-8 h-8 flex items-center justify-center text-xs text-gray-600"
              >
                {hour % 4 === 0 ? hour : ''}
              </div>
            ))}
          </div>

          {/* Date rows */}
          {dates.map(date => (
            <div key={date} className="flex items-center">
              {/* Date label */}
              <div className="w-20 flex-shrink-0 text-xs text-gray-600 pr-2 text-right">
                {formatDate(date)}
              </div>
              
              {/* Hour cells */}
              {hours.map(hour => {
                const cellData = getCellData(date, hour)
                return (
                  <div
                    key={`${date}-${hour}`}
                    className="w-8 h-8 border border-gray-200 flex items-center justify-center text-xs cursor-pointer hover:border-gray-400 transition-colors"
                    style={{ 
                      backgroundColor: getCellColor(cellData.mentions, cellData.sentiment)
                    }}
                    title={`${formatDate(date)} ${formatHour(hour)}: ${cellData.mentions} mentions, sentiment: ${cellData.sentiment.toFixed(2)}`}
                  >
                    {cellData.mentions > 0 ? cellData.mentions : ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Hour labels at bottom */}
      <div className="flex justify-between text-xs text-gray-500 px-20">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>11 PM</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, d) => sum + d.mentions, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Mentions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {maxMentions}
          </div>
          <div className="text-sm text-gray-600">Peak Hour</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.filter(d => d.mentions > 0).length}
          </div>
          <div className="text-sm text-gray-600">Active Hours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {(data.filter(d => d.mentions > 0).reduce((sum, d) => sum + d.sentiment, 0) / 
              Math.max(data.filter(d => d.mentions > 0).length, 1)).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Avg Sentiment</div>
        </div>
      </div>
    </div>
  )
}