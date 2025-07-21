'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { RecommendationCard } from '@/components/actions/recommendation-card'
import { ActionableInsights } from '@/components/actions/actionable-insights'
import { ContentSuggestions } from '@/components/actions/content-suggestions'
import { CompetitorActions } from '@/components/actions/competitor-actions'
import { ActionsService } from '@/lib/api/actions'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  Lightbulb, 
  Users, 
  Search,
  RefreshCw,
  Download
} from 'lucide-react'

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

interface CompanyInsights {
  company_id: string
  company_name: string
  total_mentions: number
  sentiment_score: number
  citation_count: number
  top_platforms: string[]
  weakest_platform: string
  trending_keywords: string[]
  competitor_gaps: string[]
  content_opportunities: string[]
}

export default function Actions() {
  const [companies, setCompanies] = useState<Array<{id: string, name: string}>>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [insights, setInsights] = useState<CompanyInsights | null>(null)
  const [recommendations, setRecommendations] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'optimization' | 'content' | 'competitive' | 'technical'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      loadCompanyActions()
    }
  }, [selectedCompany]) // loadCompanyActions is recreated on each render

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      
      if (data && data.length > 0) {
        setCompanies(data)
        setSelectedCompany(data[0].id)
      }
    } catch (error) {
      console.error('Error loading companies:', error)
    }
  }

  const loadCompanyActions = async () => {
    if (!selectedCompany) return

    setLoading(true)
    try {
      // Generate insights and recommendations
      const [companyInsights, actionRecommendations] = await Promise.all([
        ActionsService.generateCompanyInsights(selectedCompany),
        ActionsService.generateRecommendations(selectedCompany)
      ])

      setInsights(companyInsights)
      setRecommendations(actionRecommendations)
    } catch (error) {
      console.error('Error loading company actions:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewRecommendations = async () => {
    if (!selectedCompany) return

    setLoading(true)
    try {
      const newRecommendations = await ActionsService.generateRecommendations(selectedCompany)
      setRecommendations(newRecommendations)
    } catch (error) {
      console.error('Error generating new recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportRecommendations = () => {
    if (!recommendations.length || !insights) return

    const exportData = {
      company: companies.find(c => c.id === selectedCompany)?.name,
      generated_at: new Date().toISOString(),
      insights,
      recommendations: recommendations.map(rec => ({
        type: rec.type,
        priority: rec.priority,
        title: rec.title,
        description: rec.description,
        impact: rec.impact,
        effort: rec.effort,
        actionable_steps: rec.actionable_steps,
        expected_outcome: rec.expected_outcome,
        metrics_to_track: rec.metrics_to_track
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `action-recommendations-${Date.now()}.json`
    a.click()
  }

  const filteredRecommendations = recommendations.filter(rec => {
    const typeMatch = activeTab === 'all' || rec.type === activeTab
    const priorityMatch = priorityFilter === 'all' || rec.priority === priorityFilter
    return typeMatch && priorityMatch
  })

  const selectedCompanyName = companies.find(c => c.id === selectedCompany)?.name || 'Company'

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="h-5 w-5" />
      case 'content': return <Lightbulb className="h-5 w-5" />
      case 'competitive': return <Users className="h-5 w-5" />
      case 'technical': return <Search className="h-5 w-5" />
      default: return <TrendingUp className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Action Center</h1>
              <p className="text-muted-foreground">
                AI-powered recommendations and actionable insights for {selectedCompanyName}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Company Selector */}
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>

              <Button
                onClick={generateNewRecommendations}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>

              <Button
                onClick={exportRecommendations}
                disabled={!recommendations.length}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button onClick={loadCompanyActions} disabled={loading} size="sm">
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {!selectedCompany ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a company to view recommendations</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
              <p className="text-muted-foreground">Generating AI-powered recommendations...</p>
            </div>
          ) : (
            <>
              {/* Company Insights Overview */}
              {insights && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="border rounded-lg p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{insights.total_mentions}</div>
                    <div className="text-sm text-muted-foreground">Total Mentions</div>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{insights.sentiment_score.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Sentiment Score</div>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <Search className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{insights.citation_count}</div>
                    <div className="text-sm text-muted-foreground">Citations</div>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">{filteredRecommendations.length}</div>
                    <div className="text-sm text-muted-foreground">Action Items</div>
                  </div>
                </div>
              )}

              {/* Quick Insights */}
              {insights && (
                <ActionableInsights insights={insights} />
              )}

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Category:</span>
                  <div className="flex gap-1">
                    {['all', 'optimization', 'content', 'competitive', 'technical'].map(tab => (
                      <Button
                        key={tab}
                        variant={activeTab === tab ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab(tab as 'all' | 'optimization' | 'content' | 'competitive' | 'technical')}
                        className="capitalize"
                      >
                        {getTypeIcon(tab)}
                        <span className="ml-1">{tab}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Priority:</span>
                  <div className="flex gap-1">
                    {['all', 'high', 'medium', 'low'].map(priority => (
                      <Button
                        key={priority}
                        variant={priorityFilter === priority ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPriorityFilter(priority as 'all' | 'high' | 'medium' | 'low')}
                        className={`capitalize ${priority !== 'all' ? getPriorityColor(priority) : ''}`}
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations Grid */}
              <div className="space-y-6">
                {filteredRecommendations.length === 0 ? (
                  <div className="text-center py-12">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-muted-foreground">No recommendations found for the selected filters</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your filters or generate new recommendations
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredRecommendations.map((recommendation) => (
                      <RecommendationCard
                        key={recommendation.id}
                        recommendation={recommendation}
                        onAction={(action) => console.log('Action:', action, recommendation.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Components */}
              {insights && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ContentSuggestions 
                    opportunities={insights.content_opportunities}
                  />
                  <CompetitorActions 
                    gaps={insights.competitor_gaps}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}