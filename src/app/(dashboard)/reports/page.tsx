'use client'

import { useState } from 'react'
import { useBrand } from '@/contexts/brand-context'
import { Button } from '@/components/ui/button'
import { 
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Globe,
  Plus,
  Search,
  Filter,
  Clock
} from 'lucide-react'

// Mock data for reports
const mockReportsData = {
  totalReports: 12,
  scheduledReports: 3,
  templates: [
    {
      id: '1',
      name: 'Monthly Brand Visibility Report',
      description: 'Comprehensive analysis of brand mentions across all AI platforms',
      category: 'Visibility',
      lastGenerated: '2024-01-15',
      frequency: 'Monthly',
      recipients: 3,
    },
    {
      id: '2', 
      name: 'Competitive Intelligence Summary',
      description: 'How you compare against competitors in AI search results',
      category: 'Competitive',
      lastGenerated: '2024-01-10',
      frequency: 'Weekly',
      recipients: 5,
    },
    {
      id: '3',
      name: 'Answer Engine Performance',
      description: 'Platform-specific performance metrics and citation analysis',
      category: 'Performance',
      lastGenerated: '2024-01-12',
      frequency: 'Bi-weekly',
      recipients: 2,
    },
  ],
  recentReports: [
    {
      id: 'r1',
      name: 'Q4 2024 Brand Visibility Analysis',
      type: 'Visibility Report',
      generatedAt: '2024-01-15T10:30:00Z',
      size: '2.4 MB',
      pages: 24,
      status: 'completed',
    },
    {
      id: 'r2',
      name: 'January Competitive Landscape',
      type: 'Competitive Analysis',
      generatedAt: '2024-01-10T14:15:00Z',
      size: '1.8 MB',
      pages: 18,
      status: 'completed',
    },
    {
      id: 'r3',
      name: 'Weekly Performance Summary',
      type: 'Performance Report',
      generatedAt: '2024-01-08T09:00:00Z',
      size: '956 KB',
      pages: 8,
      status: 'completed',
    },
  ]
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState('templates')
  const [filterCategory, setFilterCategory] = useState('all')
  const { selectedBrand } = useBrand()

  if (!selectedBrand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Selected</h3>
        <p className="text-gray-500 mb-4">Select a company to create and manage reports</p>
        <Button onClick={() => window.location.href = '/setup'}>
          Add Company
        </Button>
      </div>
    )
  }

  const tabs = [
    { id: 'templates', name: 'Report Templates', icon: FileText },
    { id: 'recent', name: 'Recent Reports', icon: Clock },
    { id: 'scheduled', name: 'Scheduled Reports', icon: Calendar },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Visibility': return BarChart3
      case 'Competitive': return Users
      case 'Performance': return TrendingUp
      default: return FileText
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Visibility': return 'bg-blue-100 text-blue-800'
      case 'Competitive': return 'bg-purple-100 text-purple-800'
      case 'Performance': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Reports</h1>
          <p className="text-gray-600 mt-1">
            Create, schedule, and manage reports for {selectedBrand.name}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {mockReportsData.totalReports}
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Total Reports</div>
            <div className="text-sm text-gray-600">Generated</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {mockReportsData.scheduledReports}
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Scheduled</div>
            <div className="text-sm text-gray-600">Auto-generate</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                24
              </div>
              <div className="text-sm text-green-600 font-medium">
                pages
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Latest Report</div>
            <div className="text-sm text-gray-600">Pages generated</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Download className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                847
              </div>
              <div className="text-sm text-green-600 font-medium">
                +23%
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Downloads</div>
            <div className="text-sm text-gray-600">This month</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Report Templates</h3>
            <div className="flex items-center gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-200 rounded-md px-4 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Visibility">Visibility</option>
                <option value="Competitive">Competitive</option>
                <option value="Performance">Performance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReportsData.templates
              .filter(template => filterCategory === 'all' || template.category === filterCategory)
              .map((template) => {
                const IconComponent = getCategoryIcon(template.category)
                return (
                  <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className={`px-2 py-1 rounded ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </span>
                          <span>{template.frequency}</span>
                          <span>{template.recipients} recipients</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        Last: {new Date(template.lastGenerated).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Reports</h3>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search Reports
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200">
              {mockReportsData.recentReports.map((report) => (
                <div key={report.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{report.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{report.type}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
                        <span>{report.pages} pages</span>
                        <span>{report.size}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Reports</h3>
            <p className="text-gray-500 mb-4">
              Set up automated report generation to receive regular insights
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Schedule Your First Report
            </Button>
          </div>
        </div>
      )}

      {/* Report Builder CTA */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Custom Report Builder
            </h3>
            <p className="text-blue-700 mb-4">
              Create personalized reports with drag-and-drop widgets, custom metrics, and automated scheduling.
            </p>
            <div className="flex items-center gap-4">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Launch Report Builder
              </Button>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                View Templates
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}