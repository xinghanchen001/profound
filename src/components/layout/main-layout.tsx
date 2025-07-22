'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar/sidebar'
import { NavigationProvider } from '@/contexts/navigation-context'
import { BrandProvider } from '@/contexts/brand-context'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <BrandProvider>
      <NavigationProvider>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </NavigationProvider>
    </BrandProvider>
  )
}