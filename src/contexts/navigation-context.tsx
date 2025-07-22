'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface NavigationContextType {
  currentPage: string
  isCollapsed: boolean
  toggleSidebar: () => void
  setCurrentPage: (page: string) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [currentPage, setCurrentPage] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <NavigationContext.Provider 
      value={{
        currentPage,
        isCollapsed,
        toggleSidebar,
        setCurrentPage,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}