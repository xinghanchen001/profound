'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { 
  MessageSquare, 
  Clock, 
  ExternalLink, 
  Copy, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronDown,
  ChevronRight,
  Quote
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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

interface ConversationDetailProps {
  conversation: Conversation
}

export function ConversationDetail({ conversation }: ConversationDetailProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    query: true,
    response: true,
    mentions: true,
    citations: true
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getSentimentIcon = (sentiment: string, score?: number) => {
    if (sentiment === 'positive' || (score && score > 0.1)) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    }
    if (sentiment === 'negative' || (score && score < -0.1)) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getSentimentColor = (sentiment: string, score?: number) => {
    if (sentiment === 'positive' || (score && score > 0.1)) {
      return 'text-green-600 bg-green-50 border-green-200'
    }
    if (sentiment === 'negative' || (score && score < -0.1)) {
      return 'text-red-600 bg-red-50 border-red-200'
    }
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy at h:mm:ss a')
  }

  const response = conversation.ai_responses[0] // Primary response
  const allMentions = conversation.ai_responses.flatMap(resp => resp.brand_mentions)
  const allCitations = conversation.ai_responses.flatMap(resp => resp.citations)

  return (
    <div className="border rounded-lg bg-white">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Conversation Details</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(conversation.created_at)}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {conversation.ai_platforms.name}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Cost</div>
            <div className="text-lg font-semibold text-green-600">
              ${(conversation.cost || 0).toFixed(4)}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">{allMentions.length}</div>
            <div className="text-sm text-gray-600">Brand Mentions</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">{allCitations.length}</div>
            <div className="text-sm text-gray-600">Citations</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold">
              {conversation.processing_time_ms ? `${conversation.processing_time_ms}ms` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Response Time</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Query Section */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection('query')}
          >
            <h3 className="text-lg font-semibold flex items-center">
              {expandedSections.query ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
              Original Query
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(conversation.query_text)
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          {expandedSections.query && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 whitespace-pre-wrap">{conversation.query_text}</p>
            </div>
          )}
        </div>

        {/* Response Section */}
        {response && (
          <div>
            <div
              className="flex items-center justify-between cursor-pointer mb-3"
              onClick={() => toggleSection('response')}
            >
              <h3 className="text-lg font-semibold flex items-center">
                {expandedSections.response ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
                AI Response
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  copyToClipboard(response.response_text)
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            {expandedSections.response && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {response.response_text}
                </p>
                <div className="mt-3 text-xs text-gray-500 flex items-center space-x-4">
                  <span>Response Time: {response.processing_time_ms || 0}ms</span>
                  <span>Generated: {formatDate(response.created_at)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Brand Mentions Section */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection('mentions')}
          >
            <h3 className="text-lg font-semibold flex items-center">
              {expandedSections.mentions ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
              Brand Mentions ({allMentions.length})
            </h3>
          </div>
          
          {expandedSections.mentions && (
            <div className="space-y-3">
              {allMentions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No brand mentions found in this conversation</p>
                </div>
              ) : (
                allMentions.map((mention) => (
                  <div
                    key={mention.id}
                    className={`border rounded-lg p-4 ${getSentimentColor(mention.sentiment, mention.sentiment_score)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getSentimentIcon(mention.sentiment, mention.sentiment_score)}
                        <span className="font-medium capitalize">{mention.sentiment}</span>
                        {mention.sentiment_score !== null && (
                          <span className="text-sm">({mention.sentiment_score.toFixed(2)})</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Confidence: {(mention.confidence_score * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <strong className="text-sm">Mention:</strong>
                      <p className="text-sm mt-1 font-medium">&quot;{mention.mention_text}&quot;</p>
                    </div>
                    
                    {mention.context_before || mention.context_after ? (
                      <div className="text-sm text-gray-700 bg-white/50 rounded p-2">
                        <strong>Context:</strong>
                        <p className="mt-1">
                          {mention.context_before && <span className="text-gray-600">...{mention.context_before}</span>}
                          <span className="bg-yellow-200 px-1 rounded">{mention.mention_text}</span>
                          {mention.context_after && <span className="text-gray-600">{mention.context_after}...</span>}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Citations Section */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection('citations')}
          >
            <h3 className="text-lg font-semibold flex items-center">
              {expandedSections.citations ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
              Citations ({allCitations.length})
            </h3>
          </div>
          
          {expandedSections.citations && (
            <div className="space-y-3">
              {allCitations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Quote className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No citations found in this conversation</p>
                </div>
              ) : (
                allCitations.map((citation) => (
                  <div key={citation.id} className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Quote className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-purple-800 capitalize">
                          {citation.citation_type}
                        </span>
                        <span className="text-sm text-purple-600">
                          Relevance: {(citation.relevance_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      {citation.source_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(citation.source_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm text-gray-800 italic">
                        &quot;{citation.citation_text}&quot;
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Source: {citation.domain}</span>
                      {citation.source_url && (
                        <span className="text-blue-600 hover:underline cursor-pointer"
                              onClick={() => window.open(citation.source_url, '_blank')}>
                          View Source
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}