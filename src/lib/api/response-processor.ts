import { supabase } from '@/lib/supabase'
import type { AIPlatformResponse } from './ai-platforms'
import type { BrandMention, Citation } from '@/lib/types'

// Response processing result
export interface ProcessingResult {
  responseId: string
  brandMentions: BrandMention[]
  citations: Citation[]
  processingTime: number
  errors: string[]
}

// Citation extraction patterns
const CITATION_PATTERNS = {
  // URL patterns
  urls: /https?:\/\/[^\s\])\}>]+/g,
  
  // Reference patterns like [1], (Smith, 2023), etc.
  references: /\[(\d+)\]|\(([^)]+,\s*\d{4})\)/g,
  
  // Source indicators
  sources: /(?:source|according to|from|via|reported by|cited in)[\s:]*([^.]+)/gi,
  
  // Domain extraction from URLs
  domain: /https?:\/\/(?:www\.)?([^\/\s]+)/
}

// Text processing utilities
export class TextProcessor {
  
  /**
   * Extract URLs from text
   */
  static extractUrls(text: string): string[] {
    const matches = text.match(CITATION_PATTERNS.urls) || []
    return [...new Set(matches)] // Remove duplicates
  }

  /**
   * Extract domain from URL
   */
  static extractDomain(url: string): string {
    const match = url.match(CITATION_PATTERNS.domain)
    return match?.[1] || ''
  }

  /**
   * Clean and normalize text
   */
  static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
      .trim()
  }

  /**
   * Extract sentences containing keywords
   */
  static extractSentencesWithKeywords(text: string, keywords: string[]): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const keywordPattern = new RegExp(keywords.join('|'), 'gi')
    
    return sentences.filter(sentence => keywordPattern.test(sentence))
  }

  /**
   * Calculate text similarity (simple Jaccard similarity)
   */
  static calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/))
    const words2 = new Set(text2.toLowerCase().split(/\s+/))
    
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    
    return intersection.size / union.size
  }
}

// Brand mention detection
export class BrandMentionDetector {
  
  /**
   * Detect brand mentions in text
   */
  static async detectMentions(
    responseId: string,
    companyId: string,
    text: string
  ): Promise<BrandMention[]> {
    try {
      // Get company keywords
      const { data: keywords, error } = await supabase
        .from('keywords')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)

      if (error || !keywords) {
        console.error('Error fetching keywords:', error)
        return []
      }

      const mentions: BrandMention[] = []
      const sentences = text.split(/[.!?]+/)

      for (const keyword of keywords) {
        const pattern = new RegExp(`\\b${keyword.keyword}\\b`, 'gi')
        let match

        while ((match = pattern.exec(text)) !== null) {
          const position = match.index
          const mentionText = match[0]
          
          // Find the sentence containing this mention
          let sentenceIndex = 0
          let charCount = 0
          
          for (let i = 0; i < sentences.length; i++) {
            if (charCount + sentences[i].length >= position) {
              sentenceIndex = i
              break
            }
            charCount += sentences[i].length + 1 // +1 for the separator
          }

          const contextBefore = sentences[sentenceIndex - 1] || ''
          const contextAfter = sentences[sentenceIndex + 1] || ''
          const sentiment = this.analyzeSentiment(sentences[sentenceIndex])

          mentions.push({
            id: '', // Will be set by database
            response_id: responseId,
            company_id: companyId,
            keyword_id: keyword.id,
            mention_text: mentionText,
            context_before: contextBefore.trim(),
            context_after: contextAfter.trim(),
            sentiment: sentiment.label,
            sentiment_score: sentiment.score,
            position_in_response: position,
            is_primary_mention: this.isPrimaryMention(text, mentionText, position),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        }
      }

      return mentions
    } catch (error) {
      console.error('Error detecting brand mentions:', error)
      return []
    }
  }

  /**
   * Simple sentiment analysis (can be enhanced with ML models)
   */
  private static analyzeSentiment(text: string): { label: 'positive' | 'negative' | 'neutral', score: number } {
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'outstanding', 'superior', 'best',
      'innovative', 'leader', 'top', 'quality', 'reliable', 'trusted', 'recommended',
      'love', 'like', 'prefer', 'choose', 'successful', 'impressive', 'effective'
    ]
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'poor', 'worst', 'failed', 'problem', 'issue',
      'disappointing', 'unreliable', 'costly', 'expensive', 'difficult', 'slow',
      'hate', 'dislike', 'avoid', 'concern', 'worried', 'doubt', 'questionable'
    ]

