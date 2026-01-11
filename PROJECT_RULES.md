# 📋 Project Rules & Guidelines

This document outlines the coding standards, architectural decisions, and conventions for the **IMK Portfolio** project.

---

## 🏗️ Architecture Rules

### 1. Project Structure

#### 📁 Directory Organization
- **Components**: Place reusable UI components in `src/components/`
  - Admin-specific components go in `src/components/admin/`
  - Base UI components (shadcn/ui) stay in `src/components/ui/`
  - Page-specific components can be co-located with pages or in `components/`

- **Pages**: All route components belong in `src/pages/`
  - Group related pages in subdirectories (e.g., `admin/`)
  - Each page should be a default export

- **Hooks**: Custom React hooks go in `src/hooks/`
  - Follow naming convention: `use` prefix (e.g., `useAuth.ts`)
  - One hook per file
  - Export hooks as named exports

- **Types**: TypeScript interfaces and types in `src/types/`
  - Group related types in the same file
  - Export as named exports

- **Utilities**: Helper functions in `src/lib/`
  - Keep utilities pure and testable
  - Use named exports

#### 🔌 External Integrations
- Supabase integration lives in `src/integrations/supabase/`
- Re-export from `src/lib/supabaseClient.ts` for easier imports
- **Never** expose service role keys in frontend code

### 2. Routing Architecture

#### 🛣️ Route Organization
```
Public Routes:
  / → Index (portfolio homepage)

Protected Admin Routes:
  /admin/login → Login page
  /admin → Dashboard (CRUD operations)
  /admin/new → Create new artwork
  /admin/edit/:id → Edit existing artwork

Fallback:
  * → 404 Not Found
```

#### 🔒 Route Protection
- Always wrap admin routes with `<ProtectedRoute>` component
- Protected routes automatically redirect to `/admin/login` if unauthenticated
- Use `useAuth()` hook to check authentication state

### 3. State Management

#### 📊 State Management Strategy
- **Server State**: Use TanStack Query (React Query) for all API calls
  - Artworks data fetching
  - CRUD operations
  - Automatic caching and refetching

- **Local UI State**: Use `useState` for:
  - Form inputs
  - Modal/dialog open/close states
  - UI interactions (hover, focus, etc.)

- **Auth State**: Use `useAuth()` custom hook
  - Never directly access Supabase auth
  - Always check `loading` state before rendering protected content

#### 🔄 Data Fetching Patterns
```typescript
// ✅ Good: Use React Query hooks
const { data, isLoading, error } = usePublishedArtworks();

// ❌ Bad: Direct Supabase calls in components
const [data, setData] = useState(null);
useEffect(() => {
  supabase.from('artworks').select().then(setData);
}, []);
```

### 4. Component Architecture

#### 🧩 Component Structure
```typescript
// 1. Imports (external → internal, grouped)
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Component definition
const Component = ({ prop1, prop2 }: ComponentProps) => {
  // 4. Hooks
  const { user } = useAuth();
  const [state, setState] = useState();
  
  // 5. Event handlers
  const handleClick = () => { /* ... */ };
  
  // 6. Render
  return (/* ... */);
};

// 7. Export
export default Component;
```

#### 🎯 Component Guidelines
- **Keep components small and focused** (single responsibility)
- **Prefer composition over inheritance**
- **Extract reusable logic into custom hooks**
- **Use TypeScript interfaces for all props**
- **Default export for pages, named export for reusable components**

### 5. Error Handling

#### ⚠️ Error Handling Patterns
- Use TanStack Query's `onError` callback for mutations
- Show user-friendly error messages with Sonner toast
- Always handle loading and error states in UI
- Never silently fail - log errors to console in development

```typescript
// ✅ Good: Proper error handling
const mutation = useMutation({
  mutationFn: async (data) => { /* ... */ },
  onSuccess: () => {
    toast.success("Operation successful");
  },
  onError: (error: Error) => {
    toast.error(`Operation failed: ${error.message}`);
  },
});
```

---

## 🎨 Styling Rules

### 1. Tailwind CSS Usage

#### 🎨 Primary Styling Approach
- **Always use Tailwind utility classes** for styling
- **Never write custom CSS** unless absolutely necessary
- Use `cn()` utility function from `@/lib/utils` for conditional classes

```typescript
// ✅ Good: Tailwind utilities with cn()
import { cn } from "@/lib/utils";

<div className={cn(
  "flex items-center gap-4",
  isActive && "bg-primary text-primary-foreground",
  className
)} />

// ❌ Bad: Inline styles or custom CSS classes
<div style={{ display: 'flex' }} />
<div className="custom-class" />
```

