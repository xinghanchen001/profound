# Implementation Plan: Profound Platform Refactor

## Overview
This document provides the step-by-step technical implementation plan to transform the current basic Profound application into the sophisticated Answer Engine Optimization platform shown in the target product screenshots.

---

## Phase 1: Foundation & Navigation (Weeks 1-2)

### 1.1 Sidebar Navigation System

#### Step 1.1.1: Create Sidebar Component Architecture
```bash
# New component structure
src/components/layout/
├── sidebar/
│   ├── sidebar.tsx          # Main sidebar component
│   ├── nav-item.tsx         # Individual navigation items
│   ├── company-selector.tsx # Brand/company dropdown
│   └── search-bar.tsx       # Sidebar search
└── main-layout.tsx          # Overall layout wrapper
```

#### Step 1.1.2: Implement Navigation Context
```typescript
// src/contexts/navigation-context.tsx
interface NavigationContextType {
  currentPage: string
  isCollapsed: boolean
  toggleSidebar: () => void
  setCurrentPage: (page: string) => void
}
```

#### Step 1.1.3: Update Route Structure
```bash
src/app/
├── (dashboard)/             # Dashboard layout group
│   ├── layout.tsx          # Sidebar layout
│   ├── overview/           # Main dashboard (Overview)
│   ├── insights/           # Answer Engine Insights  
│   ├── website/            # My Website
│   ├── conversations/      # Conversations (existing)
│   ├── actions/            # Actions (existing)
│   └── reports/            # Custom Reports
```

### 1.2 Layout Restructuring

#### Step 1.2.1: Create Main Layout Component
```typescript
// src/components/layout/main-layout.tsx
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

#### Step 1.2.2: Update Root Layout
```typescript
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
```

#### Step 1.2.3: Implement Brand Context
```typescript
// src/contexts/brand-context.tsx
interface BrandContextType {
  selectedBrand: Company | null
  brands: Company[]
  competitors: Company[]
  selectBrand: (brandId: string) => void
  addCompetitor: (competitorId: string) => void
}
```

### 1.3 Design System Foundation

#### Step 1.3.1: Create Design Tokens
```typescript
// src/lib/design-tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#2563eb',  // Target product blue
      600: '#1d4ed8',
    },
    success: {
      500: '#10b981',  // Green for positive trends
    },
    danger: {
      500: '#ef4444',   // Red for negative trends
    },
  },
  spacing: {
    sidebar: '256px',
    header: '64px',
  }
}
```

#### Step 1.3.2: Update Tailwind Configuration
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: designTokens.colors,
      spacing: designTokens.spacing,
    }
  }
}
```

---

## Phase 2: Core Analytics Enhancement (Weeks 3-4)

### 2.1 Answer Engine Insights Redesign

#### Step 2.1.1: Create Tabbed Interface System
```bash
src/components/insights/
├── insights-layout.tsx      # Main layout with tabs
├── visibility-tab.tsx       # Visibility analysis
├── sentiment-tab.tsx        # Sentiment analysis  
├── prompts-tab.tsx         # Prompts management
├── platforms-tab.tsx       # Platform-specific data
├── regions-tab.tsx         # Regional analysis
└── citations-tab.tsx       # Citations analysis
```

#### Step 2.1.2: Implement Time Range Controls
```typescript
// src/components/controls/time-range-selector.tsx
interface TimeRangeProps {
  value: TimeRange
  onChange: (range: TimeRange) => void
  showComparison?: boolean
  comparisonPeriod?: 'previous' | 'year-over-year'
}
```

#### Step 2.1.3: Create Competitor Ranking Component
```typescript
// src/components/insights/competitor-ranking.tsx
interface CompetitorRankingProps {
  metric: 'visibility' | 'share-of-voice'
  currentBrand: string
  competitors: CompetitorData[]
  timeRange: TimeRange
}
```

### 2.2 Enhanced Data Visualization

#### Step 2.2.1: Install Chart Dependencies
```bash
npm install recharts @visx/visx d3-scale d3-shape
```

#### Step 2.2.2: Create Chart Component Library
```bash
src/components/charts/
├── visibility-chart.tsx     # Multi-line visibility trends
├── share-of-voice-pie.tsx   # Pie chart for voice share
├── competitor-comparison.tsx # Multi-brand comparison
├── trend-indicator.tsx      # Small trend arrows/percentages
└── chart-container.tsx      # Wrapper with loading states
```

#### Step 2.2.3: Implement Interactive Features
```typescript
// Chart features to implement:
// - Hover tooltips with detailed data
// - Click to drill down to specific time periods
// - Toggle competitor lines on/off
// - Export chart as PNG/SVG
// - Zoom and pan functionality
```

### 2.3 Metrics Calculation Engine

