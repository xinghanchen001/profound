'use client'

import { format } from 'date-fns'
import { MessageSquare, Clock, DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Conversation {
  id: string
  query_text: string
  created_at: string
  ai_platform_id: string
  company_id: string
  cost: number
  processing_time_ms: number
  ai_platforms: {
    name: string
    provider: string
  }
  companies: {
    name: string
  }
  ai_responses: Array<{
    id: string
    response_text: string
    processing_time_ms: number
    created_at: string
    brand_mentions: Array<{
      id: string
      mention_text: string
      sentiment: string
      sentiment_score: number
      confidence_score: number
      context_before: string
      context_after: string
    }>
    citations: Array<{
      id: string
      citation_text: string
      source_url: string
      domain: string
      citation_type: string
      relevance_score: number
    }>
  }>
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onConversationSelect: (conversation: Conversation) => void
}

export function ConversationList({ 
  conversations, 
  selectedConversation, 
  onConversationSelect 
}: ConversationListProps) {

  const getSentimentIcon = (conversation: Conversation) => {
    const allMentions = conversation.ai_responses.flatMap(resp => resp.brand_mentions)
    if (allMentions.length === 0) return <Minus className="h-4 w-4 text-gray-400" />

    const avgSentiment = allMentions
      .filter(m => m.sentiment_score !== null)
      .reduce((sum, m) => sum + m.sentiment_score, 0) / allMentions.length

    if (avgSentiment > 0.1) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (avgSentiment < -0.1) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getSentimentColor = (conversation: Conversation) => {
    const allMentions = conversation.ai_responses.flatMap(resp => resp.brand_mentions)
    if (allMentions.length === 0) return 'border-gray-200'

    const avgSentiment = allMentions
      .filter(m => m.sentiment_score !== null)
      .reduce((sum, m) => sum + m.sentiment_score, 0) / allMentions.length

    if (avgSentiment > 0.1) return 'border-l-green-500'
    if (avgSentiment < -0.1) return 'border-l-red-500'
    return 'border-l-gray-300'
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, h:mm a')
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  if (conversations.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-muted-foreground">No conversations found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or check back later
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-600 mb-4">
        {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} found
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {conversations.map((conversation) => {
          const isSelected = selectedConversation?.id === conversation.id
          const mentionsCount = conversation.ai_responses.reduce((sum, resp) => sum + resp.brand_mentions.length, 0)
          const citationsCount = conversation.ai_responses.reduce((sum, resp) => sum + resp.citations.length, 0)

          return (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all border-l-4
                ${isSelected 
                  ? 'bg-blue-50 border-blue-200 border-l-blue-500' 
                  : `bg-white hover:bg-gray-50 ${getSentimentColor(conversation)}`
                }
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                    {conversation.ai_platforms.name}
                  </span>
                  {getSentimentIcon(conversation)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(conversation.created_at)}
                </div>
              </div>

              {/* Query Text */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {truncateText(conversation.query_text, 80)}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3 text-blue-600" />
                  <span>{mentionsCount} mentions</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className="text-green-600">📄</span>
                  <span>{citationsCount} citations</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3 text-purple-600" />
                  <span>${(conversation.cost || 0).toFixed(3)}</span>
                </div>
              </div>

              {/* Processing Time */}
              {conversation.processing_time_ms && (
                <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{conversation.processing_time_ms}ms</span>
                </div>
              )}

              {/* Response Preview */}
              {conversation.ai_responses.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  <p className="italic">
                    &quot;{truncateText(conversation.ai_responses[0].response_text, 60)}&quot;
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}