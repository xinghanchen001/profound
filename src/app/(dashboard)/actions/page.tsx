'use client'

import { useState } from 'react'
import { useBrand } from '@/contexts/brand-context'
import { Button } from '@/components/ui/button'
import { 
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Users,
  Search,
  RefreshCw,
  Download,
  ChevronRight,
  Clock
} from 'lucide-react'

// Mock data for actionable recommendations
const mockActionsData = {
  totalActions: 14,
  highPriorityActions: 3,
  mediumPriorityActions: 8,
  lowPriorityActions: 3,
  completedThisMonth: 5,
  recommendations: [
    {
      id: '1',
      type: 'optimization',
      priority: 'high',
      title: 'Optimize Product Description Content',
      description: 'Your product descriptions are rarely cited in AI responses. Add more specific technical details and use cases.',
      impact: 'Could increase citations by ~35%',
      effort: 'Medium',
      category: 'Content',
      timeframe: '2-3 days',
    },
    {
      id: '2',
      type: 'competitive',
      priority: 'high',
      title: 'Target Competitor Mention Keywords',
      description: 'Competitors are gaining share on "project management for teams" queries. Create targeted content.',
      impact: 'Potential 20% share gain',
      effort: 'High',
      category: 'SEO',
      timeframe: '1-2 weeks',
    },
    {
      id: '3',
      type: 'content',
      priority: 'high',
      title: 'Create FAQ Content',
      description: 'AI platforms frequently ask about pricing and features. Build comprehensive FAQ section.',
      impact: 'Better answer relevance',
      effort: 'Low',
      category: 'Content',
      timeframe: '1 day',
    },
    {
      id: '4',
      type: 'technical',
      priority: 'medium',
      title: 'Add Structured Data Markup',
      description: 'Implement schema markup for products and reviews to improve AI platform understanding.',
      impact: 'Improved data extraction',
      effort: 'High',
      category: 'Technical',
      timeframe: '1 week',
    },
    {
      id: '5',
      type: 'optimization',
      priority: 'medium',
      title: 'Optimize Image Alt Text',
      description: 'Add descriptive alt text that includes product benefits and use cases.',
      impact: 'Better content context',
      effort: 'Low',
      category: 'Content',
      timeframe: '2 hours',
    },
  ]
}

export default function Actions() {
  const [timeRange, setTimeRange] = useState('30d')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const { selectedBrand } = useBrand()

  if (!selectedBrand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <Zap className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Selected</h3>
        <p className="text-gray-500 mb-4">Select a company to view optimization recommendations</p>
        <Button onClick={() => window.location.href = '/setup'}>
          Add Company
        </Button>
      </div>
    )
  }

  const filteredRecommendations = mockActionsData.recommendations.filter(action => {
    if (filterPriority !== 'all' && action.priority !== filterPriority) return false
    if (filterCategory !== 'all' && action.category !== filterCategory) return false
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return Target
      case 'content': return Lightbulb
      case 'competitive': return Users
      case 'technical': return Search
      default: return AlertCircle
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actions</h1>
          <p className="text-gray-600 mt-1">
            Optimization recommendations for {selectedBrand.name}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Actions
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {mockActionsData.totalActions}
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Total Actions</div>
            <div className="text-sm text-gray-600">Recommendations</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {mockActionsData.highPriorityActions}
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">High Priority</div>
            <div className="text-sm text-gray-600">Urgent actions</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {mockActionsData.completedThisMonth}
              </div>
              <div className="text-sm text-green-600 font-medium">
                +67%
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Completed</div>
            <div className="text-sm text-gray-600">This month</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                85%
              </div>
              <div className="text-sm text-green-600 font-medium">
                +12%
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Success Rate</div>
            <div className="text-sm text-gray-600">Implementation</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold">Filter Actions</h3>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-200 rounded-md px-4 py-2 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-200 rounded-md px-4 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="Content">Content</option>
            <option value="SEO">SEO</option>
            <option value="Technical">Technical</option>
          </select>

          <div className="text-sm text-gray-600">
            Showing {filteredRecommendations.length} of {mockActionsData.totalActions} actions
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        {filteredRecommendations.map((action) => {
          const IconComponent = getTypeIcon(action.type)
          return (
            <div key={action.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                        {action.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{action.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp className="h-4 w-4" />
                        {action.impact}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        {action.timeframe}
                      </span>
                      <span className="text-gray-600">
                        Effort: {action.effort}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {action.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Start Action
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lightbulb className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Smart Action Generator
            </h3>
            <p className="text-blue-700 mb-4">
              Get personalized optimization recommendations based on your brand's AI performance and competitive landscape.
            </p>
            <div className="flex items-center gap-4">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Generate New Actions
              </Button>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                View AI Insights
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}