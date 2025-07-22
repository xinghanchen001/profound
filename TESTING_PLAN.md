# Profound Testing Plan

## Overview
This document outlines the testing plan for the Profound Answer Engine Optimization platform to ensure all features work correctly before committing changes.

## Important Note: Authentication Not Yet Implemented
Currently, the application does not have user authentication implemented. All pages are publicly accessible. Authentication testing will be added once the login system is implemented.

## Pre-Test Setup

### 1. Environment Variables
Ensure `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tguxdbxvlpkepcttahje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndXhkYnh2bHBrZXBjdHRhaGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjIwNjksImV4cCI6MjA2ODUzODA2OX0.U2cBOtJANKuOc088yYwi72hKmJGWPcv7lv2I1pG6zvw
```

### 2. Server Restart
After setting environment variables, restart the development server:
```bash
# Kill the current server (Ctrl+C)
# Start fresh
npm run dev
```

## Testing Checklist

### 1. Basic Application Health
- [ ] Navigate to http://localhost:3000
- [ ] Verify no console errors appear
- [ ] Check that the page loads without hydration warnings

### 2. Page Navigation Tests
Test each page for errors:
- [ ] Homepage (/)
- [ ] Dashboard (/dashboard)
- [ ] Conversations (/conversations)
- [ ] Brand Analysis (/brand-analysis)
- [ ] Actions (/actions)
- [ ] Reports (/reports)
- [ ] Test Query (/test-query)

### 3. Database Connection Tests
For each page with data:
- [ ] Verify data loads correctly
- [ ] Check for any Supabase connection errors
- [ ] Ensure error messages are user-friendly

### 4. Core Functionality Tests

#### Conversations Page
- [ ] Company dropdown loads companies
- [ ] Platform filter works
- [ ] Date range filter works
- [ ] Search functionality works
- [ ] Export function creates valid JSON

#### Brand Analysis Page
- [ ] Companies load in dropdown
- [ ] Sentiment breakdown chart displays
- [ ] Time range selector works
- [ ] Competitor comparison loads

#### Test Query Page
- [ ] Query form submits successfully
- [ ] Results display properly
- [ ] Error handling for invalid queries

### 5. TypeScript and Linting
Run before committing:
```bash
npm run typecheck
npm run lint
```

### 6. Build Test
Ensure production build works:
```bash
npm run build
```

## Future: Authentication Testing (Not Yet Implemented)

Once authentication is implemented, test the following:

### User Registration
- [ ] New user can register with email/password
- [ ] Validation works for email format
- [ ] Password requirements are enforced
- [ ] Confirmation email is sent (if implemented)

### User Login
- [ ] Valid credentials allow login
- [ ] Invalid credentials show error message
- [ ] "Remember me" functionality works
- [ ] Password reset link works
- [ ] Session persists across page refreshes

### Protected Routes
- [ ] Dashboard requires authentication
- [ ] Brand Analysis requires authentication
- [ ] Conversations requires authentication
- [ ] Unauthenticated users are redirected to login

### User Management
- [ ] Profile update works
- [ ] Password change works
- [ ] Logout functionality works
- [ ] Session expires appropriately

### Supabase Auth Setup Required
To implement authentication, you'll need to:
1. Enable Auth in Supabase Dashboard
2. Configure email templates
3. Set up redirect URLs
4. Implement auth components:
   - Login page
   - Register page
   - Auth context/provider
   - Protected route wrapper

## Common Issues and Solutions

### Issue: Supabase connection fails
**Solution:**
1. Check `.env.local` exists and has correct values
2. Restart the development server
3. Verify Supabase project is active

### Issue: Hydration errors
**Solution:**
1. Check for browser extensions interfering
2. Ensure `suppressHydrationWarning` is set on html tag
3. Look for client-only code in server components

### Issue: TypeScript errors
**Solution:**
1. Run `npm install` to ensure all dependencies are installed
2. Check for missing type definitions
3. Use proper type assertions where needed

## Automated Test Commands
Add these to package.json scripts:
```json
{
  "scripts": {
    "test:types": "tsc --noEmit",
    "test:lint": "eslint . --ext .ts,.tsx",
    "test:all": "npm run test:types && npm run test:lint && npm run build"
  }
}
```

## Pre-Commit Checklist
1. [ ] Run `npm run test:all`
2. [ ] Test all major pages manually
3. [ ] Check browser console for errors
4. [ ] Verify no sensitive data in commits
5. [ ] Update documentation if needed