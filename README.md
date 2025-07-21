# Profound - Answer Engine Optimization Platform

Profound is a comprehensive platform designed to help brands understand and optimize their presence across AI-powered search engines and chatbots. As AI becomes the primary interface for information discovery, brands need specialized tools to track, analyze, and improve their visibility in AI responses.

## 🌟 Features

- **AI Response Tracking**: Monitor how AI platforms mention your brand
- **Brand Analysis**: Comprehensive sentiment and mention analysis
- **Conversation Management**: Track and analyze AI conversations about your brand
- **Competitor Insights**: Compare your brand presence against competitors
- **Citation Tracking**: Monitor which sources AI platforms cite about your brand
- **Analytics Dashboard**: Detailed insights and reporting
- **Multi-Platform Support**: Works with OpenAI, Anthropic, Perplexity, and more

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd profound
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migration: `supabase/migrations/20250720001755_initial_schema.sql`
   - Update your environment variables

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Technology Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI, Anthropic APIs
- **UI Components**: Radix UI, Lucide React
- **Charts**: Recharts
- **Styling**: TailwindCSS with custom design system

## 📊 Database Schema

The platform includes comprehensive database schema supporting:
- Brand and company management
- AI platform integration
- Query and response tracking
- Citation and source analysis
- Sentiment analysis
- Competitor comparison

## 🔧 Environment Variables

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `OPENAI_API_KEY`: OpenAI API key for AI analysis
- `ANTHROPIC_API_KEY`: Anthropic API key

## 🚢 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform supporting Node.js:
- Railway
- Render
- AWS
- Google Cloud Platform

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── analytics/       # Analytics dashboard
│   ├── brand-analysis/  # Brand analysis tools
│   ├── conversations/   # Conversation management
│   ├── dashboard/       # Main dashboard
│   └── reports/         # Reporting features
├── components/          # Reusable UI components
│   ├── actions/         # Action-based components
│   ├── charts/          # Data visualization
│   ├── conversations/   # Conversation components
│   └── ui/              # Base UI components
└── lib/                 # Utilities and API clients
    ├── api/             # API integrations
    └── types/           # TypeScript definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