    const lowerText = text.toLowerCase()
    let positiveCount = 0
    let negativeCount = 0

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++
    })

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++
    })

    const totalSentiment = positiveCount - negativeCount
    const totalWords = positiveCount + negativeCount

    if (totalWords === 0) {
      return { label: 'neutral', score: 0 }
    }

    const score = totalSentiment / Math.max(totalWords, 1)

    if (score > 0.2) {
      return { label: 'positive', score: Math.min(score, 1) }
    } else if (score < -0.2) {
      return { label: 'negative', score: Math.max(score, -1) }
    } else {
      return { label: 'neutral', score }
    }
  }

  /**
   * Determine if this is a primary mention (first or most prominent)
   */
  private static isPrimaryMention(text: string, mention: string, position: number): boolean {
    const textLength = text.length
    const relativePosition = position / textLength

    // Consider it primary if:
    // 1. It's in the first 30% of the text
    // 2. It's the first occurrence of this exact mention
    if (relativePosition <= 0.3) return true

    const firstOccurrence = text.toLowerCase().indexOf(mention.toLowerCase())
    return firstOccurrence === position
  }
}

// Citation extraction and analysis
export class CitationExtractor {
  
  /**
   * Extract citations from AI response
   */
  static async extractCitations(
    responseId: string,
    text: string,
    metadata?: Record<string, unknown>
  ): Promise<Citation[]> {
    const citations: Citation[] = []

    // Extract from metadata first (Perplexity provides citations)
    if (metadata?.citations && Array.isArray(metadata.citations)) {
      for (const citation of metadata.citations) {
        if (typeof citation === 'object' && citation !== null) {
          citations.push(this.createCitationFromMetadata(responseId, citation))
        }
      }
    }

    // Extract URLs from text
    const urls = TextProcessor.extractUrls(text)
    for (const url of urls) {
      // Skip if already found in metadata
      if (citations.some(c => c.url === url)) continue

      citations.push(await this.createCitationFromUrl(responseId, url, text))
    }

    // Extract reference-style citations
    const references = this.extractReferences(text)
    for (const ref of references) {
      citations.push(this.createCitationFromReference(responseId, ref))
    }

    return citations
  }

