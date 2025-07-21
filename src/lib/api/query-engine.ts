import { supabase } from '@/lib/supabase'
import { aiPlatformManager, type AIPlatformResponse, AIPlatformError } from './ai-platforms'
import type { QueryTemplate, Company, AIPlatform } from '@/lib/types'

// Template variable replacement
export interface TemplateVariables {
  company_name?: string
  industry?: string
  product_type?: string
  competitor_names?: string[]
  [key: string]: string | string[] | undefined
}

// Query execution result
export interface QueryResult {
  id: string
  company_id: string
  ai_platform_id: string
  template_id?: string
  query_text: string
  query_type: string
  status: 'pending' | 'sent' | 'completed' | 'failed'
  response?: AIPlatformResponse
  error_message?: string
  cost?: number
  created_at: Date
}

// Batch query execution
export interface BatchQueryRequest {
  company_id: string
  template_id: string
  platforms: string[]
  variables: TemplateVariables
  query_type?: string
}

export class QueryEngine {
  
  /**
   * Process template variables in a query template
   */
  processTemplate(template: string, variables: TemplateVariables): string {
    let processedTemplate = template

    // Replace variables in {variable_name} format
    Object.entries(variables).forEach(([key, value]) => {
      const pattern = new RegExp(`\\{${key}\\}`, 'g')
      
      if (Array.isArray(value)) {
        // Handle array values (e.g., competitor lists)
        processedTemplate = processedTemplate.replace(pattern, value.join(', '))
      } else if (value) {
        processedTemplate = processedTemplate.replace(pattern, value)
      }
    })

    return processedTemplate
  }

  /**
   * Validate template variables
   */
  validateTemplate(template: string, variables: TemplateVariables): string[] {
    const missingVariables: string[] = []
    const variablePattern = /\{([^}]+)\}/g
    let match

    while ((match = variablePattern.exec(template)) !== null) {
      const variableName = match[1]
      if (!variables[variableName]) {
        missingVariables.push(variableName)
      }
    }

