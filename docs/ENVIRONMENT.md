# Environment Variables

Configuration and environment variables for Watchdog.

## Overview

Watchdog uses environment variables for API configuration and backend URLs. All environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Required Variables

### VITE_CONVEX_URL

**Description:** Convex backend deployment URL

**Required:** Yes

**Value:** Your Convex deployment URL

**Example:**
```
VITE_CONVEX_URL=https://your-project.convex.cloud
```

**How to get:**
1. Run `npx convex dev` to start local Convex server
2. Or deploy to Convex and get URL from dashboard

### VITE_NEWSDATA_API_KEY

**Description:** API key for NewsData.io

**Required:** No (app works with mock data if not provided)

**Value:** Your NewsData.io API key

**Example:**
```
VITE_NEWSDATA_API_KEY=pub_1234567890abcdef
```

**How to get:**
1. Sign up at [newsdata.io](https://newsdata.io)
2. Get your API key from the dashboard

**Note:** Without this key, the app uses mock news data for development.

---

## Optional Variables

Currently, all required configuration is covered by the variables above.

---

## Setup Instructions

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Configure Variables

Edit `.env.local` and fill in your values:

```bash
# Convex (required)
VITE_CONVEX_URL=http://localhost:3000

# NewsData.io (optional - mock data used if not provided)
VITE_NEWSDATA_API_KEY=your_api_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

---

## Environment-Specific Configuration

### Development

```bash
# .env.local (not committed to git)
VITE_CONVEX_URL=http://localhost:3000
VITE_NEWSDATA_API_KEY=your_dev_key
```

### Production

```bash
# Vercel/Netlify dashboard or CI environment
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_NEWSDATA_API_KEY=your_production_key
```

---

## Using Environment Variables

### In TypeScript/JavaScript

```typescript
// Access environment variable
const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;
const convexUrl = import.meta.env.VITE_CONVEX_URL;

// Use in code
if (!apiKey) {
  console.warn('No API key configured, using mock data');
}
```

### TypeScript Support

```typescript
// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
  readonly VITE_NEWSDATA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## Security Best Practices

1. **Never commit secrets**: Add `.env.local` to `.gitignore`
2. **Use separate keys**: Different API keys for dev/prod
3. **Rotate keys**: Regularly update API keys
4. **Validate on load**: Check required vars exist at startup

---

## Troubleshooting

### "No API key found" Warning

If you see this in the console, add `VITE_NEWSDATA_API_KEY` to your `.env.local` file.

### Convex Connection Error

Ensure `VITE_CONVEX_URL` is set correctly and Convex is running.

### Build Fails

Ensure all required environment variables are set in your production deployment.
