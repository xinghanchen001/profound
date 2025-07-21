'use client'

import { useState } from 'react'
import { Users, TrendingUp, Target, AlertCircle, Eye, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CompetitorActionsProps {
  gaps: string[]
}

export function CompetitorActions({ gaps }: CompetitorActionsProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<'defensive' | 'offensive' | 'all'>('all')

  const competitiveStrategies = [
    {
      id: 1,
      type: 'offensive',
      title: 'Differentiation Content Strategy',
      description: 'Create content that highlights your unique value propositions vs competitors',
      impact: 'High',
      timeline: '30-60 days',
      icon: Target,
      actions: [
        'Analyze competitor content gaps and weaknesses',
        'Create comparison guides showcasing your advantages',
        'Develop unique case studies and success stories',
        'Publish thought leadership in underserved areas'
      ],
      kpis: ['Market share of voice', 'Brand differentiation score', 'Unique mention rate']
    },
    {
      id: 2,
      type: 'defensive',
      title: 'Competitive Monitoring & Response',
      description: 'Monitor competitor activities and respond strategically to maintain position',
      impact: 'Medium',
      timeline: 'Ongoing',
      icon: Eye,
      actions: [
        'Set up competitor mention tracking',
        'Monitor competitor content strategies',
        'Respond to competitive threats quickly',
        'Maintain brand presence in key topics'
      ],
      kpis: ['Response time to threats', 'Mention sentiment vs competitors', 'Topic coverage']
    },
    {
      id: 3,
      type: 'offensive',
      title: 'Thought Leadership Positioning',
      description: 'Establish authority in areas where competitors are less active',
      impact: 'High',
      timeline: '60-90 days',
      icon: TrendingUp,
      actions: [
        'Identify uncontested market segments',
        'Create innovative content formats',
        'Partner with industry influencers',
        'Lead industry conversations'
      ],
      kpis: ['Thought leadership mentions', 'Industry authority score', 'Share of expert quotes']
    },
    {
      id: 4,
      type: 'defensive',
      title: 'Brand Protection & Reputation',
      description: 'Protect brand reputation and correct misinformation about your company',
      impact: 'Critical',
      timeline: 'Immediate',
      icon: AlertCircle,
      actions: [
        'Monitor brand mention accuracy',
        'Correct misinformation proactively',
        'Strengthen positive brand associations',
        'Manage crisis communications'
      ],
      kpis: ['Brand accuracy score', 'Sentiment protection rate', 'Crisis response time']
    }
  ]

  const gapBasedStrategies = gaps.map((gap, index) => ({
    id: `gap-${index}`,
    type: 'offensive' as const,
    title: `Address ${gap} Gap`,
    description: `Competitive strategy to overcome disadvantage in ${gap.toLowerCase()}`,
    impact: 'High',
    timeline: '45-60 days',
    icon: Zap,
    actions: [
      `Research competitor ${gap.toLowerCase()} strategies`,
      `Develop superior ${gap.toLowerCase()} content`,
      `Create ${gap.toLowerCase()} comparison materials`,
      `Monitor ${gap.toLowerCase()} performance improvements`
    ],
    kpis: [`${gap} mention rate`, `${gap} sentiment score`, `${gap} market share`]
  }))

  const allStrategies = [...competitiveStrategies, ...gapBasedStrategies]
  const filteredStrategies = selectedStrategy === 'all' 
    ? allStrategies 
    : allStrategies.filter(s => s.type === selectedStrategy)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'offensive': return 'text-red-600 bg-red-50 border-red-200'
      case 'defensive': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Users className="h-5 w-5 mr-2 text-purple-600" />
          Competitive Actions
        </h3>
        
        {/* Strategy Type Filter */}
        <div className="flex gap-1">
          {['all', 'offensive', 'defensive'].map(type => (
            <Button
              key={type}
              variant={selectedStrategy === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStrategy(type as 'defensive' | 'offensive' | 'all')}
              className="capitalize text-xs"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredStrategies.map((strategy) => {
          const IconComponent = strategy.icon
          return (
            <div key={strategy.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <IconComponent className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{strategy.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(strategy.type)}`}>
                    {strategy.type.toUpperCase()}
                  </span>
                  <span className={`text-xs font-medium ${getImpactColor(strategy.impact)}`}>
                    {strategy.impact} Impact
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-xs text-gray-500">Timeline: {strategy.timeline}</span>
              </div>

              {/* Action Items */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Action Items:</h5>
                <div className="space-y-2">
                  {strategy.actions.map((action, index) => (
                    <div key={index} className="flex items-start text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 mt-2" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Key Performance Indicators:</h5>
                <div className="flex flex-wrap gap-2">
                  {strategy.kpis.map((kpi, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-xs text-gray-500">
                  Expected: Improved competitive positioning
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Monitor
                  </Button>
                  <Button size="sm">
                    Implement
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Competitive Intelligence Summary */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 className="font-medium text-purple-900 mb-2">Competitive Intelligence</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-purple-800 mb-1">Offensive Strategies</div>
            <ul className="text-purple-700 space-y-1">
              <li>• Capture uncontested market segments</li>
              <li>• Highlight unique differentiators</li>
              <li>• Lead thought leadership conversations</li>
              <li>• Create superior content experiences</li>
            </ul>
          </div>
          
          <div>
            <div className="font-medium text-purple-800 mb-1">Defensive Strategies</div>
            <ul className="text-purple-700 space-y-1">
              <li>• Monitor competitive threats</li>
              <li>• Protect brand reputation</li>
              <li>• Maintain market position</li>
              <li>• Respond to competitive moves</li>
            </ul>
          </div>
        </div>
      </div>

      {gaps.length > 0 && (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-2">Identified Competitive Gaps</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {gaps.map((gap, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                {gap}
              </span>
            ))}
          </div>
          <p className="text-sm text-orange-800">
            These areas require strategic focus to match or exceed competitor performance.
          </p>
        </div>
      )}

      {/* Strategic Framework */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-2">Strategic Framework</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-800">Analyze</div>
            <div className="text-gray-600">Monitor competitor activities and identify opportunities</div>
          </div>
          <div>
            <div className="font-medium text-gray-800">Differentiate</div>
            <div className="text-gray-600">Highlight unique value and competitive advantages</div>
          </div>
          <div>
            <div className="font-medium text-gray-800">Execute</div>
            <div className="text-gray-600">Implement strategies and measure results</div>
          </div>
        </div>
      </div>
    </div>
  )
}