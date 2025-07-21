# Profound - Answer Engine Optimization Platform

## Project Overview

The Profound platform is a comprehensive Answer Engine Optimization (AEO) solution that helps companies optimize their presence across AI-powered search engines and chatbots. It provides analytics, brand monitoring, and competitive insights for AI platforms like OpenAI, Perplexity, Claude, and Google Gemini.

**📋 Original Requirements**: See `PRD_Answer_Engine_Optimization_Platform.md` in this directory for the complete Product Requirements Document with detailed specifications, user stories, and acceptance criteria.

## Architecture

### Technology Stack
- **Frontend**: Next.js 15.4.2 with TypeScript and Turbopack
- **UI Framework**: Shadcn/ui components with Tailwind CSS
- **Database**: Supabase PostgreSQL with 12-table schema
- **Charts**: Recharts for data visualization
- **AI Integrations**: OpenAI, Anthropic, Perplexity, Google Gemini APIs

### Project Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Homepage
│   ├── dashboard/               # Analytics dashboard
│   ├── brand-analysis/          # Brand sentiment analysis
│   ├── test-db/                 # Database connection testing
│   ├── test-query/              # Query engine testing
│   └── api/query/test/          # API route for testing
├── components/                   # Reusable UI components
│   ├── layout/                  # Header, footer components
│   ├── charts/                  # Data visualization components
│   └── ui/                      # Base UI components (Shadcn)
├── lib/                         # Core business logic
│   ├── api/                     # Service layer
│   │   ├── ai-platforms.ts      # AI platform integrations
│   │   ├── analytics.ts         # Analytics data aggregation
│   │   ├── query-engine.ts      # Query processing engine
│   │   └── response-processor.ts # Brand mention detection
│   ├── supabase.ts              # Database client & types
│   └── utils.ts                 # Utility functions
└── index.css                    # Global styles & CSS variables
```

## Database Schema

### Core Tables (12 total)
1. **companies** - Client organizations
2. **ai_platforms** - AI service providers (OpenAI, Claude, etc.)
3. **ai_queries** - Query tracking with cost/performance metrics
4. **ai_responses** - Response storage with processing metadata
5. **brand_mentions** - Detected brand references with sentiment
6. **citations** - Extracted source citations with relevance scores
7. **keywords** - Tracked keyword performance
8. **templates** - Query templates with variable substitution
9. **batch_queries** - Bulk query management
10. **query_results** - Aggregated query outcomes
11. **competitors** - Competitive analysis tracking
12. **users** - User management and access control

### Key Relationships
- Companies → AI Queries → AI Responses → Brand Mentions/Citations
- Templates → Batch Queries → Query Results
- Keywords ← → Brand Mentions (many-to-many)

## Core Features

### 1. Analytics Dashboard (`/dashboard`)
- **Real-time metrics**: Total mentions, sentiment scores, cost tracking
- **Interactive charts**: Mention trends, platform performance comparison
- **Data tables**: Top keywords, citation sources
- **Filtering**: Company selection, time range (7d/30d/90d)

### 2. Brand Analysis (`/brand-analysis`)
- **Sentiment breakdown**: Pie charts with positive/negative/neutral distribution
- **Platform comparison**: Performance across AI platforms
- **Competitive insights**: Market share and competitor analysis
- **Activity heatmap**: Mention patterns by time/day
- **Export functionality**: JSON data export for external analysis

### 3. Conversations View (`/conversations`)
- **Detailed response analysis**: Full conversation history with AI responses
- **Brand mention tracking**: Context-aware sentiment analysis with confidence scores
- **Citation analysis**: Source attribution and relevance scoring
- **Advanced filtering**: Platform, sentiment, date range, and search capabilities
- **Interactive detail view**: Expandable sections with copy-to-clipboard functionality
- **Performance metrics**: Cost tracking, response times, and mention counts

### 4. Actions & Recommendations (`/actions`)
- **AI-powered recommendations**: Intelligent action items based on analytics data
- **Strategic insights**: Company performance analysis with actionable opportunities
- **Content strategy**: Gap analysis and content creation recommendations
- **Competitive analysis**: Offensive and defensive strategies against competitors
- **Progress tracking**: Interactive cards with step-by-step completion tracking
- **Export capabilities**: Action plans and strategic documents for team collaboration

### 5. AI Platform Integration
- **Multi-platform support**: OpenAI, Anthropic, Perplexity, Google Gemini
- **Rate limiting**: Prevents API quota exhaustion
- **Cost tracking**: Monitor API usage costs
- **Error handling**: Robust failure management

### 6. Query Engine
- **Template processing**: Variable substitution in queries
- **Batch execution**: Parallel processing across platforms
- **Response analysis**: Automated brand mention detection
- **Citation extraction**: Source attribution and relevance scoring

### 7. Brand Mention Detection
- **Sentiment analysis**: Positive/negative/neutral classification
- **Context extraction**: Surrounding text analysis
- **Confidence scoring**: Mention reliability assessment
- **Keyword association**: Link mentions to tracked keywords

## API Services

### AnalyticsService
- `getDashboardMetrics()` - Aggregate dashboard data
- `getMentionTrends()` - Time-series mention analysis
- `getPlatformPerformance()` - Cross-platform comparison
- `getTopKeywords()` - Keyword performance ranking
- `getTopCitationSources()` - Source authority analysis

### AIPlatformManager
- `queryPlatform()` - Single platform query execution
- `queryMultiplePlatforms()` - Parallel multi-platform queries
- Rate limiting and cost tracking integration

### QueryEngine
- `processTemplate()` - Variable substitution processing
- `executeBatchQuery()` - Bulk query management
- Database integration for query tracking

### ResponseProcessor & BrandMentionDetector
- `detectMentions()` - Brand reference identification
- `extractCitations()` - Source citation parsing
- Sentiment analysis and confidence scoring

## Component Library

### Chart Components
- **MetricCard**: KPI display with trend indicators
- **MentionTrendsChart**: Time-series line chart
- **PlatformPerformanceChart**: Multi-axis bar chart
- **BrandSentimentChart**: Interactive pie chart
- **CompetitorComparisonChart**: Competitive analysis bars
- **BrandMentionHeatmap**: Activity pattern visualization

### Layout Components
- **Header**: Navigation with route links
- **Footer**: Site footer information
- Responsive design with mobile support

## Development Phase History

### Phase 1: Foundation (Completed)
1. ✅ Next.js project initialization with TypeScript
2. ✅ Shadcn/ui component system setup
3. ✅ Supabase client configuration
4. ✅ Database connection testing
5. ✅ Basic project structure and routing

### Phase 2: Core Features (Completed)
1. ✅ AI platform SDK installation and configuration
2. ✅ AI platform service layer with rate limiting
3. ✅ Query engine with template processing
4. ✅ Response processing with brand mention detection
5. ✅ Brand mention detection algorithms
6. ✅ Citation extraction system
7. ✅ Query testing interface

### Phase 3: Analytics & UI (Nearly Complete)
1. ✅ Chart libraries installation (Recharts, Lucide React)
2. ✅ Analytics service with data aggregation
3. ✅ Performance metrics dashboard
4. ✅ Brand analysis page with specialized charts
5. ✅ Conversations view with detailed response analysis
6. ✅ Actions page with AI-powered recommendations
7. 🔄 Export and reporting features (Final step)

---

## Changelog

### 2025-01-20 - Brand Analysis Implementation
**Added:**
- Brand analysis page at `/brand-analysis` with comprehensive sentiment insights
- BrandSentimentChart component with interactive pie charts
- CompetitorComparisonChart for market analysis
- BrandMentionHeatmap for activity pattern visualization
- Export functionality for analysis data
- Navigation integration in header component

**Fixed:**
- TypeScript compilation errors with proper type casting
- ESLint warnings for implicit any types
- Build optimization for production deployment

**Technical Details:**
- Advanced filtering by sentiment (all/positive/negative/neutral)
- Real-time data aggregation from Supabase
- Responsive chart layouts with proper error handling
- Company and time range selection integration

### 2025-01-20 - Analytics Dashboard Implementation
**Added:**
- Comprehensive analytics dashboard at `/dashboard`
- Real-time metric cards with trend indicators
- Interactive charts for mention trends and platform performance
- Data tables for top keywords and citation sources
- Company selection and time range filtering

**Technical Details:**
- AnalyticsService for data aggregation
- MetricCard, MentionTrendsChart, PlatformPerformanceChart components
- Integration with Supabase for real-time data
- Loading states and error handling

### 2025-01-20 - Analytics Service Layer
**Added:**
- Comprehensive AnalyticsService class with data aggregation methods
- Time-based trend analysis and platform performance comparison
- Dashboard metrics calculation with period-over-period changes
- Top keywords and citation sources analysis

**Technical Details:**
- Complex SQL queries through Supabase client
- Data transformation and aggregation logic
- TypeScript interfaces for all analytics data types
- Error handling and fallback mechanisms

### 2025-01-20 - Chart Visualization Setup
**Added:**
- Recharts library for data visualization
- Lucide React for consistent iconography
- date-fns for date manipulation in charts
- Base chart components with responsive design

### 2025-01-20 - Response Processing System
**Added:**
- ResponseProcessor class for AI response analysis
- BrandMentionDetector with sentiment analysis
- CitationExtractor for source attribution
- Database integration for storing processed results

**Technical Details:**
- Multiple detection methods (direct, contextual, keyword-based)
- Sentiment scoring and confidence assessment
- Citation parsing with relevance scoring
- Bulk processing capabilities

### 2025-01-20 - Query Engine Implementation
**Added:**
- QueryEngine class with template processing
- Variable substitution system for dynamic queries
- Batch query execution across multiple platforms
- Database integration for query tracking

**Technical Details:**
- Template variable replacement ({{company}}, {{keyword}}, etc.)
- Parallel processing with Promise.all
- Cost and performance tracking
- Error handling and retry logic

### 2025-01-20 - AI Platform Integration
**Added:**
- AIPlatformManager with multi-platform support
- Rate limiting system to prevent quota exhaustion
- Cost tracking for API usage monitoring
- Error handling and retry mechanisms

**Platforms Integrated:**
- OpenAI (GPT models)
- Anthropic (Claude models)
- Perplexity (search-based AI)
- Google Gemini (Vertex AI)

### 2025-01-20 - Database Schema Deployment
**Added:**
- Complete 12-table database schema in Supabase
- Relationships and foreign key constraints
- Indexes for performance optimization
- Sample data for testing

**Tables Created:**
- Core business entities (companies, ai_platforms, users)
- Query processing (ai_queries, ai_responses, templates)
- Analytics data (brand_mentions, citations, keywords)
- Batch processing (batch_queries, query_results, competitors)

### 2025-01-20 - Project Foundation
**Added:**
- Next.js 15.4.2 project with TypeScript and Turbopack
- Shadcn/ui component system with Tailwind CSS
- Supabase client configuration with environment variables
- Basic routing structure and layout components
- Database connection testing functionality

**Initial Setup:**
- Package dependencies and build configuration
- CSS variables and styling system
- TypeScript configuration for strict type checking
- Environment variable management

---

## Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
# Use Supabase CLI or dashboard for schema management
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
PERPLEXITY_API_KEY=your_perplexity_key
GOOGLE_API_KEY=your_google_key
```