  /**
   * Create citation from metadata (e.g., Perplexity API response)
   */
  private static createCitationFromMetadata(responseId: string, citation: Record<string, unknown>): Citation {
    return {
      id: '', // Will be set by database
      response_id: responseId,
      url: String(citation.url || ''),
      title: String(citation.title || ''),
      domain: citation.url ? TextProcessor.extractDomain(String(citation.url)) : '',
      author: String(citation.author || ''),
      published_date: String(citation.published_date || ''),
      excerpt: String(citation.excerpt || citation.snippet || ''),
      relevance_score: Number(citation.relevance_score) || 0.5,
      citation_type: this.categorizeCitationType(String(citation.url || ''), String(citation.title || '')),
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  /**
   * Create citation from URL found in text
   */
  private static async createCitationFromUrl(responseId: string, url: string, context: string): Promise<Citation> {
    const domain = TextProcessor.extractDomain(url)
    
    // Use the provided context (already extracted)

    return {
      id: '', // Will be set by database
      response_id: responseId,
      url,
      title: '', // Could be extracted by fetching the URL
      domain,
      author: '',
      published_date: '',
      excerpt: context,
      relevance_score: 0.5,
      citation_type: this.categorizeCitationType(url, ''),
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  /**
   * Create citation from reference-style citation
   */
  private static createCitationFromReference(responseId: string, reference: string): Citation {
    return {
      id: '', // Will be set by database
      response_id: responseId,
      url: '',
      title: reference,
      domain: '',
      author: this.extractAuthorFromReference(reference),
      published_date: this.extractDateFromReference(reference),
      excerpt: '',
      relevance_score: 0.3,
      citation_type: 'research_paper',
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  /**
   * Extract references from text
   */
  private static extractReferences(text: string): string[] {
    const references: string[] = []
    let match

    while ((match = CITATION_PATTERNS.references.exec(text)) !== null) {
      if (match[1]) {
        references.push(`Reference ${match[1]}`)
      } else if (match[2]) {
        references.push(match[2])
      }
    }

    return [...new Set(references)]
  }

  /**
   * Categorize citation type based on URL and title
   */
  private static categorizeCitationType(url: string, title: string): Citation['citation_type'] {
    const domain = TextProcessor.extractDomain(url).toLowerCase()
    
    if (domain.includes('arxiv') || domain.includes('pubmed') || title.includes('study') || title.includes('research')) {
      return 'research_paper'
    } else if (domain.includes('news') || domain.includes('cnn') || domain.includes('bbc') || domain.includes('reuters')) {
      return 'news_article'
    } else if (domain.includes('twitter') || domain.includes('facebook') || domain.includes('linkedin')) {
      return 'social_media'
    } else if (title.includes('review') || domain.includes('review')) {
      return 'review'
    } else {
      return 'primary_source'
    }
  }

  /**
   * Extract author from reference string
   */
  private static extractAuthorFromReference(reference: string): string {
    const authorMatch = reference.match(/^([^,]+),/)
    return authorMatch ? authorMatch[1].trim() : ''
  }

  /**
   * Extract date from reference string
   */
  private static extractDateFromReference(reference: string): string {
    const dateMatch = reference.match(/(\d{4})/)
    return dateMatch ? `${dateMatch[1]}-01-01` : ''
  }
}

// Main response processor
export class ResponseProcessor {
  
  /**
   * Process AI response completely
   */
  static async processResponse(
    queryId: string,
    companyId: string,
    response: AIPlatformResponse
  ): Promise<ProcessingResult> {
    const startTime = Date.now()
    const errors: string[] = []

    try {
      // Store the response in database first
      const { data: responseData, error: responseError } = await supabase
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

      if (responseError || !responseData) {
        throw new Error(`Failed to store response: ${responseError?.message}`)
      }

      const responseId = responseData.id

      // Process brand mentions
      let brandMentions: BrandMention[] = []
      try {
        brandMentions = await BrandMentionDetector.detectMentions(
          responseId,
          companyId,
          response.content
        )

        // Store brand mentions
        if (brandMentions.length > 0) {
          const { error: mentionsError } = await supabase
            .from('brand_mentions')
            .insert(brandMentions.map(m => ({ ...m, id: undefined })))

          if (mentionsError) {
            errors.push(`Failed to store brand mentions: ${mentionsError.message}`)
          }
        }
      } catch (error) {
        errors.push(`Brand mention detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Process citations
      let citations: Citation[] = []
      try {
        citations = await CitationExtractor.extractCitations(
          responseId,
          response.content,
          response.metadata
        )

        // Store citations
        if (citations.length > 0) {
          const { error: citationsError } = await supabase
            .from('citations')
            .insert(citations.map(c => ({ ...c, id: undefined })))

          if (citationsError) {
            errors.push(`Failed to store citations: ${citationsError.message}`)
          }
        }
      } catch (error) {
        errors.push(`Citation extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      const processingTime = Date.now() - startTime

      return {
        responseId,
        brandMentions,
        citations,
        processingTime,
        errors
      }

    } catch (error) {
      errors.push(`Response processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      return {
        responseId: '',
        brandMentions: [],
        citations: [],
        processingTime: Date.now() - startTime,
        errors
      }
    }
  }

  /**
   * Get processed response data
   */
  static async getProcessedResponse(responseId: string) {
    try {
      const { data, error } = await supabase
        .from('ai_responses')
        .select(`
          *,
          brand_mentions(*),
          citations(*)
        `)
        .eq('id', responseId)
        .single()

      if (error) {
        console.error('Error fetching processed response:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getProcessedResponse:', error)
      return null
    }
  }
}

