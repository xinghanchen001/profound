# Deployment Guide for Profound

This guide covers deploying the Profound Answer Engine Optimization platform to various hosting providers.

## Prerequisites

1. **Supabase Project**: Create a Supabase project at [supabase.com](https://supabase.com)
2. **AI API Keys**: Obtain API keys from OpenAI and Anthropic
3. **GitHub Repository**: Your code should be pushed to GitHub

## Option 1: Vercel (Recommended)

Vercel is the optimal choice for Next.js applications.

### Steps:

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Import Project" and select your repository

2. **Configure Environment Variables**
   Add these in Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-app.vercel.app`

### Custom Domain (Optional)
- Add your domain in Vercel dashboard → Settings → Domains
- Update DNS records as instructed

## Option 2: Railway

Railway offers simple deployment with built-in PostgreSQL.

### Steps:

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your repository

2. **Add Environment Variables**
   Same as Vercel configuration above

3. **Deploy**
   Railway will automatically deploy your application

## Option 3: Render

### Steps:

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Choose "Web Service"

2. **Configuration**
   ```
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Environment Variables**
   Add the same variables as listed above

## Database Setup

### Supabase Migration

1. **Run Migration**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Run migration
   supabase db push
   ```

2. **Manual Setup**
   - Copy contents of `database_schema.sql`
   - Paste in Supabase SQL Editor
   - Execute the script

### Row Level Security (RLS)

Enable RLS policies in Supabase dashboard for security:
- Go to Authentication → Policies
- Enable RLS for all tables
- Create appropriate policies based on your needs

## Domain Configuration

### Custom Domain Setup

1. **DNS Configuration**
   Add these records to your domain:
   ```
   Type: CNAME
   Name: www
   Value: your-app.vercel.app (or hosting provider domain)
   
   Type: A
   Name: @
   Value: [hosting provider IP]
   ```

2. **SSL Certificate**
   Most hosting providers (Vercel, Railway, Render) provide automatic SSL

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | Yes |
| `NODE_ENV` | Environment (production) | Auto-set |

## Post-Deployment Checklist

- [ ] Database migration completed
- [ ] All environment variables set
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Test all major features
- [ ] Monitor application logs
- [ ] Set up error tracking (optional)
- [ ] Configure analytics (optional)

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check all environment variables are set
   - Verify database connection
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check if RLS policies are blocking access
   - Ensure migration was successful

3. **API Rate Limits**
   - Monitor OpenAI/Anthropic usage
   - Implement rate limiting if needed

### Getting Help

- Check hosting provider documentation
- Review application logs
- Open issue on GitHub repository

## Monitoring and Maintenance

### Recommended Tools

- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics or Google Analytics
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Lighthouse CI

### Regular Maintenance

- Monitor API usage and costs
- Update dependencies monthly
- Backup database regularly
- Review and rotate API keys quarterly 