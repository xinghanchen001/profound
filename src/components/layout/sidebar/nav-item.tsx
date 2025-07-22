'use client'

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItemProps {
  href: string
  icon: LucideIcon
  name: string
  description?: string
  badge?: string
  isActive: boolean
  isCollapsed: boolean
}

export function NavItem({ 
  href, 
  icon: Icon, 
  name, 
  description, 
  badge, 
  isActive, 
  isCollapsed 
}: NavItemProps) {
  if (isCollapsed) {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md transition-colors group relative",
          isActive 
            ? "bg-blue-50 text-blue-600" 
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
        title={name}
      >
        <Icon className="h-5 w-5" />
        
        {/* Tooltip */}
        <div className="absolute left-12 bg-gray-900 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          {name}
          {badge && (
            <span className="ml-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md transition-colors group",
        isActive 
          ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium truncate">{name}</span>
          {badge && (
            <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded flex-shrink-0">
              {badge}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}