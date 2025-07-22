'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Building2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBrand } from '@/contexts/brand-context'

interface Company {
  id: string
  name: string
  industry?: string
}

export function CompanySelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedBrand, brands, selectBrand } = useBrand()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors",
          isOpen && "bg-gray-100"
        )}
      >
        <div className="flex items-center min-w-0">
          <Building2 className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {selectedBrand?.name || 'Select Company'}
            </p>
            {selectedBrand?.industry && (
              <p className="text-xs text-gray-500 truncate">
                {selectedBrand.industry}
              </p>
            )}
          </div>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-gray-500 transition-transform flex-shrink-0",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <div className="py-2 max-h-64 overflow-y-auto">
              {brands.length > 0 ? (
                brands.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      selectBrand(company.id)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                      selectedBrand?.id === company.id && "bg-blue-50 text-blue-600"
                    )}
                  >
                    <Building2 className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="font-medium truncate">{company.name}</p>
                      {company.industry && (
                        <p className="text-xs text-gray-500 truncate">
                          {company.industry}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-gray-500">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No companies added yet</p>
                  <p className="text-xs mt-1">Visit Setup to add your first company</p>
                </div>
              )}
              
              {/* Add Company Option */}
              <div className="border-t border-gray-100 mt-2">
                <button
                  onClick={() => {
                    window.location.href = '/setup'
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Company
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}