## Documentation Structure

### Claude Context Files (`.claude/` directory)
1. **CLAUDE.md** (this file) - Complete project documentation and changelog
2. **PRD_Answer_Engine_Optimization_Platform.md** - Original Product Requirements Document
3. **settings.local.json** - Claude configuration with Supabase MCP server enabled

### Key Features of Documentation System
- **Automatic Context Loading**: Claude reads these files at conversation start
- **Change Tracking**: Every modification is logged with technical details
- **Progress Monitoring**: Phase completion and next steps clearly defined
- **Reference Integration**: PRD requirements mapped to implementation status

## Next Steps

1. **Conversations View**: Detailed response analysis and conversation history
2. **Actions Page**: Recommendations and optimization suggestions
3. **Export Features**: Advanced reporting and data export capabilities
4. **User Authentication**: Secure access control and user management
5. **Real-time Updates**: WebSocket integration for live data
6. **Advanced Analytics**: Machine learning insights and predictions

---

### 2025-01-20 - Actions Page Implementation
**Added:**
- Comprehensive actions page at `/actions` with AI-powered recommendations
- ActionsService for generating intelligent insights and recommendations
- RecommendationCard component with interactive progress tracking
- ActionableInsights component with strategic analysis
- ContentSuggestions component with content gap analysis
- CompetitorActions component with competitive strategy recommendations
- Export functionality for action plans and recommendations