#### 🎨 Color System
- Use CSS variables defined in `index.css` for colors
- Follow the design system color tokens:
  - `bg-primary`, `text-primary-foreground`
  - `bg-secondary`, `text-secondary-foreground`
  - `bg-muted`, `text-muted-foreground`
  - `bg-destructive`, `text-destructive-foreground`
  - `bg-card`, `text-card-foreground`
  - `bg-background`, `text-foreground`

```typescript
// ✅ Good: Using design tokens
<button className="bg-primary text-primary-foreground hover:bg-primary/90" />

// ❌ Bad: Hardcoded colors
<button className="bg-[#ff6b6b] text-white" />
```

### 2. Responsive Design

#### 📱 Breakpoint Strategy
- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test on multiple screen sizes

```typescript
// ✅ Good: Mobile-first responsive design
<div className="
  flex flex-col gap-4
  md:flex-row md:gap-6
  lg:gap-8
">
```

### 3. Typography

#### ✍️ Font Usage
- **Serif font (Cormorant Garamond)**: Headings (h1-h6)
- **Sans-serif font (Inter)**: Body text, UI elements
- Apply via Tailwind classes or CSS variables

```typescript
// ✅ Good: Using font families
<h1 className="font-serif text-4xl">Title</h1>
<p className="font-sans text-base">Body text</p>
```

### 4. Spacing & Layout

#### 📐 Spacing Conventions
- Use Tailwind spacing scale (4px base unit)
- Consistent padding/margin: `p-4`, `m-6`, `gap-4`
- Use flexbox/grid utilities for layouts

```typescript
// ✅ Good: Consistent spacing
<div className="p-6 md:p-8">
  <div className="flex flex-col gap-4">
    {/* content */}
  </div>
</div>
```

### 5. Animation & Transitions

#### ✨ Animation Guidelines
- Use **Framer Motion** for complex animations
- Use **Tailwind transitions** for simple hover/focus states
- Keep animations subtle and purposeful
- Respect `prefers-reduced-motion` (future enhancement)

```typescript
// ✅ Good: Framer Motion for page animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

// ✅ Good: Tailwind for simple transitions
<button className="transition-colors hover:bg-primary/90" />
```

### 6. Dark Mode Support

#### 🌓 Theme System
- CSS variables are set up for dark mode
- Use `dark:` prefix for dark mode styles
- Currently not actively used, but infrastructure is ready

---

## 📝 Coding Conventions

### 1. Naming Conventions

#### 📛 File Naming
- **Components**: PascalCase (e.g., `ArtworkCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: camelCase (e.g., `artwork.ts`)
- **Constants**: UPPER_SNAKE_CASE (if exported, otherwise camelCase)

#### 🏷️ Variable Naming
- **Components**: PascalCase
- **Functions/Variables**: camelCase
- **Boolean variables**: Use `is`, `has`, `should` prefix (e.g., `isLoading`, `hasError`)
- **Event handlers**: `handle` prefix (e.g., `handleSubmit`, `handleClick`)
- **API functions**: Verb prefix (e.g., `fetchArtworks`, `createArtwork`)

```typescript
// ✅ Good naming
const isLoading = true;
const handleSubmit = () => {};
const fetchArtworks = async () => {};

// ❌ Bad naming
const loading = true;
const submit = () => {};
const artworks = async () => {};
```

### 2. TypeScript Conventions

#### 🔷 Type Definitions
- **Always define types/interfaces** for component props
- Use `interface` for object shapes, `type` for unions/intersections
- Export types from `src/types/` directory
- Use generic types where appropriate

```typescript
// ✅ Good: Explicit types
interface ArtworkCardProps {
  id: string;
  title: string;
  image: string;
  year?: string; // Optional with ?
}

// ❌ Bad: Any types
const Component = (props: any) => { };
```

#### 🔷 Type Safety Rules
- **Avoid `any` type** - use `unknown` if type is truly unknown
- Use type assertions sparingly (prefer type guards)
- Leverage TypeScript's type inference where possible

```typescript
// ✅ Good: Type inference
const artworks = useArtworks(); // TypeScript infers Artwork[]

// ✅ Good: Type guard
if (data && 'title' in data) {
  // TypeScript knows data has title
}

// ❌ Bad: Type assertion without reason
const data = response as Artwork;
```

### 3. Import Organization

#### 📦 Import Order
1. React and React-related imports
2. Third-party libraries
3. Internal utilities and hooks
4. Components (UI components, then custom components)
5. Types/interfaces
6. Styles (if needed)

```typescript
// ✅ Good: Organized imports
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Artwork } from "@/types/artwork";
```

#### 📦 Import Aliases
- Always use `@/` alias for `src/` directory
- Keep imports absolute when using aliases

```typescript
// ✅ Good: Using alias
import { Button } from "@/components/ui/button";

