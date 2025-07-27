---
title: Getting Started
description: Quick start guide for the Fast SaaS Template
category: Getting Started
order: 1
---

# Getting Started with Fast SaaS Template

Welcome to the Fast SaaS Template! This guide will help you get up and running quickly.

## Overview

The Fast SaaS Template is a production-ready Next.js starter kit that includes:

- **Authentication**: Email/password and OAuth with NextAuth.js v5
- **Database**: PostgreSQL with Prisma ORM
- **API**: Type-safe APIs with tRPC
- **Email**: Transactional emails with AWS SES
- **File Storage**: Pluggable storage with S3 support
- **UI Components**: Beautiful components with shadcn/ui
- **Content Management**: Easy content configuration system
- **Type Safety**: End-to-end TypeScript

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git installed
- A code editor (VS Code recommended)

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/fast-saas-template.git
cd fast-saas-template

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your configuration:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
AUTH_SECRET="your-auth-secret" # Generate with: npx auth secret

# Optional: OAuth providers
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 3. Set Up Database

```bash
# Start local PostgreSQL (if using Docker)
./start-database.sh

# Push database schema
npm run db:push

# (Optional) Open Prisma Studio to view your database
npm run db:studio
```

### 4. Start Development

```bash
npm run dev
```

Your app is now running at [http://localhost:3000](http://localhost:3000)!

## Project Structure

```
fast-saas-template/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── server/          # Server-side code
│   │   ├── api/         # tRPC API routes
│   │   ├── auth/        # Authentication config
│   │   ├── db.ts        # Database client
│   │   ├── email/       # Email providers
│   │   └── storage/     # File storage providers
│   ├── config/          # Content & branding config
│   ├── lib/             # Utility functions
│   └── styles/          # Global styles
├── prisma/              # Database schema
├── public/              # Static assets
└── docs/                # Documentation
```

## Next Steps

1. **Authentication**: Set up [Google OAuth](./GOOGLE_AUTH_SETUP) for social login
2. **Email**: Configure [email sending](./EMAIL_SETUP) for production
3. **Storage**: Set up [file storage](./file-storage) for uploads
4. **Content**: Customize your [content and branding](./CONTENT_CONFIGURATION)

## Key Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run linter
npm run format:write # Format code
```

## Deployment

The template is optimized for deployment on:

- **Vercel** (recommended) - Zero config deployment
- **Railway** - Great for PostgreSQL + Next.js
- **AWS** - Using Amplify or EC2
- **Any Node.js host** - With PostgreSQL database

See our [deployment guide](#) for detailed instructions.

## Getting Help

- Check the [documentation](/docs)
- Open an [issue on GitHub](https://github.com/yourusername/fast-saas-template/issues)
- Join our [Discord community](#)

Happy building! 🚀