'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MetricCard } from '@/components/charts/metric-card'
import { MentionTrendsChart } from '@/components/charts/mention-trends-chart'
import { PlatformPerformanceChart } from '@/components/charts/platform-performance-chart'
import { AnalyticsService, type DashboardMetrics, type MentionTrend, type PlatformPerformance, type TopKeyword, type CitationSource } from '@/lib/api/analytics'
import { getSupabaseClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { MessageSquare, Target, TrendingUp, DollarSign, Users, Search } from 'lucide-react'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [mentionTrends, setMentionTrends] = useState<MentionTrend[]>([])
  const [platformPerformance, setPlatformPerformance] = useState<PlatformPerformance[]>([])
  const [topKeywords, setTopKeywords] = useState<TopKeyword[]>([])
  const [topSources, setTopSources] = useState<CitationSource[]>([])
  const [companies, setCompanies] = useState<Array<{id: string, name: string}>>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      loadDashboardData()
    }
  }, [selectedCompany, timeRange]) // loadDashboardData is recreated on each render

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
        setCompanies(data as Array<{id: string, name: string}>)
        setSelectedCompany(data[0].id as string) // Auto-select first company
      }
    } catch (error) {
      console.error('Error loading companies:', error)
    }
  }

  const loadDashboardData = async () => {
    if (!selectedCompany) return

    setLoading(true)
    try {
      const [
        dashboardMetrics,
        trends,
        platformPerf,
        keywords,
        sources
      ] = await Promise.all([
        AnalyticsService.getDashboardMetrics(selectedCompany, timeRange),
        AnalyticsService.getMentionTrends(selectedCompany, timeRange),
        AnalyticsService.getPlatformPerformance(selectedCompany, timeRange),
        AnalyticsService.getTopKeywords(selectedCompany, timeRange),
        AnalyticsService.getTopCitationSources(selectedCompany, timeRange)
      ])

      setMetrics(dashboardMetrics)
      setMentionTrends(trends)
      setPlatformPerformance(platformPerf)
      setTopKeywords(keywords)
      setTopSources(sources)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCompanyName = companies.find(c => c.id === selectedCompany)?.name || 'Company'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Answer Engine Optimization metrics for {selectedCompanyName}
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

              <Button onClick={loadDashboardData} disabled={loading} size="sm">
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {!selectedCompany ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please select a company to view analytics</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          ) : (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Mentions"
                  value={metrics?.totalMentions || 0}
                  change={metrics?.totalMentionsChange}
                  changeLabel="vs previous period"
                  icon={<MessageSquare className="h-5 w-5" />}
                />
                <MetricCard
                  title="Positive Mentions"
                  value={metrics?.positiveMentions || 0}
                  change={metrics?.positiveMentionsChange}
                  changeLabel="vs previous period"
                  icon={<TrendingUp className="h-5 w-5" />}
                />
                <MetricCard
                  title="Average Sentiment"
                  value={metrics?.averageSentiment?.toFixed(2) || '0.00'}
                  change={metrics?.averageSentimentChange}
                  changeLabel="vs previous period"
                  icon={<Target className="h-5 w-5" />}
                />
                <MetricCard
                  title="Total Cost"
                  value={metrics?.totalCost || 0}
                  format="currency"
                  icon={<DollarSign className="h-5 w-5" />}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Mention Trends</h3>
                  {mentionTrends.length > 0 ? (
                    <MentionTrendsChart data={mentionTrends} />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No mention data available
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
                  {platformPerformance.length > 0 ? (
                    <PlatformPerformanceChart data={platformPerformance} />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No platform data available
                    </div>
                  )}
                </div>
              </div>

              {/* Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Keywords</h3>
                  <div className="space-y-4">
                    {topKeywords.length > 0 ? (
                      topKeywords.map((keyword, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium">{keyword.keyword}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              Sentiment: {keyword.sentiment.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{keyword.mentions}</div>
                            <div className={`text-xs ${keyword.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {keyword.trend >= 0 ? '+' : ''}{keyword.trend}%
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No keyword data available
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Citation Sources</h3>
                  <div className="space-y-4">
                    {topSources.length > 0 ? (
                      topSources.map((source, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium">{source.domain}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {source.type}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{source.count}</div>
                            <div className="text-xs text-muted-foreground">
                              {source.relevance.toFixed(2)} relevance
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No citation data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{metrics?.activePlatforms || 0}</div>
                  <div className="text-sm text-muted-foreground">Active AI Platforms</div>
                </div>
                
                <div className="border rounded-lg p-6 text-center">
                  <Search className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">{metrics?.totalQueries || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Queries</div>
                </div>
                
                <div className="border rounded-lg p-6 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">{metrics?.totalCitations || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Citations</div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}