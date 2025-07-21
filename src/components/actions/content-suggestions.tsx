'use client'

import { useState } from 'react'
import { Lightbulb, FileText, Video, BookOpen, Zap, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContentSuggestionsProps {
  opportunities: string[]
}

export function ContentSuggestions({ opportunities }: ContentSuggestionsProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'articles' | 'guides' | 'faqs' | 'videos'>('all')

  const contentSuggestions = [
    {
      id: 1,
      type: 'articles',
      title: 'Industry Trends and Analysis',
      description: 'Create thought leadership articles about emerging trends in your industry',
      priority: 'high',
      estimatedTraffic: '5K+ monthly views',
      contentType: 'Blog Articles',
      icon: FileText,
      topics: [
        'Future of [Industry] Technology',
        'Market Analysis and Predictions',
        'Best Practices and Standards',
        'Innovation Spotlights'
      ]
    },
    {
      id: 2,
      type: 'guides',
      title: 'Comprehensive How-To Guides',
      description: 'Detailed implementation guides that AI platforms can reference',
      priority: 'high',
      estimatedTraffic: '3K+ monthly views',
      contentType: 'Technical Guides',
      icon: BookOpen,
      topics: [
        'Step-by-step implementation',
        'Troubleshooting guides',
        'Configuration tutorials',
        'Best practice frameworks'
      ]
    },
    {
      id: 3,
      type: 'faqs',
      title: 'Frequently Asked Questions',
      description: 'Comprehensive FAQ sections addressing common queries',
      priority: 'medium',
      estimatedTraffic: '2K+ monthly views',
      contentType: 'FAQ Pages',
      icon: Lightbulb,
      topics: [
        'Product/service questions',
        'Pricing and plans',
        'Technical support',
        'Integration questions'
      ]
    },
    {
      id: 4,
      type: 'videos',
      title: 'Educational Video Content',
      description: 'Video tutorials and demonstrations for better AI understanding',
      priority: 'medium',
      estimatedTraffic: '4K+ monthly views',
      contentType: 'Video Content',
      icon: Video,
      topics: [
        'Product demonstrations',
        'Tutorial walkthroughs',
        'Expert interviews',
        'Case study presentations'
      ]
    }
  ]

  const opportunityBasedContent = opportunities.map((opportunity, index) => ({
    id: `opp-${index}`,
    type: 'opportunity',
    title: `Content for ${opportunity}`,
    description: `Create targeted content addressing ${opportunity.toLowerCase()} gaps`,
    priority: 'high',
    estimatedTraffic: '1K+ monthly views',
    contentType: 'Opportunity Content',
    icon: Zap,
    topics: [
      `${opportunity} overview`,
      `Common ${opportunity.toLowerCase()} challenges`,
      `${opportunity} solutions and tools`,
      `${opportunity} best practices`
    ]
  }))

  const allSuggestions = [...contentSuggestions, ...opportunityBasedContent]
  const filteredSuggestions = selectedType === 'all' 
    ? allSuggestions 
    : allSuggestions.filter(s => s.type === selectedType)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
          Content Suggestions
        </h3>
        
        {/* Content Type Filter */}
        <div className="flex gap-1">
          {['all', 'articles', 'guides', 'faqs', 'videos'].map(type => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type as 'all' | 'articles' | 'guides' | 'faqs' | 'videos')}
              className="capitalize text-xs"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredSuggestions.map((suggestion) => {
          const IconComponent = suggestion.icon
          return (
            <div key={suggestion.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{suggestion.estimatedTraffic}</span>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  {suggestion.contentType}
                </span>
              </div>

              {/* Topic Suggestions */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Suggested Topics:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestion.topics.map((topic, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-xs text-gray-500">
                  Expected: Higher AI platform visibility & authority
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Research
                  </Button>
                  <Button size="sm">
                    Create Content
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Content Strategy Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Content Strategy Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Focus on comprehensive, authoritative content that AI platforms can easily reference</li>
          <li>• Use clear headings and structured data to improve content discoverability</li>
          <li>• Include specific examples, case studies, and actionable advice</li>
          <li>• Optimize for long-tail keywords and conversational queries</li>
          <li>• Regularly update content to maintain accuracy and relevance</li>
        </ul>
      </div>

      {opportunities.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-900 mb-2">Identified Content Gaps</h4>
          <div className="flex flex-wrap gap-2">
            {opportunities.map((opportunity, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                {opportunity}
              </span>
            ))}
          </div>
          <p className="text-sm text-yellow-800 mt-2">
            These areas represent opportunities where your competitors may have stronger content presence.
          </p>
        </div>
      )}
    </div>
  )
}