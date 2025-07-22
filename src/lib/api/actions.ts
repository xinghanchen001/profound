import { getSupabaseClient } from '@/lib/supabase-client'
import { subDays } from 'date-fns'

export interface ActionItem {
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

export interface CompanyInsights {
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

export class ActionsService {
  
  /**
   * Generate comprehensive insights for a company
   */
  static async generateCompanyInsights(companyId: string): Promise<CompanyInsights> {
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      throw new Error('Supabase client not initialized')
    }

    try {
      const endDate = new Date()
      const startDate = subDays(endDate, 30)

      // Get company info
      const { data: company } = await supabase
        .from('companies')
        .select('name')
        .eq('id', companyId)
        .single()

      // Get brand mentions with platform data
      const { data: mentions } = await supabase
        .from('brand_mentions')
        .select(`
          *,
          ai_responses!inner(
            ai_queries!inner(
              ai_platform_id,
              ai_platforms(name)
            )
          )
        `)
        .eq('company_id', companyId)
        .gte('ai_responses.ai_queries.created_at', startDate.toISOString())

      // Get citations
      const { data: citations } = await supabase
        .from('citations')
        .select(`
          *,
          ai_responses!inner(
            ai_queries!inner(company_id)
          )
        `)
        .eq('ai_responses.ai_queries.company_id', companyId)
        .gte('ai_responses.ai_queries.created_at', startDate.toISOString())

      // Get keywords
      const { data: keywords } = await supabase
        .from('keywords')
        .select('keyword, importance_score')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('importance_score', { ascending: false })
        .limit(10)

      const mentionsList = mentions || []
      const citationsList = citations || []
      const keywordsList = keywords || []

      // Calculate metrics
      const totalMentions = mentionsList.length
      const sentimentScores = mentionsList
        .filter(m => m.sentiment_score !== null)
        .map(m => m.sentiment_score)
      const avgSentiment = sentimentScores.length > 0 
        ? sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length 
        : 0

      // Platform analysis
      const platformCounts: Record<string, number> = {}
      mentionsList.forEach(mention => {
        // Safely extract platform name with type assertions
        const aiResponse = mention.ai_responses as Record<string, unknown>
        const aiQuery = aiResponse?.ai_queries as Record<string, unknown>
        const aiPlatform = aiQuery?.ai_platforms as Record<string, unknown>
        const platform = aiPlatform?.name ? String(aiPlatform.name) : 'Unknown'
        if (platform) {
          platformCounts[platform] = (platformCounts[platform] || 0) + 1
        }
      })

      const sortedPlatforms = Object.entries(platformCounts)
        .sort(([,a], [,b]) => b - a)
      const topPlatforms = sortedPlatforms.slice(0, 3).map(([platform]) => platform)
      const weakestPlatform = sortedPlatforms[sortedPlatforms.length - 1]?.[0] || 'Unknown'

      // Generate insights
      const insights: CompanyInsights = {
        company_id: companyId,
        company_name: company?.name || 'Unknown Company',
        total_mentions: totalMentions,
        sentiment_score: avgSentiment,
        citation_count: citationsList.length,
        top_platforms: topPlatforms,
        weakest_platform: weakestPlatform,
        trending_keywords: keywordsList.slice(0, 5).map(k => k.keyword),
        competitor_gaps: await this.identifyCompetitorGaps(companyId),
        content_opportunities: await this.identifyContentOpportunities(companyId, mentionsList)
      }

      return insights
    } catch (error) {
      console.error('Error generating company insights:', error)
      throw error
    }
  }

