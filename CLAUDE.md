# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: MVP Project Guidelines

### Architecture Rules
- Use tRPC for ALL API calls (no direct fetch)
- Prisma for ALL database operations
- shadcn/ui components ONLY
- Maximum 5 database tables per MVP
- No custom hooks until post-validation

### File Structure
- `/src/server/api/routers/` - All business logic
- `/src/components/ui/` - shadcn components only
- `/src/components/` - Feature components
- `/src/pages/` - Next.js pages (minimal logic)

### AI Integration Standards
- Vercel AI SDK for streaming
- One AI endpoint per feature maximum
- Use useChat/useCompletion hooks only

### Code Review Checklist
- [ ] Uses existing tRPC procedures?
- [ ] Follows T3 patterns?
- [ ] Has TypeScript types?
- [ ] Components under 100 lines?
- [ ] No direct database calls in components?

### Demo Integration Rules
When borrowing from Vercel demos:
1. Extract only the core logic
2. Adapt to tRPC pattern
3. Use our existing UI components
4. Document the source demo

## Project Overview

This is a T3 Stack application (Next.js + TypeScript + tRPC + Prisma) designed as a fast SaaS template. It uses the latest versions of React 19, Next.js 15, and implements end-to-end type safety.

## Essential Commands

### Development
```bash
npm run dev          # Start development server with Turbo
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint and fix issues
npm run format:check # Check code formatting
npm run format:write # Format code with Prettier
```

### Database Management
```bash
npm run db:push      # Push schema changes to database (dev)
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Create and apply migrations
npm run db:studio    # Open Prisma Studio GUI
./start-database.sh  # Start local PostgreSQL with Docker
```

### Testing
No test commands are currently configured. When adding tests, update this section.

## Architecture Overview

### API Layer (tRPC)
- **Location**: `src/server/api/`
- **Pattern**: Procedures are split into public and protected (authenticated) contexts
- **Router Definition**: `src/server/api/root.ts` combines all routers
- **Adding New Routes**: Create new router in `src/server/api/routers/`, then add to root router

### Authentication (NextAuth.js v5)
- **Config**: `src/server/auth/config.ts`
- **Provider**: Discord OAuth (configured in environment variables)
- **Session Strategy**: Database sessions via Prisma adapter
- **Protected Routes**: Use `protectedProcedure` in tRPC or check session in components

### Database (Prisma + PostgreSQL)
- **Schema**: `prisma/schema.prisma`
- **Client**: Singleton instance at `src/server/db.ts`
- **Models**: User, Account, Session, Post, VerificationToken

### Frontend Patterns
- **Routing**: Next.js App Router in `src/app/`
- **API Calls**: Use tRPC hooks from `src/trpc/react.tsx`
- **Components**: Page-specific components in `src/app/_components/`
- **Styling**: Tailwind CSS v4 with PostCSS

### Environment Variables
- **Validation**: Type-safe env vars in `src/env.js` using Zod
- **Required**: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`
- **Pattern**: Add new env vars to schema in `src/env.js` before use

## Key Development Patterns

### Adding a New API Endpoint
1. Create router file in `src/server/api/routers/`
2. Define procedures using `publicProcedure` or `protectedProcedure`
3. Add router to `src/server/api/root.ts`
4. Use in frontend via `api.<router>.<procedure>.useQuery()` or `.useMutation()`

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` for development or `npm run db:migrate` for production
3. Prisma client auto-generates types

### Type Safety
- Path aliases: `~/*` maps to `src/*`
- All API calls are fully type-safe through tRPC
- Environment variables are validated at runtime
- Database queries have generated types from Prisma