**Features Implemented:**
- AI-powered recommendation generation based on analytics data
- Interactive action cards with progress tracking and step completion
- Strategic insights with sentiment analysis and platform performance
- Content strategy recommendations with gap identification
- Competitive analysis with offensive and defensive strategies
- Priority-based filtering and categorization of recommendations
- Export capabilities for action plans and strategic documents

**Technical Details:**
- Advanced analytics-driven recommendation algorithms
- Interactive UI components with state management for progress tracking
- Company insights aggregation with sentiment and performance analysis
- Strategic framework implementation for competitive positioning
- Real-time data integration with Supabase for recommendation generation

### 2025-01-20 - Conversations View Implementation
**Added:**
- Comprehensive conversations page at `/conversations` with detailed response analysis
- ConversationFilters component with advanced filtering capabilities
- ConversationList component with sentiment indicators and quick stats
- ConversationDetail component with expandable sections and analysis
- Export functionality for conversation data
- Navigation integration in header component

**Features Implemented:**
- Real-time conversation loading with company/platform/sentiment filtering
- Detailed brand mention analysis with context and sentiment scores
- Citation tracking with source attribution and relevance scoring
- Search functionality across queries and responses
- Interactive conversation detail view with collapsible sections
- Performance metrics display (cost, response time, mention counts)
- Export capabilities for data analysis

**Technical Details:**
- Advanced TypeScript interfaces for conversation data structures
- Complex Supabase queries with nested relationships and filtering
- Responsive design with proper loading states and error handling
- Real-time data aggregation and filtering capabilities
- Copy-to-clipboard functionality for queries and responses

### 2025-01-20 - Documentation Structure Setup
**Added:**
- Moved PRD_Answer_Engine_Optimization_Platform.md to `.claude/` directory
- Updated CLAUDE.md to reference PRD location
- Added documentation structure section
- Established automatic context loading system for Claude

**Technical Details:**
- Claude now has access to both implementation status and original requirements
- Comprehensive change tracking system in place
- All project documentation centralized in `.claude/` directory

---

*Last Updated: 2025-01-20*
*Version: Phase 3 - Step 6 Completed*