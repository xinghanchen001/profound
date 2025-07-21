import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import axios from 'axios'

// Base interface for AI platform responses
export interface AIPlatformResponse {
  platform: string
  model: string
  content: string
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
  processing_time_ms: number
  metadata?: Record<string, unknown>
}

// Error handling for AI platforms
export class AIPlatformError extends Error {
  constructor(
    message: string,
    public platform: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AIPlatformError'
  }
}

// Rate limiting interface
interface RateLimit {
  requestsPerMinute: number
  lastReset: number
  requestCount: number
}

class RateLimiter {
  private limits: Map<string, RateLimit> = new Map()

  async checkLimit(platform: string, maxRequests: number): Promise<boolean> {
    const now = Date.now()
    const limit = this.limits.get(platform) || {
      requestsPerMinute: maxRequests,
      lastReset: now,
      requestCount: 0
    }

    // Reset counter every minute
    if (now - limit.lastReset >= 60000) {
      limit.requestCount = 0
      limit.lastReset = now
    }

    if (limit.requestCount >= maxRequests) {
      return false
    }

    limit.requestCount++
    this.limits.set(platform, limit)
    return true
  }
}

const rateLimiter = new RateLimiter()

// OpenAI integration
export class OpenAIService {
  private client: OpenAI | null = null

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey) {
      this.client = new OpenAI({ apiKey })
    }
  }

  async query(prompt: string, model: 'gpt-4' | 'gpt-3.5-turbo' = 'gpt-4'): Promise<AIPlatformResponse> {
    if (!this.client) {
      throw new AIPlatformError('OpenAI API key not configured', 'openai')
    }

    if (!await rateLimiter.checkLimit('openai', 60)) {
      throw new AIPlatformError('Rate limit exceeded', 'openai', 'RATE_LIMIT')
    }

    const startTime = Date.now()

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      })

      const processingTime = Date.now() - startTime
      const content = response.choices[0]?.message?.content || ''

      return {
        platform: 'openai',
        model,
        content,
        usage: response.usage ? {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens
        } : undefined,
        processing_time_ms: processingTime,
        metadata: {
          finish_reason: response.choices[0]?.finish_reason,
          created: response.created,
          id: response.id
        }
      }
    } catch (error) {
      throw new AIPlatformError(
        `OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'openai',
        'API_ERROR',
        error
      )
    }
  }
}

// Anthropic Claude integration
export class AnthropicService {
  private client: Anthropic | null = null

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (apiKey) {
      this.client = new Anthropic({ apiKey })
    }
  }

  async query(prompt: string, model: 'claude-3-haiku-20240307' | 'claude-3-sonnet-20240229' = 'claude-3-haiku-20240307'): Promise<AIPlatformResponse> {
    if (!this.client) {
      throw new AIPlatformError('Anthropic API key not configured', 'anthropic')
    }

    if (!await rateLimiter.checkLimit('anthropic', 40)) {
      throw new AIPlatformError('Rate limit exceeded', 'anthropic', 'RATE_LIMIT')
    }

    const startTime = Date.now()

    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })

      const processingTime = Date.now() - startTime
      const content = response.content[0]?.type === 'text' ? response.content[0].text : ''

      return {
        platform: 'anthropic',
        model,
        content,
        usage: response.usage ? {
          prompt_tokens: response.usage.input_tokens,
          completion_tokens: response.usage.output_tokens,
          total_tokens: response.usage.input_tokens + response.usage.output_tokens
        } : undefined,
        processing_time_ms: processingTime,
        metadata: {
          id: response.id,
          role: response.role,
          stop_reason: response.stop_reason
        }
      }
    } catch (error) {
      throw new AIPlatformError(
        `Anthropic API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'anthropic',
        'API_ERROR',
        error
      )
    }
  }
}