#### Step 2.3.1: Create Analytics Service Layer
```typescript
// src/lib/services/analytics-engine.ts
export class AdvancedAnalyticsService {
  // Visibility Score: % of responses where brand appears
  static calculateVisibilityScore(mentions: Mention[], totalQueries: number): number

  // Share of Voice: % of total mentions in competitive landscape  
  static calculateShareOfVoice(brandMentions: number, totalMentions: number): number

  // Competitor Ranking: Stack rank across all brands
  static calculateCompetitorRanking(brandScores: BrandScore[]): Ranking[]

  // Trend Analysis: Period over period changes
  static calculateTrends(current: Metrics, previous: Metrics): TrendData
}
```

#### Step 2.3.2: Implement Real-time Data Pipeline
```typescript
// src/lib/hooks/use-real-time-analytics.ts
export function useRealTimeAnalytics(brandId: string, timeRange: TimeRange) {
  // Subscribe to Supabase real-time updates
  // Calculate metrics in real-time
  // Handle loading and error states
  // Cache results for performance
}
```

---

## Phase 3: Advanced Features (Weeks 5-6)

### 3.1 Citations Analysis System

#### Step 3.1.1: Database Schema Updates
```sql
-- Add citations tracking tables
CREATE TABLE citation_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  page_url text NOT NULL,
  citation_count integer DEFAULT 0,
  citation_rank integer,
  topic_id uuid REFERENCES topics(id),
  platform_id uuid REFERENCES ai_platforms(id),
  period_start timestamp,
  period_end timestamp,
  created_at timestamp DEFAULT now()
);

CREATE TABLE citation_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  citation_id uuid REFERENCES citations(id),
  prompt_text text NOT NULL,
  query_id uuid REFERENCES ai_queries(id),
  created_at timestamp DEFAULT now()
);
```

#### Step 3.1.2: Citations Analysis Components  
```bash
src/components/citations/
├── citation-share-chart.tsx    # Main citation share visualization
├── pages-table.tsx             # Ranked table of cited pages
├── prompts-analysis.tsx        # Prompts that trigger citations
├── topics-breakdown.tsx        # Citations by topic
├── platforms-comparison.tsx    # Citation patterns by platform
└── citation-landscape-3d.tsx   # 3D visualization component
```

#### Step 3.1.3: Citation Data Pipeline
```typescript
// src/lib/services/citation-service.ts
export class CitationService {
  // Calculate citation share percentage
  static async getCitationShare(brandId: string, timeRange: TimeRange): Promise<number>

  // Get top cited pages with rankings
  static async getTopCitedPages(brandId: string, limit: number): Promise<CitedPage[]>

  // Analyze which prompts trigger citations
  static async getPromptCitationMapping(brandId: string): Promise<PromptCitation[]>

  // Build citation landscape data for 3D viz
  static async getCitationLandscape(brandId: string): Promise<LandscapeData>
}
```

### 3.2 Topic-Level Analysis

#### Step 3.2.1: Topic Taxonomy System
```typescript
// src/lib/types/topics.ts
interface Topic {
  id: string
  name: string
  slug: string
  description?: string
  parentTopicId?: string
  subTopics?: Topic[]
  keywords: string[]
}

interface TopicPerformance {
  topicId: string
  visibility: number
  visibilityRank: number
  shareOfVoice: number
  competitorData: CompetitorTopicData[]
  trendData: TrendPoint[]
}
```

#### Step 3.2.2: Topic Analysis Components
```bash
src/components/topics/
├── topic-selector.tsx          # Hierarchical topic picker
├── topic-performance-grid.tsx  # Grid view of topic metrics
├── topic-detail-view.tsx       # Detailed analysis for one topic
├── topic-comparison.tsx        # Compare multiple topics
└── topic-trends-chart.tsx      # Topic performance over time
```

#### Step 3.2.3: Topic-Based Navigation
```typescript
// Enable drilling down from high-level metrics to topic-specific analysis
// Example: Overall visibility → Corporate Cards visibility → Virtual Cards visibility
// Each level maintains filter context and competitor comparisons
```

### 3.3 Platform-Specific Analysis

#### Step 3.3.1: Platform Comparison Dashboard
```bash
src/components/platforms/
├── platform-overview.tsx       # High-level platform comparison
├── platform-detail.tsx         # Deep dive into one platform
├── platform-preferences.tsx    # What each platform prefers to cite
└── cross-platform-trends.tsx   # How performance varies by platform
```

#### Step 3.3.2: Platform-Specific Optimizations
```typescript
// Different AI platforms have different citation preferences
// ChatGPT vs Perplexity vs Google AI Overviews vs Copilot
// Show platform-specific recommendations and strategies
```

---

## Phase 4: Content & Optimization (Weeks 7-8)

### 4.1 Conversations Feature Implementation

#### Step 4.1.1: Conversation Volume Data Structure
```sql
-- Store ChatGPT conversation volume data
CREATE TABLE conversation_volume (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  volume_count bigint,
  trend_percentage decimal,
  category text,
  related_keywords text[],
  time_period text, -- 'daily', 'weekly', 'monthly'
  created_at timestamp DEFAULT now()
);
```

