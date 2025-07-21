'use client'

import { useState } from 'react'
import { 
  ChevronDown, 
  ChevronRight, 
  Target, 
  Lightbulb, 
  Users, 
  Search,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle,
  Circle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ActionItem {
  id: string
  type: 'optimization' | 'content' | 'competitive' | 'technical'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
  effort: string
  category: string
  actionable_steps: string[]
  expected_outcome: string
  metrics_to_track: string[]
  created_at: string
}

interface RecommendationCardProps {
  recommendation: ActionItem
  onAction: (action: 'implement' | 'dismiss' | 'save') => void
}

export function RecommendationCard({ recommendation, onAction }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="h-5 w-5 text-blue-600" />
      case 'content': return <Lightbulb className="h-5 w-5 text-yellow-600" />
      case 'competitive': return <Users className="h-5 w-5 text-purple-600" />
      case 'technical': return <Search className="h-5 w-5 text-green-600" />
      default: return <TrendingUp className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactIcon = (impact: string) => {
    if (impact.toLowerCase().includes('high')) return <Zap className="h-4 w-4 text-red-500" />
    if (impact.toLowerCase().includes('medium')) return <TrendingUp className="h-4 w-4 text-yellow-500" />
    return <Circle className="h-4 w-4 text-green-500" />
  }

  const getEffortIcon = (effort: string) => {
    if (effort.toLowerCase().includes('high')) return <Clock className="h-4 w-4 text-red-500" />
    if (effort.toLowerCase().includes('medium')) return <Clock className="h-4 w-4 text-yellow-500" />
    return <Clock className="h-4 w-4 text-green-500" />
  }

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedSteps(newCompleted)
  }

  const progressPercentage = (completedSteps.size / recommendation.actionable_steps.length) * 100

  return (
    <div className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getTypeIcon(recommendation.type)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(recommendation.priority)}`}>
                  {recommendation.priority.toUpperCase()} PRIORITY
                </span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                  {recommendation.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{recommendation.description}</p>

        {/* Impact & Effort */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            {getImpactIcon(recommendation.impact)}
            <div>
              <div className="text-sm font-medium text-gray-900">Impact</div>
              <div className="text-sm text-gray-600">{recommendation.impact}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getEffortIcon(recommendation.effort)}
            <div>
              <div className="text-sm font-medium text-gray-900">Effort</div>
              <div className="text-sm text-gray-600">{recommendation.effort}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {completedSteps.size > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span>View Details</span>
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('save')}
            >
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('dismiss')}
            >
              Dismiss
            </Button>
            <Button
              size="sm"
              onClick={() => onAction('implement')}
            >
              Start Implementation
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Actionable Steps */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Actionable Steps</h4>
            <div className="space-y-2">
              {recommendation.actionable_steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleStep(index)}
                    className={`mt-1 flex-shrink-0 transition-colors ${
                      completedSteps.has(index) 
                        ? 'text-green-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {completedSteps.has(index) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  <span className={`text-sm ${
                    completedSteps.has(index) 
                      ? 'line-through text-gray-500' 
                      : 'text-gray-700'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Outcome */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-2">Expected Outcome</h4>
            <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
              {recommendation.expected_outcome}
            </p>
          </div>

          {/* Metrics to Track */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Key Metrics to Track</h4>
            <div className="flex flex-wrap gap-2">
              {recommendation.metrics_to_track.map((metric, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full border"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-2">Recommended Timeline</h4>
            <div className="text-sm text-gray-600">
              {recommendation.priority === 'high' && 'Start within 1 week, complete within 30 days'}
              {recommendation.priority === 'medium' && 'Start within 2 weeks, complete within 60 days'}
              {recommendation.priority === 'low' && 'Start within 1 month, complete within 90 days'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}