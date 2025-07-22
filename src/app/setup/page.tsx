'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getSupabaseClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Building2, Plus, Search, Settings } from 'lucide-react'

interface Company {
  id: string
  name: string
  slug: string
  website_url?: string
  description?: string
  industry?: string
  is_active: boolean
}

export default function Setup() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    description: '',
    industry: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      return
    }

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setCompanies(data as Company[])
    } catch (error) {
      console.error('Error loading companies:', error)
    }
  }

  const createSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('Supabase client not initialized')
      return
    }

    setLoading(true)
    try {
      const slug = createSlug(formData.name)
      
      const { data, error } = await supabase
        .from('companies')
        .insert([
          {
            name: formData.name,
            slug,
            website_url: formData.website_url || null,
            description: formData.description || null,
            industry: formData.industry || null,
            is_active: true
          }
        ])
        .select()

      if (error) throw error

      // Reset form and reload companies
      setFormData({ name: '', website_url: '', description: '', industry: '' })
      setShowForm(false)
      loadCompanies()
      
      alert('Company added successfully!')
    } catch (error: any) {
      console.error('Error creating company:', error)
      alert('Error creating company: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const toggleCompanyStatus = async (companyId: string, currentStatus: boolean) => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: !currentStatus })
        .eq('id', companyId)

      if (error) throw error
      
      loadCompanies()
    } catch (error) {
      console.error('Error updating company:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Setup & Configuration</h1>
              <p className="text-muted-foreground">
                Manage companies and configure your analysis settings
              </p>
            </div>
            
            <Button onClick={() => setShowForm(!showForm)} className="w-fit">
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </div>

          {/* Add Company Form */}
          {showForm && (
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Add New Company</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., OpenAI"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Website URL</label>
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      placeholder="https://openai.com"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g., Artificial Intelligence"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the company"
                      className="w-full p-2 border rounded-md h-20"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Company'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Companies List */}
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Companies ({companies.length})
              </h2>
            </div>
            
            {companies.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Companies Added</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first company to start analyzing brand mentions and performance.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Company
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {companies.map((company) => (
                  <div key={company.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{company.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          company.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {company.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mt-1">
                        {company.industry && <span>Industry: {company.industry}</span>}
                        {company.website_url && (
                          <span className="ml-4">
                            <a href={company.website_url} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline">
                              {company.website_url}
                            </a>
                          </span>
                        )}
                      </div>
                      
                      {company.description && (
                        <p className="text-sm text-muted-foreground mt-1">{company.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCompanyStatus(company.id, company.is_active)}
                      >
                        {company.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium mb-2">Run Test Query</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Test queries against AI platforms for your companies
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/test-query">Go to Test Query</a>
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium mb-2">View Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Analyze brand mentions and performance metrics
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <Settings className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium mb-2">Database Status</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check database connection and setup
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/test-db">Test Database</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}