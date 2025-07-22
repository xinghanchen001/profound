'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'

interface Company {
  id: string
  name: string
  slug: string
  website_url?: string
  description?: string
  industry?: string
  is_active: boolean
}

interface BrandContextType {
  selectedBrand: Company | null
  brands: Company[]
  competitors: Company[]
  selectBrand: (brandId: string) => void
  addCompetitor: (competitorId: string) => void
  removeCompetitor: (competitorId: string) => void
  loadBrands: () => Promise<void>
  loading: boolean
}

const BrandContext = createContext<BrandContextType | undefined>(undefined)

interface BrandProviderProps {
  children: ReactNode
}

export function BrandProvider({ children }: BrandProviderProps) {
  const [selectedBrand, setSelectedBrand] = useState<Company | null>(null)
  const [brands, setBrands] = useState<Company[]>([])
  const [competitors, setCompetitors] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  const loadBrands = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      
      setBrands(data as Company[])
      
      // Auto-select first brand if none selected
      if (data && data.length > 0 && !selectedBrand) {
        setSelectedBrand(data[0] as Company)
      }
    } catch (error) {
      console.error('Error loading brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectBrand = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId)
    if (brand) {
      setSelectedBrand(brand)
      // Store selection in localStorage for persistence
      localStorage.setItem('selectedBrandId', brandId)
      loadCompetitors(brandId)
    }
  }

  const loadCompetitors = async (brandId: string) => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      // TODO: Load competitors from database when competitors table is created
      // For now, just clear competitors
      setCompetitors([])
    } catch (error) {
      console.error('Error loading competitors:', error)
    }
  }

  const addCompetitor = async (competitorId: string) => {
    if (!selectedBrand) return
    
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      // TODO: Add to competitors table when implemented
      console.log('Adding competitor:', competitorId)
    } catch (error) {
      console.error('Error adding competitor:', error)
    }
  }

  const removeCompetitor = async (competitorId: string) => {
    if (!selectedBrand) return
    
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      // TODO: Remove from competitors table when implemented
      console.log('Removing competitor:', competitorId)
    } catch (error) {
      console.error('Error removing competitor:', error)
    }
  }

  useEffect(() => {
    loadBrands()
    
    // Restore selected brand from localStorage
    const savedBrandId = localStorage.getItem('selectedBrandId')
    if (savedBrandId && brands.length > 0) {
      const brand = brands.find(b => b.id === savedBrandId)
      if (brand) {
        setSelectedBrand(brand)
        loadCompetitors(savedBrandId)
      }
    }
  }, [])

  return (
    <BrandContext.Provider 
      value={{
        selectedBrand,
        brands,
        competitors,
        selectBrand,
        addCompetitor,
        removeCompetitor,
        loadBrands,
        loading,
      }}
    >
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider')
  }
  return context
}