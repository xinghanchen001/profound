import { MainLayout } from '@/components/layout/main-layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Profound',
    default: 'Profound - Answer Engine Optimization Platform',
  },
  description: 'Understand and optimize your brand\'s visibility across AI-powered search engines and chatbots.',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}