'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MetricCard } from '@/components/charts/metric-card'
import { BrandSentimentChart } from '@/components/charts/brand-sentiment-chart'
import { CompetitorComparisonChart } from '@/components/charts/competitor-comparison-chart'
import { BrandMentionHeatmap } from '@/components/charts/brand-mention-heatmap'
import { AnalyticsService, type CompetitorInsight, type MentionTrend } from '@/lib/api/analytics'
import { getSupabaseClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, MessageSquare, Target, Download } from 'lucide-react'

interface BrandAnalysisData {
  sentimentBreakdown: {
    positive: number
    negative: number
    neutral: number
  }
  mentionSources: Array<{
    platform: string
    mentions: number
    sentiment: number
  }>
  keywordPerformance: Array<{
    keyword: string
    mentions: number
    sentiment: number
    growth: number
  }>
  competitorInsights: CompetitorInsight[]
  heatmapData: Array<{
    date: string
    hour: number
    mentions: number
    sentiment: number
  }>
}

export default function BrandAnalysis() {
  const [analysisData, setAnalysisData] = useState<BrandAnalysisData | null>(null)
  const [sentimentTrends, setSentimentTrends] = useState<MentionTrend[]>([])
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(false)
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all')

  useEffect(() => {
    loadCompanies()
  }, []) // loadCompanies is stable

  useEffect(() => {
    if (selectedCompany) {
      loadAnalysisData()
    }
  }, [selectedCompany, timeRange, selectedSentiment]) // loadAnalysisData is recreated on each render

  const loadCompanies = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      return
    }

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

  const loadAnalysisData = async () => {
    if (!selectedCompany) return

    setLoading(true)
    try {
      const [
        sentimentData,
        mentionTrends,
        competitorData
      ] = await Promise.all([
        loadSentimentBreakdown(),
        AnalyticsService.getMentionTrends(selectedCompany, timeRange),
        loadCompetitorInsights()
      ])

      setAnalysisData({
        sentimentBreakdown: sentimentData.breakdown,
        mentionSources: sentimentData.sources,
        keywordPerformance: sentimentData.keywords,
        competitorInsights: competitorData,
        heatmapData: sentimentData.heatmap
      })
      setSentimentTrends(mentionTrends)
    } catch (error) {
      console.error('Error loading analysis data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSentimentBreakdown = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      return {}
    }

    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get brand mentions with sentiment
    const { data: mentions } = await supabase
      .from('brand_mentions')
      .select(`
        *,
        ai_responses!inner(
          created_at,
          ai_queries!inner(
            company_id,
            ai_platform_id,
            ai_platforms(name)
          )
        ),
        keywords(keyword)
      `)
      .eq('company_id', selectedCompany)
      .gte('ai_responses.created_at', startDate.toISOString())

    const mentionsList = mentions || []

    // Filter by sentiment if specified
    const filteredMentions = selectedSentiment === 'all' 
      ? mentionsList 
      : mentionsList.filter(m => m.sentiment === selectedSentiment)

    // Calculate sentiment breakdown
    const sentimentBreakdown = {
      positive: mentionsList.filter(m => m.sentiment === 'positive').length,
      negative: mentionsList.filter(m => m.sentiment === 'negative').length,
      neutral: mentionsList.filter(m => m.sentiment === 'neutral').length
    }

    // Group by platform
    const platformStats: Record<string, {mentions: number, sentiments: number[]}> = {}
    filteredMentions.forEach(mention => {
      const platform = mention.ai_responses.ai_queries.ai_platforms.name
      if (!platformStats[platform]) {
        platformStats[platform] = { mentions: 0, sentiments: [] }
      }
      platformStats[platform].mentions++
      if (mention.sentiment_score) {
        platformStats[platform].sentiments.push(mention.sentiment_score)
      }
    })

    const mentionSources = Object.entries(platformStats).map(([platform, stats]) => ({
      platform,
      mentions: stats.mentions,
      sentiment: stats.sentiments.length > 0 
        ? stats.sentiments.reduce((a, b) => a + b, 0) / stats.sentiments.length 
        : 0
    }))

    // Keyword performance
    const keywordStats: Record<string, {mentions: number, sentiments: number[]}> = {}
    filteredMentions.forEach(mention => {
      mention.keywords?.forEach((kw: Record<string, unknown>) => {
        if (!keywordStats[String(kw.keyword)]) {
          keywordStats[String(kw.keyword)] = { mentions: 0, sentiments: [] }
        }
        keywordStats[String(kw.keyword)].mentions++
        if (mention.sentiment_score) {
          keywordStats[String(kw.keyword)].sentiments.push(mention.sentiment_score)
        }
      })
    })

    const keywordPerformance = Object.entries(keywordStats)
      .map(([keyword, stats]) => ({
        keyword,
        mentions: stats.mentions,
        sentiment: stats.sentiments.length > 0 
          ? stats.sentiments.reduce((a, b) => a + b, 0) / stats.sentiments.length 
          : 0,
        growth: Math.random() * 40 - 20 // Placeholder for growth calculation
      }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 8)

    // Heatmap data (mentions by hour and day)
    const heatmap: Array<{date: string, hour: number, mentions: number, sentiment: number}> = []
    for (let d = 0; d < Math.min(days, 7); d++) {
      const date = new Date()
      date.setDate(date.getDate() - d)
      const dateStr = date.toISOString().split('T')[0]
      
      for (let h = 0; h < 24; h++) {
        const hourMentions = filteredMentions.filter(m => {
          const mentionDate = new Date(m.ai_responses.created_at)
          return mentionDate.toISOString().split('T')[0] === dateStr && 
                 mentionDate.getHours() === h
        })

        const sentimentScores = hourMentions.filter(m => m.sentiment_score).map(m => m.sentiment_score)
        const avgSentiment = sentimentScores.length > 0 
          ? sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length 
          : 0

        heatmap.push({
          date: dateStr,
          hour: h,
          mentions: hourMentions.length,
          sentiment: avgSentiment
        })
      }
    }

    return {
      breakdown: sentimentBreakdown,
      sources: mentionSources,
      keywords: keywordPerformance,
      heatmap
    }
  }

  const loadCompetitorInsights = async (): Promise<CompetitorInsight[]> => {
    // Placeholder for competitor analysis
    // In a real implementation, this would analyze competitor mentions
    return [
      { competitor: 'Competitor A', mentions: 45, sentiment: 0.3, share: 35 },
      { competitor: 'Competitor B', mentions: 32, sentiment: 0.1, share: 25 },
      { competitor: 'Competitor C', mentions: 28, sentiment: -0.2, share: 20 },
      { competitor: 'Others', mentions: 25, sentiment: 0.0, share: 20 }
    ]
  }

  const exportData = () => {
    if (!analysisData) return
    
    const exportObj = {
      company: companies.find(c => c.id === selectedCompany)?.name,
      timeRange,
      generatedAt: new Date().toISOString(),
      data: analysisData
    }
    
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brand-analysis-${Date.now()}.json`
    a.click()
  }

  const selectedCompanyName = companies.find(c => c.id === selectedCompany)?.name || 'Company'
  const totalMentions = analysisData ? 
    analysisData.sentimentBreakdown.positive + 
    analysisData.sentimentBreakdown.negative + 
    analysisData.sentimentBreakdown.neutral : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Brand Analysis</h1>
              <p className="text-muted-foreground">
                Deep brand sentiment and competitive insights for {selectedCompanyName}
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

              {/* Sentiment Filter */}
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value as 'all' | 'positive' | 'negative' | 'neutral')}
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive Only</option>
                <option value="negative">Negative Only</option>
                <option value="neutral">Neutral Only</option>
              </select>

              {/* Time Range Selector */}
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              <Button onClick={exportData} disabled={!analysisData} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button onClick={loadAnalysisData} disabled={loading} size="sm">
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {!selectedCompany ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a company to view brand analysis</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading brand analysis data...</p>
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Mentions"
                  value={totalMentions}
                  icon={<MessageSquare className="h-5 w-5" />}
                />
                <MetricCard
                  title="Sentiment Score"
                  value={analysisData ? 
                    ((analysisData.sentimentBreakdown.positive - analysisData.sentimentBreakdown.negative) / totalMentions * 100).toFixed(1) + '%' : 
                    '0%'
                  }
                  icon={<TrendingUp className="h-5 w-5" />}
                />
                <MetricCard
                  title="Active Platforms"
                  value={analysisData?.mentionSources.length || 0}
                  icon={<Users className="h-5 w-5" />}
                />
                <MetricCard
                  title="Share of Voice"
                  value={analysisData ? 
                    (analysisData.competitorInsights.find(c => c.competitor.includes('A'))?.share || 0) + '%' :
                    '0%'
                  }
                  icon={<Target className="h-5 w-5" />}
                />
              </div>

              {/* Sentiment Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Sentiment Breakdown</h3>
                  {analysisData ? (
                    <BrandSentimentChart data={analysisData.sentimentBreakdown} />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No sentiment data available
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Sentiment Trends</h3>
                  {sentimentTrends.length > 0 ? (
                    <BrandSentimentChart data={{
                      positive: sentimentTrends.reduce((sum, t) => sum + t.positive, 0),
                      negative: sentimentTrends.reduce((sum, t) => sum + t.negative, 0),
                      neutral: sentimentTrends.reduce((sum, t) => sum + t.neutral, 0)
                    }} />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No trend data available
                    </div>
                  )}
                </div>
              </div>

              {/* Platform Performance */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analysisData?.mentionSources.map((source, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-600">{source.platform}</div>
                      <div className="text-2xl font-bold">{source.mentions}</div>
                      <div className="text-sm text-gray-500">
                        Sentiment: {source.sentiment.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitive Analysis */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Competitive Landscape</h3>
                {analysisData ? (
                  <CompetitorComparisonChart data={analysisData.competitorInsights} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No competitor data available
                  </div>
                )}
              </div>

              {/* Keyword Performance */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Top Keywords Performance</h3>
                <div className="space-y-4">
                  {analysisData?.keywordPerformance.map((keyword, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{keyword.keyword}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          Sentiment: {keyword.sentiment.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{keyword.mentions} mentions</div>
                        <div className={`text-sm ${keyword.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {keyword.growth >= 0 ? '+' : ''}{keyword.growth.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Heatmap */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Mention Activity Heatmap</h3>
                {analysisData ? (
                  <BrandMentionHeatmap data={analysisData.heatmapData} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No heatmap data available
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}