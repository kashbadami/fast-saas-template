---
title: Google OAuth Setup
description: Step-by-step guide to configure Google authentication
category: Getting Started
order: 2
---

# Google OAuth Setup Guide

This guide will help you set up Google OAuth for your Fast SaaS Template application.

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Fast SaaS Template")
5. Click "Create"

### 2. Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: Your app name
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: email, profile, openid
   - Save and continue through all steps

### 4. Create OAuth Client ID
1. After consent screen setup, go back to create OAuth client ID
2. Application type: "Web application"
3. Name: "Fast SaaS Template" (or your app name)
4. Add Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:3001` (if using alternate port)
   - Your production domain (e.g., `https://yourdomain.com`)
5. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3001/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Click "Create"

### 5. Copy Credentials
After creating, you'll see:
- **Client ID**: Something like `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: A long string of characters

### 6. Update Your .env File
1. Copy `.env.example` to `.env` if you haven't already
2. Add your credentials:
```env
AUTH_GOOGLE_ID="your-client-id-here"
AUTH_GOOGLE_SECRET="your-client-secret-here"
```

### 7. Generate AUTH_SECRET
Run this command to generate a secure secret:
```bash
npx auth secret
```
Or on Unix systems:
```bash
openssl rand -base64 32
```

Add it to your `.env`:
```env
AUTH_SECRET="your-generated-secret-here"
```

### 8. Restart Your Development Server
After updating the `.env` file, restart your development server:
```bash
npm run dev
```

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Console exactly matches your app's URL
- Check if you're using the right port (3000 vs 3001)
- Ensure you include `/api/auth/callback/google` at the end

### "Access blocked" error
- Make sure you've completed the OAuth consent screen setup
- For development, you may need to add test users in the OAuth consent screen

### Google sign-in not working
- Check that both `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are set in `.env`
- Verify there are no extra spaces or quotes in the env values
- Check the browser console for any errors

## Production Deployment
When deploying to production:
1. Add your production domain to authorized origins and redirect URIs
2. Update your production environment variables with the same credentials
3. Ensure `AUTH_SECRET` is set in production (required for production)