#### Step 4.1.2: Conversations Interface
```bash
src/components/conversations/
├── keyword-search.tsx          # Search interface for keywords
├── volume-chart.tsx           # Volume trends visualization  
├── industry-keywords.tsx      # Industry-specific keyword analysis
├── related-keywords.tsx       # Related keyword suggestions
└── conversation-trends.tsx    # Trending topics and conversations
```

### 4.2 My Website Analysis

#### Step 4.2.1: Bot Traffic Monitoring
```typescript
// Track AI bot visits to website
// OpenAI Bot, Google Bot, Perplexity Bot, etc.
// Real-time indexing status
// Page-by-page bot activity
```

#### Step 4.2.2: Website Analysis Components
```bash
src/components/website/
├── bot-traffic-overview.tsx    # Overall bot traffic metrics
├── page-indexing-status.tsx   # Which pages are being indexed
├── citation-source-analysis.tsx # How your pages are being cited
└── referral-traffic.tsx       # Traffic coming from AI platforms
```

### 4.3 Actions & Recommendations Engine

#### Step 4.3.1: Recommendation Algorithm
```typescript
// src/lib/services/recommendations-engine.ts
export class RecommendationsEngine {
  // Analyze visibility gaps and suggest content creation
  static analyzeVisibilityGaps(brandData: BrandAnalytics): Recommendation[]

  // Suggest URL optimizations based on citation patterns
  static suggestUrlOptimizations(citationData: CitationData[]): OptimizationSuggestion[]

  // Recommend competitive strategies based on competitor analysis
  static suggestCompetitiveStrategies(competitorData: CompetitorAnalytics): Strategy[]
}
```

#### Step 4.3.2: Actions Interface
```bash
src/components/actions/
├── recommendations-dashboard.tsx # Main recommendations view
├── content-suggestions.tsx      # Suggested content to create
├── url-optimizations.tsx        # URL structure recommendations  
├── competitive-strategies.tsx   # Competitive positioning advice
└── implementation-tracker.tsx   # Track progress on recommendations
```

---

## Phase 5: Polish & Advanced Features (Weeks 9-10)

### 5.1 Advanced Visualizations

#### Step 5.1.1: 3D Citation Landscape
```typescript
// Use Three.js or similar for 3D visualization
// Show citation ecosystem as 3D network
// Interactive exploration of citation relationships
```

#### Step 5.1.2: Interactive Chart Features
```typescript
// Implement advanced chart interactions:
// - Brush selection for time ranges
// - Crossfilter-style filtering
// - Real-time data streaming
// - Animation and transitions
// - Export in multiple formats
```

### 5.2 Performance Optimization

#### Step 5.2.1: Data Caching Strategy
```typescript
// Implement multi-level caching:
// - Browser cache for static data
// - Redis cache for computed metrics
// - Database query optimization
// - Background data preloading
```

#### Step 5.2.2: Loading States & UX
```bash
src/components/ui/
├── skeleton-charts.tsx         # Chart loading skeletons
├── loading-states.tsx          # Various loading indicators
├── error-boundaries.tsx        # Graceful error handling
└── empty-states.tsx           # When no data is available
```

### 5.3 Export & Reporting

#### Step 5.3.1: Report Builder
```bash
src/components/reports/
├── report-builder.tsx          # Drag-and-drop report creation
├── chart-selector.tsx          # Choose charts to include
├── export-options.tsx          # PDF, Excel, PNG options
└── scheduled-reports.tsx       # Automated report generation
```

---

## Technical Implementation Guidelines

### Code Quality Standards
- **TypeScript**: Strict mode enabled, proper typing
- **Testing**: Unit tests for utilities, integration tests for components
- **Documentation**: JSDoc comments for all public APIs
- **Code Style**: Prettier + ESLint with consistent formatting

### Performance Requirements
- **Bundle Size**: Main bundle < 500KB
- **Loading Time**: Initial page load < 2 seconds
- **Chart Rendering**: Interactive charts render within 500ms
- **Data Updates**: Real-time updates without full page refresh

### Accessibility Standards
- **WCAG 2.1 AA**: All components meet accessibility guidelines
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: All text meets contrast requirements

---

## Migration Strategy

### Data Migration
1. **Preserve Existing Data**: Ensure no data loss during refactor
2. **Schema Updates**: Add new tables/columns without breaking existing
3. **Backward Compatibility**: Old API endpoints continue working during transition
4. **Gradual Rollout**: Feature flags for new functionality

### User Experience Transition
1. **Progressive Enhancement**: New features enhance existing workflows
2. **User Education**: In-app tutorials for new features
3. **Feedback Collection**: User testing and feedback integration
4. **Rollback Plan**: Ability to revert to previous version if needed

---

This implementation plan provides the detailed roadmap to transform the current basic application into the sophisticated Answer Engine Optimization platform shown in the target product screenshots. Each phase builds upon the previous, ensuring a systematic and manageable development process.