    return missingVariables
  }

  /**
   * Get query template from database
   */
  async getTemplate(templateId: string): Promise<QueryTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('query_templates')
        .select('*')
        .eq('id', templateId)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching template:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getTemplate:', error)
      return null
    }
  }

  /**
   * Get company information
   */
  async getCompany(companyId: string): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching company:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getCompany:', error)
      return null
    }
  }

  /**
   * Get AI platform information
   */
  async getAIPlatforms(platformIds?: string[]): Promise<AIPlatform[]> {
    try {
      let query = supabase
        .from('ai_platforms')
        .select('*')
        .eq('is_active', true)

      if (platformIds && platformIds.length > 0) {
        query = query.in('id', platformIds)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching AI platforms:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getAIPlatforms:', error)
      return []
    }
  }

  /**
   * Store query in database
   */
  async storeQuery(
    companyId: string,
    aiPlatformId: string,
    queryText: string,
    queryType: string,
    templateId?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_queries')
        .insert({
          company_id: companyId,
          ai_platform_id: aiPlatformId,
          template_id: templateId,
          query_text: queryText,
          query_type: queryType,
          status: 'pending'
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error storing query:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('Error in storeQuery:', error)
      return null
    }
  }

  /**
   * Update query status
   */
  async updateQueryStatus(
    queryId: string,
    status: 'sent' | 'completed' | 'failed',
    errorMessage?: string,
    cost?: number
  ): Promise<boolean> {
    try {
      const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString()
      }

      if (status === 'sent') {
        updateData.sent_at = new Date().toISOString()
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      if (errorMessage) {
        updateData.error_message = errorMessage
      }

      if (cost !== undefined) {
        updateData.cost = cost
      }

      const { error } = await supabase
        .from('ai_queries')
        .update(updateData)
        .eq('id', queryId)

      if (error) {
        console.error('Error updating query status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateQueryStatus:', error)
      return false
    }
  }

  /**
   * Store AI response
   */
  async storeResponse(queryId: string, response: AIPlatformResponse): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_responses')
        .insert({
          query_id: queryId,
          response_text: response.content,
          response_metadata: response.metadata,
          processing_time_ms: response.processing_time_ms,
          confidence_score: response.metadata?.confidence_score as number || null
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error storing response:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('Error in storeResponse:', error)
      return null
    }
  }

  /**
   * Execute a single query
   */
  async executeQuery(
    companyId: string,
    platformSlug: string,
    queryText: string,
    queryType: string,
    templateId?: string
  ): Promise<QueryResult> {
    const queryStartTime = new Date()

    // Get AI platform info
    const platforms = await this.getAIPlatforms()
    const aiPlatform = platforms.find(p => p.slug === platformSlug)
    
    if (!aiPlatform) {
      return {
        id: '',
        company_id: companyId,
        ai_platform_id: '',
        template_id: templateId,
        query_text: queryText,
        query_type: queryType,
        status: 'failed',
        error_message: `AI platform not found: ${platformSlug}`,
        created_at: queryStartTime
      }
    }

    // Store query in database
    const queryId = await this.storeQuery(companyId, aiPlatform.id, queryText, queryType, templateId)
    
    if (!queryId) {
      return {
        id: '',
        company_id: companyId,
        ai_platform_id: aiPlatform.id,
        template_id: templateId,
        query_text: queryText,
        query_type: queryType,
        status: 'failed',
        error_message: 'Failed to store query in database',
        created_at: queryStartTime
      }
    }

    try {
      // Update status to sent
      await this.updateQueryStatus(queryId, 'sent')

      // Execute query through AI platform
      const response = await aiPlatformManager.queryPlatform(platformSlug, queryText)

      // Calculate cost based on platform pricing
      const cost = this.calculateCost(aiPlatform, response)

      // Store response
      const responseId = await this.storeResponse(queryId, response)

      if (!responseId) {
        await this.updateQueryStatus(queryId, 'failed', 'Failed to store response')
        return {
          id: queryId,
          company_id: companyId,
          ai_platform_id: aiPlatform.id,
          template_id: templateId,
          query_text: queryText,
          query_type: queryType,
          status: 'failed',
          error_message: 'Failed to store response',
          created_at: queryStartTime
        }
      }

      // Update status to completed
      await this.updateQueryStatus(queryId, 'completed', undefined, cost)

      return {
        id: queryId,
        company_id: companyId,
        ai_platform_id: aiPlatform.id,
        template_id: templateId,
        query_text: queryText,
        query_type: queryType,
        status: 'completed',
        response,
        cost,
        created_at: queryStartTime
      }

    } catch (error) {
      const errorMessage = error instanceof AIPlatformError 
        ? error.message 
        : `Unknown error: ${error instanceof Error ? error.message : 'Unknown error'}`

      await this.updateQueryStatus(queryId, 'failed', errorMessage)

      return {
        id: queryId,
        company_id: companyId,
        ai_platform_id: aiPlatform.id,
        template_id: templateId,
        query_text: queryText,
        query_type: queryType,
        status: 'failed',
        error_message: errorMessage,
        created_at: queryStartTime
      }
    }
  }

  /**
   * Execute batch queries across multiple platforms
   */
  async executeBatchQuery(request: BatchQueryRequest): Promise<QueryResult[]> {
    // Get template
    const template = await this.getTemplate(request.template_id)
    if (!template) {
      throw new Error(`Template not found: ${request.template_id}`)
    }

    // Validate template variables
    const missingVariables = this.validateTemplate(template.template, request.variables)
    if (missingVariables.length > 0) {
      throw new Error(`Missing required variables: ${missingVariables.join(', ')}`)
    }

    // Process template
    const queryText = this.processTemplate(template.template, request.variables)

    // Execute queries for each platform
    const promises = request.platforms.map(platformSlug =>
      this.executeQuery(
        request.company_id,
        platformSlug,
        queryText,
        request.query_type || template.category || 'general',
        request.template_id
      )
    )

    return Promise.all(promises)
  }

  /**
   * Calculate query cost based on platform pricing and usage
   */
  private calculateCost(platform: AIPlatform, response: AIPlatformResponse): number {
    if (!platform.cost_per_query) return 0

    // Base cost per query
    let cost = platform.cost_per_query

    // Adjust cost based on token usage if available
    if (response.usage?.total_tokens) {
      // Rough estimation: cost scales with token usage
      const tokenMultiplier = Math.max(0.5, response.usage.total_tokens / 1000)
      cost *= tokenMultiplier
    }

    return Math.round(cost * 100) / 100 // Round to 2 decimal places
  }

  /**
   * Get query history for a company
   */
  async getQueryHistory(companyId: string, limit: number = 50): Promise<QueryResult[]> {
    try {
      const { data, error } = await supabase
        .from('ai_queries')
        .select(`
          *,
          ai_platforms!inner(name, slug),
          query_templates(name, description),
          ai_responses(response_text, processing_time_ms, confidence_score)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching query history:', error)
        return []
      }

      return data.map(item => ({
        id: item.id,
        company_id: item.company_id,
        ai_platform_id: item.ai_platform_id,
        template_id: item.template_id,
        query_text: item.query_text,
        query_type: item.query_type,
        status: item.status,
        error_message: item.error_message,
        cost: item.cost,
        created_at: new Date(item.created_at),
        response: item.ai_responses?.[0] ? {
          platform: item.ai_platforms.slug,
          model: 'unknown',
          content: item.ai_responses[0].response_text,
          processing_time_ms: item.ai_responses[0].processing_time_ms
        } : undefined
      }))
    } catch (error) {
      console.error('Error in getQueryHistory:', error)
      return []
    }
  }
}

// Export singleton instance
export const queryEngine = new QueryEngine()