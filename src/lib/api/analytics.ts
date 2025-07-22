import { getSupabaseClient } from '@/lib/supabase-client'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

// Analytics interfaces
export interface DashboardMetrics {
  totalMentions: number
  totalMentionsChange: number
  positiveMentions: number
  positiveMentionsChange: number
  averageSentiment: number
  averageSentimentChange: number
  totalCitations: number
  totalCitationsChange: number
  activePlatforms: number
  totalQueries: number
  totalCost: number
}

export interface MentionTrend {
  date: string
  mentions: number
  positive: number
  negative: number
  neutral: number
  sentiment_score: number
}

export interface PlatformPerformance {
  platform: string
  mentions: number
  avgSentiment: number
  citations: number
  queries: number
  cost: number
  responseTime: number
}

export interface TopKeyword {
  keyword: string
  mentions: number
  sentiment: number
  trend: number
}

export interface CitationSource {
  domain: string
  count: number
  relevance: number
  type: string
}

export interface CompetitorInsight {
  competitor: string
  mentions: number
  sentiment: number
  share: number
}

// Time range options
export type TimeRange = '7d' | '30d' | '90d' | '1y'

export class AnalyticsService {
  
  /**
   * Get dashboard metrics for a company
   */
  static async getDashboardMetrics(companyId: string, timeRange: TimeRange = '30d'): Promise<DashboardMetrics> {
    const days = this.getTimeRangeDays(timeRange)
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd')
    const previousStartDate = format(subDays(new Date(), days * 2), 'yyyy-MM-dd')
    const previousEndDate = format(subDays(new Date(), days), 'yyyy-MM-dd')

    try {
      // Current period metrics
      const currentMetrics = await this.getMetricsForPeriod(companyId, startDate, format(new Date(), 'yyyy-MM-dd'))
      
      // Previous period metrics for comparison
      const previousMetrics = await this.getMetricsForPeriod(companyId, previousStartDate, previousEndDate)

      // Calculate changes
      const calculateChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100)
      }

