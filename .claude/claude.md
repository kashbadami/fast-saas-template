# MVP Project Guidelines

## Architecture Rules
- Use tRPC for ALL API calls (no direct fetch)
- Prisma for ALL database operations
- shadcn/ui components ONLY
- Maximum 5 database tables per MVP
- No custom hooks until post-validation

## File Structure
- `/src/server/api/routers/` - All business logic
- `/src/components/ui/` - shadcn components only
- `/src/components/` - Feature components
- `/src/pages/` - Next.js pages (minimal logic)

## AI Integration Standards
- Vercel AI SDK for streaming
- One AI endpoint per feature maximum
- Use useChat/useCompletion hooks only

## Code Review Checklist
- [ ] Uses existing tRPC procedures?
- [ ] Follows T3 patterns?
- [ ] Has TypeScript types?
- [ ] Components under 100 lines?
- [ ] No direct database calls in components?

## Demo Integration Rules
When borrowing from Vercel demos:
1. Extract only the core logic
2. Adapt to tRPC pattern
3. Use our existing UI components
4. Document the source demo