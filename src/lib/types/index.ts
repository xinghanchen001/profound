// Re-export database types
export * from '../supabase'

// Additional application types
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role: 'admin' | 'user' | 'viewer'
  subscription_tier: 'free' | 'pro' | 'enterprise'
  credits_remaining: number
  last_login?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AIQuery {
  id: string
  company_id?: string
  ai_platform_id?: string
  template_id?: string
  query_text: string
  query_type?: string
  status: 'pending' | 'sent' | 'completed' | 'failed'
  sent_at?: string
  completed_at?: string
  error_message?: string
  cost?: number
  created_at: string
  updated_at: string
}

export interface AIResponse {
  id: string
  query_id?: string
  response_text: string
  response_metadata?: Record<string, unknown>
  processing_time_ms?: number
  confidence_score?: number
  created_at: string
  updated_at: string
}

export interface BrandMention {
  id: string
  response_id?: string
  company_id?: string
  keyword_id?: string
  mention_text: string
  context_before?: string
  context_after?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  sentiment_score?: number
  position_in_response?: number
  is_primary_mention: boolean
  created_at: string
  updated_at: string
}

export interface Citation {
  id: string
  response_id?: string
  url: string
  title?: string
  domain?: string
  author?: string
  published_date?: string
  excerpt?: string
  relevance_score?: number
  citation_type?: 'primary_source' | 'news_article' | 'research_paper' | 'review' | 'social_media'
  is_verified: boolean
  created_at: string
  updated_at: string
}