  /**
   * Generate actionable recommendations
   */
  static async generateRecommendations(companyId: string): Promise<ActionItem[]> {
    try {
      const insights = await this.generateCompanyInsights(companyId)
      const recommendations: ActionItem[] = []

      // Sentiment optimization recommendations
      if (insights.sentiment_score < 0.2) {
        recommendations.push({
          id: `sentiment-opt-${Date.now()}`,
          type: 'optimization',
          priority: 'high',
          title: 'Improve Brand Sentiment',
          description: 'Your brand sentiment is below optimal levels. Focus on addressing negative mentions and improving brand perception.',
          impact: 'High - Can significantly improve brand reputation',
          effort: 'Medium - Requires content strategy and monitoring',
          category: 'Brand Reputation',
          actionable_steps: [
            'Analyze negative mentions to identify common themes',
            'Create content addressing frequently mentioned concerns',
            'Engage with AI platforms to ensure accurate brand information',
            'Develop thought leadership content in your industry'
          ],
          expected_outcome: 'Increase sentiment score by 0.3-0.5 points over 60 days',
          metrics_to_track: ['Sentiment score', 'Negative mention ratio', 'Brand mention volume'],
          created_at: new Date().toISOString()
        })
      }

      // Platform optimization
      if (insights.weakest_platform && insights.weakest_platform !== 'Unknown') {
        recommendations.push({
          id: `platform-opt-${Date.now()}`,
          type: 'optimization',
          priority: 'medium',
          title: `Optimize Presence on ${insights.weakest_platform}`,
          description: `Your brand has limited visibility on ${insights.weakest_platform}. Improving presence here could capture additional market share.`,
          impact: 'Medium - Expands brand reach',
          effort: 'Low - Platform-specific optimization',
          category: 'Platform Strategy',
          actionable_steps: [
            `Research ${insights.weakest_platform}-specific content preferences`,
            'Create platform-optimized content and resources',
            'Submit brand information to platform knowledge bases',
            'Monitor and respond to platform-specific queries'
          ],
          expected_outcome: `Increase mentions on ${insights.weakest_platform} by 150%`,
          metrics_to_track: ['Platform-specific mentions', 'Platform sentiment', 'Citation rate'],
          created_at: new Date().toISOString()
        })
      }

      // Content recommendations
      if (insights.content_opportunities.length > 0) {
        recommendations.push({
          id: `content-${Date.now()}`,
          type: 'content',
          priority: 'high',
          title: 'Create Targeted Content for AI Platforms',
          description: 'Develop content that addresses gaps in AI knowledge about your brand and industry.',
          impact: 'High - Increases brand authority and citations',
          effort: 'Medium - Requires content creation resources',
          category: 'Content Strategy',
          actionable_steps: [
            'Create comprehensive FAQ pages addressing common queries',
            'Develop detailed product/service documentation',
            'Publish case studies and success stories',
            'Create industry-specific guides and resources'
          ],
          expected_outcome: 'Increase citation rate by 40% and improve content authority',
          metrics_to_track: ['Citation count', 'Content mention rate', 'Authority score'],
          created_at: new Date().toISOString()
        })
      }

      // Citation optimization
      if (insights.citation_count < insights.total_mentions * 0.3) {
        recommendations.push({
          id: `citation-opt-${Date.now()}`,
          type: 'technical',
          priority: 'medium',
          title: 'Improve Citation Rate',
          description: 'Your content is mentioned but not often cited as a source. Optimize for better source attribution.',
          impact: 'Medium - Improves brand authority',
          effort: 'Low - Technical optimization',
          category: 'Technical SEO',
          actionable_steps: [
            'Add structured data markup to key pages',
            'Create linkable, authoritative content assets',
            'Optimize page titles and meta descriptions',
            'Submit to industry databases and directories'
          ],
          expected_outcome: 'Increase citation rate to 35% of total mentions',
          metrics_to_track: ['Citation rate', 'Source authority score', 'Reference quality'],
          created_at: new Date().toISOString()
        })
      }

      // Competitive recommendations
      if (insights.competitor_gaps.length > 0) {
        recommendations.push({
          id: `competitive-${Date.now()}`,
          type: 'competitive',
          priority: 'medium',
          title: 'Address Competitive Gaps',
          description: 'Capitalize on areas where competitors have stronger AI presence.',
          impact: 'High - Captures market share',
          effort: 'High - Requires strategic planning',
          category: 'Competitive Strategy',
          actionable_steps: [
            'Analyze competitor content strategies',
            'Identify unique value propositions to emphasize',
            'Create differentiated content in gap areas',
            'Monitor competitor mention trends'
          ],
          expected_outcome: 'Increase market share of voice by 20%',
          metrics_to_track: ['Competitive mention ratio', 'Market share of voice', 'Differentiation score'],
          created_at: new Date().toISOString()
        })
      }

      // Keyword optimization
      if (insights.trending_keywords.length < 5) {
        recommendations.push({
          id: `keyword-opt-${Date.now()}`,
          type: 'optimization',
          priority: 'low',
          title: 'Expand Keyword Strategy',
          description: 'Broaden your keyword portfolio to capture more relevant queries.',
          impact: 'Medium - Increases discoverability',
          effort: 'Low - Keyword research and optimization',
          category: 'Keyword Strategy',
          actionable_steps: [
            'Conduct comprehensive keyword research',
            'Identify long-tail keyword opportunities',
            'Create content targeting new keyword clusters',
            'Monitor keyword performance and trends'
          ],
          expected_outcome: 'Increase keyword coverage by 50%',
          metrics_to_track: ['Keyword ranking', 'Mention diversity', 'Query coverage'],
          created_at: new Date().toISOString()
        })
      }

      return recommendations
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return []
    }
  }

  /**
   * Identify competitor gaps
   */
  private static async identifyCompetitorGaps(_companyId: string): Promise<string[]> {
    // Placeholder implementation - would analyze competitor data
    return [
      'Technical documentation coverage',
      'Industry thought leadership',
      'Product comparison content',
      'Customer success stories'
    ]
  }

  /**
   * Identify content opportunities
   */
  private static async identifyContentOpportunities(_companyId: string, mentions: Record<string, unknown>[]): Promise<string[]> {
    const opportunities: string[] = []

    // Analyze mention patterns to identify gaps
    const contexts = mentions
      .filter(m => m.context_before || m.context_after)
      .map(m => `${m.context_before || ''} ${m.context_after || ''}`)

    // Common opportunity areas
    const commonGaps = [
      'Pricing information',
      'Product specifications',
      'Implementation guides',
      'API documentation',
      'Comparison guides',
      'Best practices'
    ]

    // Simple heuristic - in a real implementation, would use NLP
    commonGaps.forEach(gap => {
      const gapMentions = contexts.filter(context => 
        context.toLowerCase().includes(gap.toLowerCase().split(' ')[0])
      ).length

      if (gapMentions < mentions.length * 0.1) {
        opportunities.push(gap)
      }
    })

    return opportunities.slice(0, 5)
  }
}