// Perplexity integration
export class PerplexityService {
  private apiKey: string | null = null

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || null
  }

  async query(prompt: string, model: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online' = 'llama-3.1-sonar-small-128k-online'): Promise<AIPlatformResponse> {
    if (!this.apiKey) {
      throw new AIPlatformError('Perplexity API key not configured', 'perplexity')
    }

    if (!await rateLimiter.checkLimit('perplexity', 50)) {
      throw new AIPlatformError('Rate limit exceeded', 'perplexity', 'RATE_LIMIT')
    }

    const startTime = Date.now()

    try {
      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.7,
          return_citations: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const processingTime = Date.now() - startTime
      const content = response.data.choices[0]?.message?.content || ''

      return {
        platform: 'perplexity',
        model,
        content,
        usage: response.data.usage ? {
          prompt_tokens: response.data.usage.prompt_tokens,
          completion_tokens: response.data.usage.completion_tokens,
          total_tokens: response.data.usage.total_tokens
        } : undefined,
        processing_time_ms: processingTime,
        metadata: {
          citations: response.data.citations,
          id: response.data.id,
          created: response.data.created
        }
      }
    } catch (error) {
      throw new AIPlatformError(
        `Perplexity API error: ${axios.isAxiosError(error) ? error.message : 'Unknown error'}`,
        'perplexity',
        'API_ERROR',
        error
      )
    }
  }
}

// Google Gemini integration
export class GeminiService {
  private apiKey: string | null = null

  constructor() {
    this.apiKey = process.env.GOOGLE_AI_API_KEY || null
  }

  async query(prompt: string, model: 'gemini-pro' | 'gemini-pro-vision' = 'gemini-pro'): Promise<AIPlatformResponse> {
    if (!this.apiKey) {
      throw new AIPlatformError('Google AI API key not configured', 'google')
    }

    if (!await rateLimiter.checkLimit('google', 60)) {
      throw new AIPlatformError('Rate limit exceeded', 'google', 'RATE_LIMIT')
    }

    const startTime = Date.now()

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.7
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const processingTime = Date.now() - startTime
      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      return {
        platform: 'google',
        model,
        content,
        usage: response.data.usageMetadata ? {
          prompt_tokens: response.data.usageMetadata.promptTokenCount,
          completion_tokens: response.data.usageMetadata.candidatesTokenCount,
          total_tokens: response.data.usageMetadata.totalTokenCount
        } : undefined,
        processing_time_ms: processingTime,
        metadata: {
          finishReason: response.data.candidates?.[0]?.finishReason,
          safetyRatings: response.data.candidates?.[0]?.safetyRatings
        }
      }
    } catch (error) {
      throw new AIPlatformError(
        `Google AI API error: ${axios.isAxiosError(error) ? error.message : 'Unknown error'}`,
        'google',
        'API_ERROR',
        error
      )
    }
  }
}

// Main AI platform manager
export class AIPlatformManager {
  private openai = new OpenAIService()
  private anthropic = new AnthropicService()
  private perplexity = new PerplexityService()
  private gemini = new GeminiService()

  async queryPlatform(platform: string, prompt: string): Promise<AIPlatformResponse> {
    switch (platform.toLowerCase()) {
      case 'openai':
      case 'gpt-4':
        return this.openai.query(prompt)
      
      case 'anthropic':
      case 'claude':
        return this.anthropic.query(prompt)
      
      case 'perplexity':
        return this.perplexity.query(prompt)
      
      case 'google':
      case 'gemini':
        return this.gemini.query(prompt)
      
      default:
        throw new AIPlatformError(`Unsupported platform: ${platform}`, platform)
    }
  }

  async queryMultiplePlatforms(platforms: string[], prompt: string): Promise<AIPlatformResponse[]> {
    const promises = platforms.map(platform => 
      this.queryPlatform(platform, prompt).catch(error => ({
        platform,
        model: 'error',
        content: '',
        processing_time_ms: 0,
        error: error.message
      }))
    )

    return Promise.all(promises)
  }
}

// Export singleton instance
export const aiPlatformManager = new AIPlatformManager()