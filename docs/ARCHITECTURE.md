# On-Demand Scraping Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Search Page (/search)                            │
│  • Displays 8,000+ products from products.json                      │
│  • User clicks on a product card                                    │
│  • Navigates to /product/{SKU}                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              Product Detail Page (/product/[sku])                   │
│  • Shows loading skeleton immediately                               │
│  • Fetches data from /api/product/{SKU}                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                API Route (/api/product/[sku])                       │
│  1. Receives SKU parameter                                          │
│  2. Looks up product URL in products.json                           │
│  3. Calls scraper function                                          │
│  4. Returns enriched data with cache headers                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Scraper (lib/scraper.ts)                          │
│  1. Fetches HTML from TIMCO website                                 │
│  2. Parses HTML using Cheerio                                       │
│  3. Extracts:                                                       │
│     • Title, SKU, Description                                       │
│     • Images (all gallery images)                                   │
│     • Specifications                                                │
│     • Price & Availability                                          │
│     • Related Products                                              │
│     • Breadcrumbs                                                   │
│  4. Returns structured JSON                                         │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        TIMCO Website                                │
│            https://timco.co.uk/[product-url]                        │
│  • Source of truth for product data                                 │
│  • Contains detailed specifications                                 │
│  • Updated by TIMCO team                                            │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
products.json (8,000+ products)
    │
    ├─> Basic Info:
    │   • SKU
    │   • Title
    │   • Size
    │   • Quantity
    │   • Thumbnail Image
    │   • Product URL  ← IMPORTANT: We use this!
    │
    └─> Scraper fetches from URL:
        • Full description
        • All images
        • Specifications table
        • Price information
        • Stock status
        • Related products
        • Category breadcrumbs
```

## Caching Strategy

```
Request Flow with Cache:

User Request → Check Cache → Cache Hit? 
                               │
                    ┌──────────┴──────────┐
                    │                     │
                   YES                   NO
                    │                     │
                    ▼                     ▼
            Return Cached          Scrape Website
            (< 100ms)                    │
                                         ▼
                                  Cache Response
                                  (1 hour TTL)
                                         │
                                         ▼
                                  Return Fresh Data
                                  (2-5 seconds)
```

### Cache Configuration

```typescript
// API Route Cache
{
  headers: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
  }
}

// Explanation:
// • public: Can be cached by browsers and CDNs
// • s-maxage=3600: Cache fresh for 1 hour (3600 seconds)
// • stale-while-revalidate=86400: Serve stale for up to 24 hours while revalidating
```

## Component Architecture

```
app/
├── search/
│   └── page.tsx              ← Lists all products with links
│
├── product/
│   └── [sku]/
│       ├── page.tsx          ← Main product detail page
│       └── loading.tsx       ← Skeleton UI while loading
│
├── api/
│   └── product/
│       └── [sku]/
│           └── route.ts      ← API endpoint (scraping trigger)
│
└── test-scraper/
    └── page.tsx              ← Test tool for developers

lib/
└── scraper.ts                ← Core scraping logic

assets/
└── products.json             ← 8,000+ product URLs
```

## Request Lifecycle

### First Request (Cold Start)
```
1. User clicks product                    [0ms]
2. Navigate to /product/SKU               [50ms]
3. Page loads, shows skeleton            [100ms]
4. Fetch /api/product/SKU starts         [150ms]
5. API checks products.json              [200ms]
6. Scraper fetches TIMCO page            [500ms - 2000ms]
7. Parse HTML with Cheerio               [2100ms]
8. Extract all data                      [2200ms]
9. Return JSON to page                   [2300ms]
10. Page renders with full data          [2400ms]

Total: ~2-5 seconds (depending on TIMCO server response)
```

### Cached Request (Warm)
```
1. User clicks product                    [0ms]
2. Navigate to /product/SKU               [50ms]
3. Page loads                             [100ms]
4. Fetch /api/product/SKU (cached)        [150ms]
5. Return from cache                      [200ms]
6. Page renders immediately               [250ms]

Total: <300ms (instant feeling)
```

## Error Handling Flow

```
Scraping Attempt
    │
    ├─> Success? → Return enriched data
    │
    └─> Failure? → Check reason:
            │
            ├─> Network Error
            │   └─> Return basic data from products.json
            │
            ├─> Product Not Found (404)
            │   └─> Show 404 page
            │
            ├─> Parsing Error
            │   └─> Return basic data with error log
            │
            └─> Timeout
                └─> Return basic data (fallback)
```

## Scalability Considerations

### Current Implementation
- ✅ No database needed
- ✅ Serverless-friendly
- ✅ Automatic caching
- ✅ Graceful degradation

### Limitations
- ⚠️ First load is slow (2-5s)
- ⚠️ Rate limiting concerns
- ⚠️ No offline support
- ⚠️ Depends on TIMCO's website structure

### Scaling Solutions

#### Phase 1: Current (On-Demand)
```
Users → Next.js → TIMCO Website
        (cache)
```

#### Phase 2: Hybrid (Database + On-Demand)
```
Users → Next.js → Check Database → Hit? → Return
                      ↓
                    Miss?
                      ↓
                  Scrape TIMCO → Save to DB → Return
```

#### Phase 3: Background Jobs
```
Cron Job → Scrape Top 1000 Products → Update Database
           (runs every 6 hours)

Users → Next.js → Database → Return (always fast)
```

#### Phase 4: Full Integration
```
TIMCO API → Webhook → Update Database → Cache Invalidation

Users → Next.js → Database → Instant Response
```

## Performance Metrics

| Metric | Current | With Redis | With DB |
|--------|---------|------------|---------|
| First Load | 2-5s | 2-5s | 2-5s |
| Cached Load | <300ms | <50ms | <100ms |
| Cache Duration | 1 hour | Indefinite | Indefinite |
| Scraping Cost | Per request | Once per product | Background job |
| Server Load | Low | Very Low | Very Low |

## Technology Stack

```
Frontend:
├── Next.js 15.5 (React 19)
├── TypeScript
├── Tailwind CSS
└── React Server Components

Backend:
├── Next.js API Routes
├── Cheerio (HTML parsing)
├── Native Fetch API
└── Edge Runtime ready

Caching:
├── Next.js Cache
├── CDN (Vercel Edge)
└── Browser Cache

Data:
├── Static JSON (8,000+ products)
└── Dynamic (scraped on-demand)
```

## Security Considerations

```
1. Rate Limiting
   └── Implement request throttling
   
2. User-Agent
   └── Identify as legitimate scraper
   
3. Error Handling
   └── Never expose system details
   
4. Caching
   └── Reduce load on TIMCO servers
   
5. robots.txt
   └── Respect TIMCO's crawling rules
```

## Future Enhancements

1. **Add Database Layer**
   - PostgreSQL or MongoDB
   - Store scraped data permanently
   - Faster subsequent loads

2. **Implement Redis Cache**
   - Longer cache duration
   - Cross-server cache sharing
   - Cache invalidation strategies

3. **Background Scraping Jobs**
   - Pre-scrape popular products
   - Update data periodically
   - Reduce real-time scraping

4. **Rate Limiting**
   - Max 10 requests per minute
   - Queue system for scraping
   - Prevent server overload

5. **Monitoring & Analytics**
   - Track scraping success rate
   - Monitor response times
   - Alert on failures

6. **Proxy Rotation**
   - Rotate IP addresses
   - Avoid rate limiting
   - Distribute load


