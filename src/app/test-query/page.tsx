'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import type { Company, QueryTemplate, AIPlatform } from '@/lib/types'

interface QueryResult {
  id: string
  status: 'pending' | 'sent' | 'completed' | 'failed'
  response?: {
    platform: string
    content: string
    processing_time_ms: number
  }
  error_message?: string
  cost?: number
}

interface ProcessingResult {
  responseId: string
  brandMentions: Array<{
    mention_text: string
    sentiment: string
    sentiment_score: number
  }>
  citations: Array<{
    url: string
    title: string
    domain: string
  }>
  processingTime: number
  errors: string[]
}

export default function TestQuery() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [templates, setTemplates] = useState<QueryTemplate[]>([])
  const [platforms, setPlatforms] = useState<AIPlatform[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ 
    query?: QueryResult; 
    queries?: QueryResult[]; 
    processing?: ProcessingResult | ProcessingResult[] 
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [customQuery, setCustomQuery] = useState('')
  const [variables, setVariables] = useState({
    company_name: '',
    industry: '',
    product_type: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load companies
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('name')

      // Load templates
      const { data: templatesData } = await supabase
        .from('query_templates')
        .select('*')
        .eq('is_active', true)
        .order('name')

      // Load AI platforms
      const { data: platformsData } = await supabase
        .from('ai_platforms')
        .select('*')
        .eq('is_active', true)
        .order('name')

      setCompanies(companiesData || [])
      setTemplates(templatesData || [])
      setPlatforms(platformsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data')
    }
  }

  const executeQuery = async () => {
    if (!selectedCompany || !selectedPlatform) {
      setError('Please select a company and platform')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/query/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedCompany,
          platform: platforms.find(p => p.id === selectedPlatform)?.slug,
          queryText: customQuery || 'Tell me about this company and their products.',
          queryType: 'test'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Query failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const executeTemplateQuery = async () => {
    if (!selectedCompany || !selectedTemplate || !variables.company_name) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const selectedPlatformSlugs = platforms
        .filter(p => p.is_active)
        .slice(0, 2) // Test with first 2 platforms
        .map(p => p.slug)

      const response = await fetch('/api/query/test', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedCompany,
          templateId: selectedTemplate,
          platforms: selectedPlatformSlugs,
          variables,
          queryType: 'template_test'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Batch query failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Query System Test</h1>
            <p className="text-muted-foreground">
              Test the AI query engine and response processing system
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Single Query Test */}
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Single Query Test</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    <option value="">Select Company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">AI Platform</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                  >
                    <option value="">Select Platform</option>
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name} (${platform.cost_per_query})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Custom Query</label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 h-24"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Enter your query (optional - will use default if empty)"
                  />
                </div>

                <Button 
                  onClick={executeQuery} 
                  disabled={loading || !selectedCompany || !selectedPlatform}
                  className="w-full"
                >
                  {loading ? 'Executing...' : 'Execute Single Query'}
                </Button>
              </div>
            </div>

            {/* Template Query Test */}
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Template Query Test</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    <option value="">Select Company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Template</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">Select Template</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    value={variables.company_name}
                    onChange={(e) => setVariables({...variables, company_name: e.target.value})}
                    placeholder="e.g., Apple Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    value={variables.industry}
                    onChange={(e) => setVariables({...variables, industry: e.target.value})}
                    placeholder="e.g., Technology"
                  />
                </div>

                <Button 
                  onClick={executeTemplateQuery} 
                  disabled={loading || !selectedCompany || !selectedTemplate || !variables.company_name}
                  className="w-full"
                >
                  {loading ? 'Executing...' : 'Execute Template Query'}
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="border rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold">Results</h3>
              
              {/* Query Results */}
              {Array.isArray(results.queries) ? (
                <div className="space-y-4">
                  <h4 className="font-medium">Batch Query Results</h4>
                  {results.queries.map((query: QueryResult, index: number) => (
                    <div key={index} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">Query {index + 1}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          query.status === 'completed' ? 'bg-green-100 text-green-800' :
                          query.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {query.status}
                        </span>
                      </div>
                      
                      {query.response && (
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Platform:</strong> {query.response.platform}</p>
                          <p className="text-sm"><strong>Processing Time:</strong> {query.response.processing_time_ms}ms</p>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <strong>Response:</strong>
                            <p className="mt-1">{query.response.content.slice(0, 200)}...</p>
                          </div>
                        </div>
                      )}
                      
                      {query.error_message && (
                        <p className="text-red-600 text-sm">{query.error_message}</p>
                      )}
                      
                      {query.cost && (
                        <p className="text-sm text-muted-foreground">Cost: ${query.cost}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : results.query && (
                <div className="space-y-4">
                  <h4 className="font-medium">Single Query Result</h4>
                  <div className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Query ID: {results.query.id}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        results.query.status === 'completed' ? 'bg-green-100 text-green-800' :
                        results.query.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {results.query.status}
                      </span>
                    </div>
                    
                    {results.query.response && (
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Platform:</strong> {results.query.response.platform}</p>
                        <p className="text-sm"><strong>Processing Time:</strong> {results.query.response.processing_time_ms}ms</p>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <strong>Response:</strong>
                          <p className="mt-1 whitespace-pre-wrap">{results.query.response.content}</p>
                        </div>
                      </div>
                    )}
                    
                    {results.query.error_message && (
                      <p className="text-red-600 text-sm">{results.query.error_message}</p>
                    )}
                    
                    {results.query.cost && (
                      <p className="text-sm text-muted-foreground">Cost: ${results.query.cost}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Processing Results */}
              {results.processing && !Array.isArray(results.processing) && (
                <div className="space-y-4">
                  <h4 className="font-medium">Response Processing</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded p-4">
                      <h5 className="font-medium mb-2">Brand Mentions ({results.processing.brandMentions?.length || 0})</h5>
                      <div className="space-y-2">
                        {results.processing.brandMentions?.map((mention: { mention_text: string; sentiment: string; sentiment_score: number }, index: number) => (
                          <div key={index} className="text-sm border-l-2 border-blue-500 pl-2">
                            <p><strong>&quot;{mention.mention_text}&quot;</strong></p>
                            <p>Sentiment: {mention.sentiment} ({mention.sentiment_score})</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border rounded p-4">
                      <h5 className="font-medium mb-2">Citations ({results.processing.citations?.length || 0})</h5>
                      <div className="space-y-2">
                        {results.processing.citations?.map((citation: { url: string; title: string; domain: string }, index: number) => (
                          <div key={index} className="text-sm border-l-2 border-green-500 pl-2">
                            <p><strong>{citation.title || citation.domain}</strong></p>
                            <p className="text-muted-foreground">{citation.url}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Processing completed in {results.processing.processingTime}ms
                  </p>
                  
                  {results.processing.errors && results.processing.errors.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <h5 className="font-medium text-yellow-800">Processing Warnings:</h5>
                      <ul className="text-sm text-yellow-700 mt-1">
                        {results.processing.errors.map((error: string, index: number) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}