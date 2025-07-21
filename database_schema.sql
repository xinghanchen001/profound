-- Answer Engine Optimization Platform Database Schema
-- This schema supports the core functionality of tracking AI responses, citations, and brand analysis

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Categories table (e.g., healthcare, technology, finance)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies/Brands table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    industry VARCHAR(255),
    founded_year INTEGER,
    headquarters VARCHAR(255),
    employee_count INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(slug, category_id)
);

-- AI Platforms table (OpenAI, Perplexity, Claude, etc.)
CREATE TABLE ai_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    api_endpoint TEXT,
    is_active BOOLEAN DEFAULT true,
    rate_limit INTEGER DEFAULT 60,
    cost_per_query DECIMAL(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Query templates for different types of analysis
CREATE TABLE query_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    template TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'brand_analysis', 'competitor_comparison', 'market_research'
    variables JSONB, -- Template variables like {company_name}, {industry}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Queries sent to platforms
CREATE TABLE ai_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    ai_platform_id UUID REFERENCES ai_platforms(id) ON DELETE CASCADE,
    template_id UUID REFERENCES query_templates(id) ON DELETE SET NULL,
    query_text TEXT NOT NULL,
    query_type VARCHAR(100), -- 'brand_mention', 'competitor_analysis', 'market_research'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'completed', 'failed'
    sent_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    cost DECIMAL(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Responses from platforms
CREATE TABLE ai_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_id UUID REFERENCES ai_queries(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    response_metadata JSONB, -- Additional data like model used, tokens, etc.
    processing_time_ms INTEGER,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citations extracted from AI responses
CREATE TABLE citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    response_id UUID REFERENCES ai_responses(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    domain VARCHAR(255),
    author VARCHAR(255),
    published_date DATE,
    excerpt TEXT,
    relevance_score DECIMAL(3,2), -- 0.00 to 1.00
    citation_type VARCHAR(100), -- 'primary_source', 'news_article', 'research_paper', 'review', 'social_media'
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keywords and brand mentions tracking
CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    keyword_type VARCHAR(100), -- 'brand_name', 'product', 'competitor', 'industry_term'
    search_volume INTEGER,
    difficulty_score INTEGER, -- 1-100
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, keyword)
);

-- Brand mentions found in AI responses
CREATE TABLE brand_mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    response_id UUID REFERENCES ai_responses(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    mention_text TEXT NOT NULL,
    context_before TEXT,
    context_after TEXT,
    sentiment VARCHAR(50), -- 'positive', 'negative', 'neutral'
    sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
    position_in_response INTEGER, -- Position of mention in the response
    is_primary_mention BOOLEAN DEFAULT false, -- If this is the main mention
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics and analytics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    ai_platform_id UUID REFERENCES ai_platforms(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    total_mentions INTEGER DEFAULT 0,
    positive_mentions INTEGER DEFAULT 0,
    negative_mentions INTEGER DEFAULT 0,
    neutral_mentions INTEGER DEFAULT 0,
    avg_sentiment_score DECIMAL(3,2),
    avg_position DECIMAL(5,2), -- Average position in responses
    total_citations INTEGER DEFAULT 0,
    unique_sources INTEGER DEFAULT 0,
    visibility_score DECIMAL(5,2), -- Custom score 0-100
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, ai_platform_id, metric_date)
);

-- User accounts and authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user', -- 'admin', 'user', 'viewer'
    subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'enterprise'
    credits_remaining INTEGER DEFAULT 100,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User company access permissions
CREATE TABLE user_company_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    access_level VARCHAR(50) DEFAULT 'read', -- 'read', 'write', 'admin'
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, company_id)
);

-- Indexes for better performance
CREATE INDEX idx_companies_category ON companies(category_id);
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_ai_queries_company ON ai_queries(company_id);
CREATE INDEX idx_ai_queries_platform ON ai_queries(ai_platform_id);
CREATE INDEX idx_ai_queries_status ON ai_queries(status);
CREATE INDEX idx_ai_responses_query ON ai_responses(query_id);
CREATE INDEX idx_citations_response ON citations(response_id);
CREATE INDEX idx_citations_domain ON citations(domain);
CREATE INDEX idx_keywords_company ON keywords(company_id);
CREATE INDEX idx_brand_mentions_response ON brand_mentions(response_id);
CREATE INDEX idx_brand_mentions_company ON brand_mentions(company_id);
CREATE INDEX idx_performance_metrics_company_date ON performance_metrics(company_id, metric_date);
CREATE INDEX idx_user_company_access_user ON user_company_access(user_id);

-- Full-text search indexes
CREATE INDEX idx_companies_name_search ON companies USING gin(name gin_trgm_ops);
CREATE INDEX idx_citations_title_search ON citations USING gin(title gin_trgm_ops);
CREATE INDEX idx_ai_responses_text_search ON ai_responses USING gin(response_text gin_trgm_ops);

-- Insert default data
INSERT INTO categories (name, slug, description) VALUES
('Healthcare', 'healthcare', 'Medical devices, pharmaceuticals, and health services'),
('Technology', 'technology', 'Software, hardware, and tech services'),
('Finance', 'finance', 'Banking, fintech, and financial services'),
('Retail', 'retail', 'E-commerce, consumer goods, and retail services'),
('Automotive', 'automotive', 'Car manufacturers and automotive technology');

INSERT INTO ai_platforms (name, slug, api_endpoint, cost_per_query) VALUES
('OpenAI GPT-4', 'openai-gpt4', 'https://api.openai.com/v1/chat/completions', 0.03),
('Perplexity', 'perplexity', 'https://api.perplexity.ai/chat/completions', 0.02),
('Claude', 'claude', 'https://api.anthropic.com/v1/messages', 0.025),
('Google Gemini', 'gemini', 'https://generativelanguage.googleapis.com/v1beta/models', 0.015);

INSERT INTO query_templates (name, template, description, category, variables) VALUES
(
    'Brand Mention Analysis',
    'What do you know about {company_name}? Please provide information about their products, services, reputation, and recent news. Include specific sources and citations.',
    'General brand analysis to understand AI perception',
    'brand_analysis',
    '{"company_name": "string"}'
),
(
    'Competitor Comparison',
    'Compare {company_name} with their main competitors in the {industry} industry. Focus on market position, strengths, weaknesses, and customer perception.',
    'Competitive analysis and positioning',
    'competitor_analysis',
    '{"company_name": "string", "industry": "string"}'
),
(
    'Product Recommendation',
    'What are the best {product_type} products available? Please rank them and explain your reasoning with sources.',
    'Product recommendation analysis',
    'market_research',
    '{"product_type": "string"}'
);

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers to all tables with updated_at columns
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_platforms_updated_at BEFORE UPDATE ON ai_platforms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_query_templates_updated_at BEFORE UPDATE ON query_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_queries_updated_at BEFORE UPDATE ON ai_queries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_responses_updated_at BEFORE UPDATE ON ai_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_citations_updated_at BEFORE UPDATE ON citations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_keywords_updated_at BEFORE UPDATE ON keywords FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_mentions_updated_at BEFORE UPDATE ON brand_mentions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_metrics_updated_at BEFORE UPDATE ON performance_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();