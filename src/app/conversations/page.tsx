'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ConversationList } from '@/components/conversations/conversation-list'
import { ConversationDetail } from '@/components/conversations/conversation-detail'
import { ConversationFilters } from '@/components/conversations/conversation-filters'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { MessageSquare, Search, Filter, Download } from 'lucide-react'

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

interface ConversationFilters {
  platform: string
  sentiment: string
  dateRange: string
  company: string
  searchQuery: string
}

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [companies, setCompanies] = useState<Array<{id: string, name: string}>>([])
  const [platforms, setPlatforms] = useState<Array<{id: string, name: string}>>([])
  const [filters, setFilters] = useState<ConversationFilters>({
    platform: 'all',
    sentiment: 'all',
    dateRange: '30d',
    company: '',
    searchQuery: ''
  })
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, []) // loadInitialData is stable

  useEffect(() => {
    loadConversations()
  }, [filters]) // loadConversations is recreated on each render

  const loadInitialData = async () => {
    try {
      // Load companies
      const { data: companiesData } = await supabase
        .from('companies')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

      // Load platforms
      const { data: platformsData } = await supabase
        .from('ai_platforms')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

      if (companiesData) {
        setCompanies(companiesData)
        if (companiesData.length > 0 && !filters.company) {
          setFilters(prev => ({ ...prev, company: companiesData[0].id }))
        }
      }

      if (platformsData) {
        setPlatforms(platformsData)
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }

  const loadConversations = async () => {
    if (!filters.company) return

    setLoading(true)
    try {
      let query = supabase
        .from('ai_queries')
        .select(`
          *,
          ai_platforms(name, provider),
          companies(name),
          ai_responses(
            *,
            brand_mentions(*),
            citations(*)
          )
        `)
        .eq('company_id', filters.company)
        .order('created_at', { ascending: false })

      // Apply platform filter
      if (filters.platform !== 'all') {
        query = query.eq('ai_platform_id', filters.platform)
      }

      // Apply date range filter
      if (filters.dateRange !== 'all') {
        const days = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        query = query.gte('created_at', startDate.toISOString())
      }

      const { data, error } = await query.limit(100)

      if (error) throw error

      let filteredData = data || []

      // Apply search query filter
      if (filters.searchQuery) {
        filteredData = filteredData.filter(conv => 
          conv.query_text.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          conv.ai_responses?.some((resp: Record<string, unknown>) => 
            String(resp.response_text).toLowerCase().includes(filters.searchQuery.toLowerCase())
          )
        )
      }

      // Apply sentiment filter
      if (filters.sentiment !== 'all') {
        filteredData = filteredData.filter(conv =>
          conv.ai_responses?.some((resp: Record<string, unknown>) =>
            (resp.brand_mentions as Record<string, unknown>[])?.some((mention: Record<string, unknown>) =>
              mention.sentiment === filters.sentiment
            )
          )
        )
      }

      setConversations(filteredData as Conversation[])

      // Auto-select first conversation if none selected
      if (filteredData.length > 0 && !selectedConversation) {
        setSelectedConversation(filteredData[0] as Conversation)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Partial<ConversationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setSelectedConversation(null) // Reset selection when filters change
  }

  const exportConversations = () => {
    const exportData = {
      filters,
      conversations: conversations.map(conv => ({
        id: conv.id,
        query: conv.query_text,
        platform: conv.ai_platforms.name,
        created_at: conv.created_at,
        cost: conv.cost,
        mentions_count: conv.ai_responses.reduce((sum, resp) => sum + resp.brand_mentions.length, 0),
        citations_count: conv.ai_responses.reduce((sum, resp) => sum + resp.citations.length, 0),
        avg_sentiment: conv.ai_responses.length > 0 
          ? conv.ai_responses.reduce((sum, resp) => {
              const sentiments = resp.brand_mentions.filter(m => m.sentiment_score !== null)
              return sum + (sentiments.length > 0 ? sentiments.reduce((s, m) => s + m.sentiment_score, 0) / sentiments.length : 0)
            }, 0) / conv.ai_responses.length
          : 0
      })),
      exported_at: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversations-export-${Date.now()}.json`
    a.click()
  }

  const selectedCompanyName = companies.find(c => c.id === filters.company)?.name || 'Company'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Conversations</h1>
              <p className="text-muted-foreground">
                Detailed analysis of AI responses and brand mentions for {selectedCompanyName}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>

              <Button onClick={exportConversations} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button onClick={loadConversations} disabled={loading} size="sm">
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <ConversationFilters
              filters={filters}
              companies={companies}
              platforms={platforms}
              onFilterChange={handleFilterChange}
            />
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border rounded-lg p-4 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{conversations.length}</div>
              <div className="text-sm text-muted-foreground">Total Conversations</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">
                {conversations.reduce((sum, conv) => sum + conv.ai_responses.reduce((s, resp) => s + resp.brand_mentions.length, 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Brand Mentions</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {conversations.reduce((sum, conv) => sum + conv.ai_responses.reduce((s, resp) => s + resp.citations.length, 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Citations Found</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                ${conversations.reduce((sum, conv) => sum + (conv.cost || 0), 0).toFixed(3)}
              </div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </div>
          </div>

          {!filters.company ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a company to view conversations</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading conversations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversation List */}
              <div className="lg:col-span-1">
                <ConversationList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onConversationSelect={setSelectedConversation}
                />
              </div>

              {/* Conversation Detail */}
              <div className="lg:col-span-2">
                {selectedConversation ? (
                  <ConversationDetail conversation={selectedConversation} />
                ) : (
                  <div className="border rounded-lg p-8 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}