      return {
        totalMentions: currentMetrics.totalMentions,
        totalMentionsChange: calculateChange(currentMetrics.totalMentions, previousMetrics.totalMentions),
        positiveMentions: currentMetrics.positiveMentions,
        positiveMentionsChange: calculateChange(currentMetrics.positiveMentions, previousMetrics.positiveMentions),
        averageSentiment: currentMetrics.averageSentiment,
        averageSentimentChange: calculateChange(Math.round(currentMetrics.averageSentiment * 100), Math.round(previousMetrics.averageSentiment * 100)),
        totalCitations: currentMetrics.totalCitations,
        totalCitationsChange: calculateChange(currentMetrics.totalCitations, previousMetrics.totalCitations),
        activePlatforms: currentMetrics.activePlatforms,
        totalQueries: currentMetrics.totalQueries,
        totalCost: currentMetrics.totalCost
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error)
      return this.getEmptyMetrics()
    }
  }

  /**
   * Get metrics for a specific period
   */
  private static async getMetricsForPeriod(companyId: string, startDate: string, endDate: string) {
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      return this.getEmptyPeriodMetrics()
    }

    // Get brand mentions
    const { data: mentions, error: mentionsError } = await supabase
      .from('brand_mentions')
      .select(`
        *,
        ai_responses!inner(
          created_at,
          ai_queries!inner(
            company_id,
            cost,
            ai_platform_id
          )
        )
      `)
      .eq('company_id', companyId)
      .gte('ai_responses.created_at', startDate)
      .lte('ai_responses.created_at', endDate)

    if (mentionsError) {
      console.error('Error fetching mentions:', mentionsError)
    }

    // Get citations
    const { data: citations, error: citationsError } = await supabase
      .from('citations')
      .select(`
        *,
        ai_responses!inner(
          created_at,
          ai_queries!inner(
            company_id
          )
        )
      `)
      .eq('ai_responses.ai_queries.company_id', companyId)
      .gte('ai_responses.created_at', startDate)
      .lte('ai_responses.created_at', endDate)

    if (citationsError) {
      console.error('Error fetching citations:', citationsError)
    }

    // Get queries
    const { data: queries, error: queriesError } = await supabase
      .from('ai_queries')
      .select('*')
      .eq('company_id', companyId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (queriesError) {
      console.error('Error fetching queries:', queriesError)
    }

    const mentionsList = mentions || []
    const citationsList = citations || []
    const queriesList = queries || []

    const positiveMentions = mentionsList.filter(m => m.sentiment === 'positive').length
    const sentimentScores = mentionsList.filter(m => m.sentiment_score !== null).map(m => m.sentiment_score)
    const averageSentiment = sentimentScores.length > 0 
      ? sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length 
      : 0

    const uniquePlatforms = new Set(queriesList.map(q => q.ai_platform_id)).size
    const totalCost = queriesList.reduce((sum, q) => sum + (q.cost || 0), 0)

    return {
      totalMentions: mentionsList.length,
      positiveMentions,
      averageSentiment,
      totalCitations: citationsList.length,
      activePlatforms: uniquePlatforms,
      totalQueries: queriesList.length,
      totalCost
    }
  }

  /**
   * Get mention trends over time
   */
  static async getMentionTrends(companyId: string, timeRange: TimeRange = '30d'): Promise<MentionTrend[]> {
    const days = this.getTimeRangeDays(timeRange)
    const trends: MentionTrend[] = []

    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      return trends
    }

    try {
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i)
        const dateStr = format(date, 'yyyy-MM-dd')
        const startOfDateStr = format(startOfDay(date), 'yyyy-MM-dd HH:mm:ss')
        const endOfDateStr = format(endOfDay(date), 'yyyy-MM-dd HH:mm:ss')

        const { data: dayMentions } = await supabase
          .from('brand_mentions')
          .select(`
            *,
            ai_responses!inner(
              created_at,
              ai_queries!inner(company_id)
            )
          `)
          .eq('company_id', companyId)
          .gte('ai_responses.created_at', startOfDateStr)
          .lte('ai_responses.created_at', endOfDateStr)

        const mentions = dayMentions || []
        const positive = mentions.filter(m => m.sentiment === 'positive').length
        const negative = mentions.filter(m => m.sentiment === 'negative').length
        const neutral = mentions.filter(m => m.sentiment === 'neutral').length

        const sentimentScores = mentions.filter(m => m.sentiment_score !== null).map(m => m.sentiment_score)
        const avgSentiment = sentimentScores.length > 0 
          ? sentimentScores.reduce((a: number, b: number) => a + b, 0) / sentimentScores.length 
          : 0

        trends.push({
          date: dateStr,
          mentions: mentions.length,
          positive,
          negative,
          neutral,
          sentiment_score: Math.round(avgSentiment * 100) / 100
        })
      }

      return trends
    } catch (error) {
      console.error('Error fetching mention trends:', error)
      return []
    }
  }

  /**
   * Get platform performance comparison
   */
  static async getPlatformPerformance(companyId: string, timeRange: TimeRange = '30d'): Promise<PlatformPerformance[]> {
    const days = this.getTimeRangeDays(timeRange)
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd')

    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      return []
    }

    try {
      const { data: platforms } = await supabase
        .from('ai_platforms')
        .select('*')
        .eq('is_active', true)

      if (!platforms) return []

      const performance: PlatformPerformance[] = []

      for (const platform of platforms) {
        // Get queries for this platform
        const { data: queries } = await supabase
          .from('ai_queries')
          .select(`
            *,
            ai_responses(
              *,
              brand_mentions(*),
              citations(*)
            )
          `)
          .eq('company_id', companyId)
          .eq('ai_platform_id', platform.id)
          .gte('created_at', startDate)

        const queriesList = queries || []
        const allMentions = queriesList.flatMap((q: Record<string, unknown>) => (q.ai_responses as Record<string, unknown>[])?.flatMap((r: Record<string, unknown>) => r.brand_mentions) || [])
        const allCitations = queriesList.flatMap((q: Record<string, unknown>) => (q.ai_responses as Record<string, unknown>[])?.flatMap((r: Record<string, unknown>) => r.citations) || [])
        const allResponses = queriesList.flatMap((q: Record<string, unknown>) => q.ai_responses || [])

        const sentimentScores = (allMentions as Record<string, unknown>[]).filter(m => m?.sentiment_score !== null).map(m => Number(m.sentiment_score))
        const avgSentiment = sentimentScores.length > 0 
          ? sentimentScores.reduce((a: number, b: number) => a + b, 0) / sentimentScores.length 
          : 0

        const responseTimes = (allResponses as Record<string, unknown>[]).filter(r => r?.processing_time_ms).map(r => Number(r.processing_time_ms))
        const avgResponseTime = responseTimes.length > 0
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          : 0

        const totalCost = (queriesList as Record<string, unknown>[]).reduce((sum, q) => sum + (Number(q.cost) || 0), 0)

        performance.push({
          platform: platform.name,
          mentions: allMentions.length,
          avgSentiment: Math.round(avgSentiment * 100) / 100,
          citations: allCitations.length,
          queries: queriesList.length,
          cost: Math.round(totalCost * 100) / 100,
          responseTime: Math.round(avgResponseTime)
        })
      }

      return performance.sort((a, b) => b.mentions - a.mentions)
    } catch (error) {
      console.error('Error fetching platform performance:', error)
      return []
    }
  }

  /**
   * Get top performing keywords
   */
  static async getTopKeywords(companyId: string, timeRange: TimeRange = '30d'): Promise<TopKeyword[]> {
    const days = this.getTimeRangeDays(timeRange)
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd')

    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      return []
    }

    try {
      const { data: keywords } = await supabase
        .from('keywords')
        .select(`
          *,
          brand_mentions(
            *,
            ai_responses!inner(
              created_at,
              ai_queries!inner(company_id)
            )
          )
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)

      if (!keywords) return []

      const topKeywords: TopKeyword[] = []

      for (const keyword of keywords) {
        const recentMentions = keyword.brand_mentions?.filter((m: Record<string, unknown>) => 
          new Date(String((m.ai_responses as Record<string, unknown>)?.created_at)) >= new Date(startDate)
        ) || []

        if (recentMentions.length === 0) continue

        const sentimentScores = recentMentions.filter((m: Record<string, unknown>) => m.sentiment_score !== null).map((m: Record<string, unknown>) => Number(m.sentiment_score))
        const avgSentiment = sentimentScores.length > 0 
          ? sentimentScores.reduce((a: number, b: number) => a + b, 0) / sentimentScores.length 
          : 0

        // Calculate trend (comparing first half vs second half of period)
        const midPoint = Math.floor(days / 2)
        const midDate = format(subDays(new Date(), midPoint), 'yyyy-MM-dd')
        
        const firstHalf = recentMentions.filter((m: Record<string, unknown>) => new Date(String((m.ai_responses as Record<string, unknown>)?.created_at)) < new Date(midDate)).length
        const secondHalf = recentMentions.filter((m: Record<string, unknown>) => new Date(String((m.ai_responses as Record<string, unknown>)?.created_at)) >= new Date(midDate)).length
        
        const trend = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0

        topKeywords.push({
          keyword: keyword.keyword,
          mentions: recentMentions.length,
          sentiment: Math.round(avgSentiment * 100) / 100,
          trend
        })
      }

      return topKeywords.sort((a, b) => b.mentions - a.mentions).slice(0, 10)
    } catch (error) {
      console.error('Error fetching top keywords:', error)
      return []
    }
  }

  /**
   * Get top citation sources
   */
  static async getTopCitationSources(companyId: string, timeRange: TimeRange = '30d'): Promise<CitationSource[]> {
    const days = this.getTimeRangeDays(timeRange)
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd')

    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      return []
    }

    try {
      const { data: citations } = await supabase
        .from('citations')
        .select(`
          *,
          ai_responses!inner(
            created_at,
            ai_queries!inner(company_id)
          )
        `)
        .eq('ai_responses.ai_queries.company_id', companyId)
        .gte('ai_responses.created_at', startDate)

      if (!citations) return []

      const domainStats: Record<string, {count: number, relevance: number[], types: string[]}> = {}

      citations.forEach(citation => {
        const domain = citation.domain || 'Unknown'
        if (!domainStats[domain]) {
          domainStats[domain] = { count: 0, relevance: [], types: [] }
        }
        domainStats[domain].count++
        if (citation.relevance_score) {
          domainStats[domain].relevance.push(citation.relevance_score)
        }
        if (citation.citation_type) {
          domainStats[domain].types.push(citation.citation_type)
        }
      })

      const sources: CitationSource[] = Object.entries(domainStats).map(([domain, stats]) => {
        const avgRelevance = stats.relevance.length > 0 
          ? stats.relevance.reduce((a, b) => a + b, 0) / stats.relevance.length 
          : 0

        const mostCommonType = stats.types.length > 0 
          ? stats.types.reduce((a, b, i, arr) => 
              arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
            ) 
          : 'unknown'

        return {
          domain,
          count: stats.count,
          relevance: Math.round(avgRelevance * 100) / 100,
          type: mostCommonType
        }
      })

      return sources.sort((a, b) => b.count - a.count).slice(0, 10)
    } catch (error) {
      console.error('Error fetching citation sources:', error)
      return []
    }
  }

  /**
   * Helper to convert time range to days
   */
  private static getTimeRangeDays(timeRange: TimeRange): number {
    switch (timeRange) {
      case '7d': return 7
      case '30d': return 30
      case '90d': return 90
      case '1y': return 365
      default: return 30
    }
  }

  /**
   * Get empty metrics fallback
   */
  private static getEmptyMetrics(): DashboardMetrics {
    return {
      totalMentions: 0,
      totalMentionsChange: 0,
      positiveMentions: 0,
      positiveMentionsChange: 0,
      averageSentiment: 0,
      averageSentimentChange: 0,
      totalCitations: 0,
      totalCitationsChange: 0,
      activePlatforms: 0,
      totalQueries: 0,
      totalCost: 0
    }
  }

  private static getEmptyPeriodMetrics() {
    return {
      totalMentions: 0,
      positiveMentions: 0,
      averageSentiment: 0,
      totalCitations: 0,
      activePlatforms: 0,
      totalQueries: 0,
      totalCost: 0
    }
  }
}