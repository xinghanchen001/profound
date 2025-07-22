'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'
import type { Category, AIPlatform } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function TestDB() {
  const [categories, setCategories] = useState<Category[]>([])
  const [platforms, setPlatforms] = useState<AIPlatform[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Supabase client not initialized')
      setLoading(false)
      return
    }
    
    try {
      // Test fetching categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Test fetching AI platforms
      const { data: platformsData, error: platformsError } = await supabase
        .from('ai_platforms')
        .select('*')
        .order('name')

      if (platformsError) throw platformsError
      setPlatforms(platformsData || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Database Connection Test</h1>
          <p className="text-muted-foreground">
            Testing connection to Supabase database
          </p>
        </div>

        <div className="flex justify-center">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (categories.length > 0 || platforms.length > 0) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold">✅ Connection Successful!</h3>
            <p className="text-green-600">Successfully connected to Supabase database</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Categories */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Categories ({categories.length})</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-3">
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Platforms */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">AI Platforms ({platforms.length})</h2>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <div key={platform.id} className="border rounded-lg p-3">
                  <h3 className="font-medium">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Cost: ${platform.cost_per_query} per query
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rate Limit: {platform.rate_limit} RPM
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: {platform.is_active ? '✅ Active' : '❌ Inactive'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}