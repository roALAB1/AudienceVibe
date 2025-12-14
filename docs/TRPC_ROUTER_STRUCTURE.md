# tRPC Router Structure

**Date:** December 13, 2025  
**Status:** ✅ VALIDATED - DO NOT ASSUME DIFFERENT STRUCTURE

---

## ⚠️ CRITICAL: There are TWO AudienceLab routers!

The application has **two separate tRPC routers** for AudienceLab functionality:

### 1. `audienceLab` Router (Enrichment Only)
**File:** `server/audienceLabRouter.ts`  
**Purpose:** Contact enrichment via AudienceLab API  
**Available Procedures:**
- `enrichContacts` - Enrich contacts with additional data

**Usage in Client:**
```typescript
import { trpc } from '@/lib/trpc';

// ✅ CORRECT
const mutation = trpc.audienceLab.enrichContacts.useMutation({...});

// ❌ WRONG - audiences is NOT available here
const query = trpc.audienceLab.audiences.list.useQuery({...});
```

---

### 2. `audienceLabAPI` Router (Audiences, Pixels, Segments)
**File:** `server/routers/audiencelab.ts`  
**Purpose:** Full AudienceLab API integration (audiences, pixels, segments)  
**Available Procedures:**

#### Audiences
- `audiences.list` - Get all audiences (with pagination)
- `audiences.get` - Get single audience by ID
- `audiences.create` - Create new audience
- `audiences.delete` - Delete audience

#### Pixels
- `pixels.list` - Get all pixels
- `pixels.get` - Get single pixel by ID
- `pixels.create` - Create new pixel
- `pixels.delete` - Delete pixel

#### Segments
- `segments.getData` - Get segment data

**Usage in Client:**
```typescript
import { trpc } from '@/lib/trpc';

// ✅ CORRECT
const query = trpc.audienceLabAPI.audiences.list.useQuery({...});
const mutation = trpc.audienceLabAPI.audiences.create.useMutation({...});

// ❌ WRONG - enrichContacts is NOT available here
const mutation = trpc.audienceLabAPI.enrichContacts.useMutation({...});
```

---

## Complete Router Registration

**File:** `server/routers.ts`

```typescript
export const appRouter = router({
  system: systemRouter,
  audienceLab: audienceLabRouter,        // ← Enrichment only
  audienceLabAPI: audienceLabAPIRouter,  // ← Audiences, Pixels, Segments
  auth: router({...}),
});
```

---

## Quick Reference Table

| Feature | Router Name | Procedure Path |
|---------|-------------|----------------|
| **Enrich Contacts** | `audienceLab` | `trpc.audienceLab.enrichContacts` |
| **List Audiences** | `audienceLabAPI` | `trpc.audienceLabAPI.audiences.list` |
| **Create Audience** | `audienceLabAPI` | `trpc.audienceLabAPI.audiences.create` |
| **Delete Audience** | `audienceLabAPI` | `trpc.audienceLabAPI.audiences.delete` |
| **List Pixels** | `audienceLabAPI` | `trpc.audienceLabAPI.pixels.list` |
| **Create Pixel** | `audienceLabAPI` | `trpc.audienceLabAPI.pixels.create` |
| **Get Segment Data** | `audienceLabAPI` | `trpc.audienceLabAPI.segments.getData` |

---

## Common Mistakes to Avoid

### ❌ WRONG: Using audienceLab for audiences
```typescript
// This will fail - audiences is not in audienceLab router
const query = trpc.audienceLab.audiences.list.useQuery({...});
```

### ✅ CORRECT: Using audienceLabAPI for audiences
```typescript
const query = trpc.audienceLabAPI.audiences.list.useQuery({...});
```

### ❌ WRONG: Using audienceLabAPI for enrichment
```typescript
// This will fail - enrichContacts is not in audienceLabAPI router
const mutation = trpc.audienceLabAPI.enrichContacts.useMutation({...});
```

### ✅ CORRECT: Using audienceLab for enrichment
```typescript
const mutation = trpc.audienceLab.enrichContacts.useMutation({...});
```

---

## Why Two Routers?

1. **`audienceLab`** - Original enrichment router for the Spark V2 feature
2. **`audienceLabAPI`** - New comprehensive API router for full AudienceLab integration

They serve different purposes and should NOT be confused!

---

## Always Check This Document First!

Before writing any tRPC client code:
1. ✅ Check this document for the correct router name
2. ✅ Use the exact procedure path shown in the table
3. ❌ Don't assume router structure
4. ❌ Don't guess procedure names

**This is the single source of truth for tRPC router structure.**
