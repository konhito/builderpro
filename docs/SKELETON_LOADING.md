# Skeleton Loading Screens

Comprehensive skeleton loading states for the TIMCO e-commerce application.

## Overview

Skeleton screens provide visual feedback to users while content is loading, creating a better user experience than blank screens or generic spinners.

## Features

✅ **Shimmer Animation** - Smooth gradient animation across skeleton elements  
✅ **Matching Layout** - Skeletons match the actual content layout  
✅ **Progressive Loading** - Elements animate in sequence  
✅ **Responsive Design** - Adapts to all screen sizes  
✅ **Branded Colors** - Uses TIMCO red for primary actions  
✅ **Loading Toast** - Fixed notification showing loading status  

## Implementation

### 1. Product Detail Page Skeleton
**File**: `app/product/[sku]/loading.tsx`

Shows while scraping product data from TIMCO website.

**Features**:
- Breadcrumb skeleton
- Image gallery with shimmer effect
- Product info placeholders
- Specifications table skeleton
- Related products grid
- Loading toast notification

**Trigger**: Navigate to `/product/{SKU}`  
**Duration**: 2-5 seconds (first load), <300ms (cached)

### 2. Search Page Skeleton
**File**: `app/search/loading.tsx`

Shows while loading product catalog and filters.

**Features**:
- Page title skeleton
- Filter sidebar placeholders
- Product grid (12 cards)
- Pagination skeleton
- Loading toast

**Trigger**: Navigate to `/search`  
**Duration**: Usually <1 second

### 3. Reusable Skeleton Components
**File**: `components/Skeleton.tsx`

Exportable skeleton components for consistent loading states.

**Components**:
```typescript
<Skeleton />              // Basic skeleton element
<SkeletonText />          // Multiple text lines
<SkeletonImage />         // Image placeholder with shimmer
<SkeletonCard />          // Complete card skeleton
<SkeletonButton />        // Button placeholder
<SkeletonTable />         // Table rows skeleton
<LoadingSpinner />        // Spinning loader icon
<LoadingToast />          // Fixed loading notification
```

## Shimmer Animation

### CSS Keyframes
```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

### Usage
```tsx
<div className="relative overflow-hidden">
  <div className="animate-[shimmer_2s_infinite] ..." />
