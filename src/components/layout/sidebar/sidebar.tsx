'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  MessageSquare, 
  Zap, 
  FileText,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { CompanySelector } from './company-selector'
import { SearchBar } from './search-bar'
import { NavItem } from './nav-item'

const navigation = [
  {
    name: 'Overview',
    href: '/overview',
    icon: LayoutDashboard,
    description: 'Launch pad to the entire platform'
  },
  {
    name: 'Answer Engine Insights',
    href: '/insights',
    icon: BarChart3,
    description: 'Detailed analytics and competitive analysis'
  },
  {
    name: 'My Website',
    href: '/website',
    icon: Globe,
    description: 'Bot traffic and citation analysis'
  },
  {
    name: 'Conversations',
    href: '/conversations',
    icon: MessageSquare,
    description: 'ChatGPT conversation volume data',
    badge: 'Beta'
  },
  {
    name: 'Actions',
    href: '/actions',
    icon: Zap,
    description: 'Optimization recommendations',
    badge: 'Beta'
  },
  {
    name: 'Custom Reports',
    href: '/reports',
    icon: FileText,
    description: 'Report builder and exports',
    badge: 'Beta'
  }
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/" className="text-xl font-bold text-gray-900">
            Profound
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Company Selector */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <CompanySelector />
        </div>
      )}

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <SearchBar />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            name={item.name}
            description={item.description}
            badge={item.badge}
            isActive={pathname.startsWith(item.href)}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="text-xs text-gray-500">
            <p>Answer Engine Optimization</p>
            <p className="mt-1">v1.0.0</p>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">P</span>
          </div>
        )}
      </div>
    </div>
  )
}