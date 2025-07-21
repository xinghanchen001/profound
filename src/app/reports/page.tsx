'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ReportBuilder } from '@/components/reports/report-builder'
import { ReportTemplates } from '@/components/reports/report-templates'
import { ScheduledReports } from '@/components/reports/scheduled-reports'
import { ReportsService } from '@/lib/api/reports'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Download, 
  Calendar, 
  Settings, 
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Clock,
  Mail
} from 'lucide-react'

interface ReportConfig {
  id?: string
  name: string
  description: string
  type: 'executive' | 'detailed' | 'competitive' | 'performance' | 'custom'
  format: 'pdf' | 'excel' | 'csv' | 'json'
  sections: string[]
  dateRange: '7d' | '30d' | '90d' | '1y'
  companies: string[]
  platforms: string[]
  includeCharts: boolean
  includeRawData: boolean
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    dayOfWeek?: number
    dayOfMonth?: number
    time: string
    recipients: string[]
  }
}

export default function Reports() {
  const [companies, setCompanies] = useState<Array<{id: string, name: string}>>([])
  const [platforms, setPlatforms] = useState<Array<{id: string, name: string}>>([])
  const [activeTab, setActiveTab] = useState<'templates' | 'builder' | 'scheduled'>('templates')
  const [loading, setLoading] = useState(false)
  const [reportHistory, setReportHistory] = useState<any[]>([])

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      // Load companies
      const { data: companiesData } = await supabase
        .from('companies')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

      // Load platforms
      const { data: platformsData } = await supabase
        .from('ai_platforms')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

      if (companiesData) setCompanies(companiesData)
      if (platformsData) setPlatforms(platformsData)

      // Load report history (placeholder - would be from database)
      setReportHistory([
        {
          id: '1',
          name: 'Monthly Executive Summary',
          type: 'executive',
          format: 'pdf',
          created_at: '2025-01-15T10:00:00Z',
          size: '2.3 MB',
          status: 'completed'
        },
        {
          id: '2',
          name: 'Competitive Analysis Report',
          type: 'competitive',
          format: 'excel',
          created_at: '2025-01-10T14:30:00Z',
          size: '5.7 MB',
          status: 'completed'
        }
      ])
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }

  const generateReport = async (config: ReportConfig) => {
    setLoading(true)
    try {
      const report = await ReportsService.generateReport(config)
      
      // Trigger download
      if (config.format === 'pdf') {
        downloadPDFReport(report, config.name)
      } else if (config.format === 'excel') {
        downloadExcelReport(report, config.name)
      } else if (config.format === 'csv') {
        downloadCSVReport(report, config.name)
      } else {
        downloadJSONReport(report, config.name)
      }
      
      // Refresh report history
      await loadInitialData()
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDFReport = (data: any, filename: string) => {
    // In a real implementation, this would generate a PDF
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `${filename}.pdf`)
  }

  const downloadExcelReport = (data: any, filename: string) => {
    // In a real implementation, this would generate an Excel file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `${filename}.xlsx`)
  }

  const downloadCSVReport = (data: any, filename: string) => {
    // Convert data to CSV format
    const csvContent = ReportsService.convertToCSV(data)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    downloadBlob(blob, `${filename}.csv`)
  }

  const downloadJSONReport = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `${filename}.json`)
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'executive': return <BarChart3 className="h-5 w-5 text-blue-600" />
      case 'detailed': return <FileText className="h-5 w-5 text-green-600" />
      case 'competitive': return <Users className="h-5 w-5 text-purple-600" />
      case 'performance': return <TrendingUp className="h-5 w-5 text-orange-600" />
      default: return <Target className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Generate comprehensive reports and schedule automated analytics delivery
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{reportHistory.length}</div>
              <div className="text-sm text-muted-foreground">Generated Reports</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Scheduled Reports</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Email Recipients</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <Download className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">847</div>
              <div className="text-sm text-muted-foreground">Total Downloads</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8">
              {[
                { id: 'templates', label: 'Report Templates', icon: FileText },
                { id: 'builder', label: 'Custom Builder', icon: Settings },
                { id: 'scheduled', label: 'Scheduled Reports', icon: Calendar }
              ].map(tab => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'templates' && (
              <>
                <ReportTemplates
                  companies={companies}
                  platforms={platforms}
                  onGenerateReport={generateReport}
                  loading={loading}
                />
                
                {/* Recent Reports */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
                  <div className="space-y-3">
                    {reportHistory.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getReportTypeIcon(report.type)}
                          <div>
                            <div className="font-medium">{report.name}</div>
                            <div className="text-sm text-gray-600">
                              {formatDate(report.created_at)} • {report.size}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            report.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status}
                          </span>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'builder' && (
              <ReportBuilder
                companies={companies}
                platforms={platforms}
                onGenerateReport={generateReport}
                loading={loading}
              />
            )}

            {activeTab === 'scheduled' && (
              <ScheduledReports
                companies={companies}
                platforms={platforms}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}