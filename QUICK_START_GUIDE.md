# Quick Start Guide - Profound Platform

## 🚀 Getting Started

### Step 1: Fix the Dashboard Error
The dashboard error is now **FIXED**! Refresh your browser and the error should be gone.

### Step 2: Set Up Your First Company
1. **Visit the Setup Page**: http://localhost:3001/setup
2. **Add a Company**: Click "Add Company" and fill in:
   - Company Name (e.g., "OpenAI", "Google", "Microsoft")
   - Website URL (optional)
   - Industry (optional)
   - Description (optional)

### Step 3: Access the Dashboard
1. **Visit Dashboard**: http://localhost:3001/dashboard
2. The dashboard will now show your company data (initially empty until you run queries)

### Step 4: Test Queries (Optional)
1. **Visit Test Query Page**: http://localhost:3001/test-query
2. Run test queries to see how the platform analyzes brand mentions

## 📋 Current Status

### ✅ What's Working Now:
- **Homepage**: Clean landing page with navigation
- **Setup Page**: Add/manage companies ✨ **NEW**
- **Dashboard**: View metrics (fixed supabase error)
- **Brand Analysis**: Analyze brand performance
- **Conversations**: View AI conversations
- **Test Query**: Test AI platform responses
- **Database Connection**: Proper Supabase integration

### ⚠️ What's Missing:
- **User Authentication**: No login system yet (all pages publicly accessible)
- **Sample Data**: Database is empty initially
- **AI Platform Keys**: Need API keys for OpenAI, Anthropic, etc.

## 🗂️ Navigation Structure

```
📁 Profound Platform
├── 🏠 Home (localhost:3001)
├── ⚙️  Setup (localhost:3001/setup) ← **START HERE**
├── 📊 Dashboard (localhost:3001/dashboard)
├── 🔍 Brand Analysis (localhost:3001/brand-analysis)
├── 💬 Conversations (localhost:3001/conversations)
└── 🧪 Test Query (localhost:3001/test-query)
```

## 🎯 Recommended Workflow

1. **Setup** → Add your companies
2. **Test Query** → Run some test queries
3. **Dashboard** → View aggregated metrics
4. **Brand Analysis** → Deep dive into sentiment
5. **Conversations** → Review individual responses

## 🛠️ For Development

### Add Sample Data
You can manually add sample companies through the Setup page, or if you want to add sample data programmatically, use the Supabase dashboard.

### Add AI Platform Keys
To enable actual AI queries, add these to your `.env.local`:
```env
OPENAI_API_KEY=your_openai_key
PERPLEXITY_API_KEY=your_perplexity_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Test Database Connection
Visit http://localhost:3001/test-db to verify your Supabase connection.

---

**Next Step**: Visit http://localhost:3001/setup to add your first company! 🎉