// ❌ Bad: Relative imports for src/
import { Button } from "../../components/ui/button";
```

### 4. Code Organization

#### 📑 Function Order (within components)
1. Component definition and props destructuring
2. Custom hooks
3. State declarations
4. Derived state/computed values
5. Event handlers
6. Effects (useEffect)
7. Early returns (loading, error states)
8. Main render logic

```typescript
const Component = ({ prop1, prop2 }: ComponentProps) => {
  // 1. Hooks
  const { data, isLoading } = useQuery();
  const [state, setState] = useState();
  
  // 2. Computed values
  const filtered = useMemo(() => { /* ... */ }, [deps]);
  
  // 3. Event handlers
  const handleClick = () => { /* ... */ };
  
  // 4. Effects
  useEffect(() => { /* ... */ }, [deps]);
  
  // 5. Early returns
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  // 6. Render
  return (/* ... */);
};
```

### 5. Component Export Patterns

#### 📤 Export Conventions
- **Default export** for page components
- **Named export** for reusable components
- One default export per file

```typescript
// ✅ Good: Default export for pages
export default Index;

// ✅ Good: Named export for reusable components
export { ArtworkCard };
export const ArtworkCard = () => { /* ... */ };
```

### 6. Commenting Guidelines

#### 💬 When to Comment
- **Complex business logic** - explain why, not what
- **Non-obvious solutions** - explain the reasoning
- **TODOs and FIXMEs** - use clear markers
- **API integrations** - document expected behavior

```typescript
// ✅ Good: Explains why
// Debounce delay of 3s prevents excessive commits during rapid file changes
const DEBOUNCE_DELAY = 3000;

// ✅ Good: Business logic explanation
// Only show published artworks to public users
// Admins can see all artworks regardless of published status
const displayArtworks = isAdmin ? allArtworks : publishedArtworks;

// ❌ Bad: States the obvious
// Set loading to true
setLoading(true);
```

### 7. Form Handling

#### 📝 Form Patterns
- Use **React Hook Form** for all forms
- Use **Zod** for schema validation
- Integrate with `@hookform/resolvers` for validation

```typescript
// ✅ Good: React Hook Form + Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.string().optional(),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### 8. API Integration

#### 🔌 Supabase Patterns
- **Always use custom hooks** (e.g., `useArtworks()`) instead of direct Supabase calls
- Handle loading and error states
- Use React Query for caching and automatic refetching
- Never expose service role keys

```typescript
// ✅ Good: Using custom hook with React Query
const { data, isLoading, error } = usePublishedArtworks();

// ❌ Bad: Direct Supabase call in component
useEffect(() => {
  supabase.from('artworks').select('*').then(/* ... */);
}, []);
```

### 9. Performance Best Practices

#### ⚡ Optimization Guidelines
- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references (when needed)
- Lazy load heavy components with `React.lazy()`
- Optimize images (use appropriate formats and sizes)

```typescript
// ✅ Good: Memoizing expensive computation
const filteredArtworks = useMemo(() => {
  return artworks.filter(/* expensive filter */);
}, [artworks, searchQuery]);

// ✅ Good: React.lazy for code splitting
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### 10. Git Commit Conventions

#### 📝 Commit Message Format
- Use descriptive commit messages
- Prefix with type: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`
- Auto-commit script handles commits during development

```bash
# Good commit messages
feat: add artwork search functionality
fix: resolve image upload issue
refactor: extract artwork logic to custom hook
style: update button hover states
```

---

## 🔐 Security Rules

### 1. Authentication & Authorization
- ✅ Always check authentication state before rendering protected content
- ✅ Use `ProtectedRoute` component for admin routes
- ✅ Never trust client-side authentication alone - RLS policies enforce security
- ❌ Never expose service role keys in frontend code

### 2. Data Validation
- ✅ Validate all user inputs with Zod schemas
- ✅ Sanitize file uploads (check file type, size)
- ✅ Use Supabase RLS policies for database-level security

### 3. Environment Variables
- ✅ Store sensitive data in `.env` file (gitignored)
- ✅ Use `VITE_` prefix for Vite environment variables
- ❌ Never commit `.env` files with real credentials

---

## 🧪 Testing Guidelines (Future)

### Test Structure
- Unit tests for utilities and hooks
- Integration tests for API interactions
- Component tests for UI components
- E2E tests for critical user flows

### Test Naming
```
ComponentName.test.tsx
hookName.test.ts
utility.test.ts
```

---

## 📚 Additional Resources

### Recommended Reading
- [React Best Practices](https://react.dev/learn)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Project-Specific Notes
- This project uses ESLint but with relaxed TypeScript rules
- Consider enabling strict mode for better type safety in future
- Dark mode infrastructure exists but is not currently active
- Auto-commit script runs in development mode

---

**Last Updated**: January 2025  
**Maintained By**: Development Team