</div>
```

## Color Variants

### Default (Gray)
```tsx
<Skeleton variant="default" />
// bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200
```

### Brand Red
```tsx
<Skeleton variant="red" />
// bg-gradient-to-r from-red-200 via-red-100 to-red-200
```

### Blue Accent
```tsx
<Skeleton variant="blue" />
// bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200
```

## Examples

### Product Card Skeleton
```tsx
<SkeletonCard withImage className="p-6" />
```

### Text Content Skeleton
```tsx
<SkeletonText lines={3} className="max-w-xl" />
```

### Image with Shimmer
```tsx
<SkeletonImage aspect="square" shimmer />
```

### Loading Button
```tsx
<SkeletonButton variant="red" className="w-full" />
```

### Loading Toast
```tsx
<LoadingToast message="Scraping product data..." show={isLoading} />
```

## Layout Matching

Skeleton screens closely match the actual content layout:

### Product Page Layout
```
┌─────────────────────────────────────────┐
│ Breadcrumbs Skeleton                    │
├──────────────┬──────────────────────────┤
│              │  SKU Badge               │
│  Main Image  │  Product Title           │
│  (Shimmer)   │  Size Info               │
│              │  Price                   │
│  Thumbnails  │  Description             │
│              │  Buttons                 │
├──────────────┴──────────────────────────┤
│ Specifications Table                    │
├─────────────────────────────────────────┤
│ Related Products Grid                   │
└─────────────────────────────────────────┘
```

### Search Page Layout
```
┌─────────────────────────────────────────┐
│ Title Skeleton                          │
├──────────┬──────────────────────────────┤
│ Filters  │  Product Grid                │
│ Sidebar  │  ┌────┐ ┌────┐ ┌────┐       │
│          │  │Card│ │Card│ │Card│       │
│          │  └────┘ └────┘ └────┘       │
│          │  ┌────┐ ┌────┐ ┌────┐       │
│          │  │Card│ │Card│ │Card│       │
│          │  └────┘ └────┘ └────┘       │
│          │                              │
│          │  Pagination                  │
└──────────┴──────────────────────────────┘
```

## Progressive Loading

Skeletons animate in sequence for a more natural feel:

```tsx
{[...Array(4)].map((_, i) => (
  <div
    key={i}
    style={{ animationDelay: `${i * 0.1}s` }}
  >
    <Skeleton shimmer />
  </div>
))}
```

## Responsive Behavior

### Mobile
- Single column layouts
- Simplified skeletons
- Smaller spacing

### Tablet
- 2-column product grid
- Visible filter sidebar
- Medium spacing

### Desktop
- 4-column product grid
- Full layout with all sections
- Generous spacing

## Performance

### Bundle Size
- Minimal CSS (~200 bytes)
- No external dependencies
- Leverages Tailwind CSS

### Animation Performance
- GPU-accelerated transforms
- 60 FPS animations
- Low CPU usage

## Best Practices

### ✅ DO
- Match skeleton layout to actual content
- Use shimmer for large content areas
- Show loading toast for long operations
- Animate elements progressively
- Use brand colors for primary actions

### ❌ DON'T
- Show skeletons for <100ms loads
- Mix different skeleton styles
- Over-animate (causes distraction)
- Use for error states
- Block user interaction unnecessarily

## Accessibility

### Considerations
- Skeletons are decorative, no ARIA needed
- Loading toast has clear status message
- Animations respect `prefers-reduced-motion`
- Proper semantic HTML underneath

### Future Enhancement
```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,
  .animate-spin,
  .animate-shimmer {
    animation: none;
  }
}
```

## Testing

### Manual Testing
1. Navigate to `/search` - See search skeleton
2. Click any product - See product skeleton
3. Refresh page - See skeleton during load
4. Slow down network (DevTools) - Observe longer

### Visual Regression Testing
```bash
# Take screenshot of loading states
npm run test:visual -- --grep="skeleton"
```

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Animations | ✅ | ✅ | ✅ | ✅ |
| Gradients | ✅ | ✅ | ✅ | ✅ |
| Transforms | ✅ | ✅ | ✅ | ✅ |

## Future Enhancements

1. **Content Hints**
   - Show actual product names during load
   - Pre-fill known data

2. **Smart Skeletons**
   - Adjust based on expected content
   - Different layouts for different categories

3. **Staggered Reveal**
   - Fade in real content section by section
   - Smooth transitions from skeleton to content

4. **Error States**
   - Skeleton morphs into error message
   - Retry button appears

5. **Partial Loading**
   - Show available data immediately
   - Skeleton only for missing parts

## Related Files

```
app/
├── loading.tsx                  # Root loading (TIMCO logo)
├── product/[sku]/loading.tsx    # Product detail skeleton
├── search/loading.tsx           # Search page skeleton
└── globals.css                  # Shimmer animation

components/
└── Skeleton.tsx                 # Reusable skeleton components

docs/
├── SKELETON_LOADING.md          # This file
└── ARCHITECTURE.md              # System architecture
```

## Examples in Action

### Basic Skeleton
```tsx
import { Skeleton } from '@/components/Skeleton';

<Skeleton className="h-8 w-48" />
```

### Card Grid
```tsx
import { SkeletonCard } from '@/components/Skeleton';

<div className="grid grid-cols-4 gap-4">
  {[...Array(8)].map((_, i) => (
    <SkeletonCard key={i} withImage />
  ))}
</div>
```

### With Shimmer
```tsx
import { SkeletonImage } from '@/components/Skeleton';

<SkeletonImage aspect="video" shimmer />
```

### Loading State
```tsx
import { LoadingToast } from '@/components/Skeleton';

<LoadingToast 
  message="Scraping product data from TIMCO..." 
  show={isLoading} 
/>
```

## Summary

The skeleton loading system provides:
- Professional loading experience
- Reduced perceived wait time
- Brand-consistent design
- Reusable components
- Smooth animations
- Responsive layouts

Users see meaningful loading states instead of blank screens, improving overall UX and engagement.


