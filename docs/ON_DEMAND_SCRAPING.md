# On-Demand Product Scraping

This feature allows the application to scrape product details in real-time when a user visits a product page.

## How It Works

1. **User clicks on a product** from the search page
2. **Next.js routes to** `/product/[sku]` (e.g., `/product/35012C2`)
3. **Page component fetches data** from `/api/product/[sku]`
4. **API route scrapes** the TIMCO website using the product URL
5. **Scraped data is returned** and cached for 1 hour
6. **Product page displays** enriched information

## Architecture

```
User → Product Page → API Route → Scraper → TIMCO Website
  ↓         ↓            ↓           ↓
  View   Request      Scrape      Extract
         Product      HTML        Data
```

## Files Created

### 1. `lib/scraper.ts`
- **Purpose**: Core scraping logic using Cheerio
- **Exports**: `scrapeTimcoProduct(url: string)`
- **Returns**: Enriched product data with:
  - Full description
  - Specifications
  - Multiple images
  - Price information
  - Availability status
  - Related products
  - Breadcrumbs

### 2. `app/api/product/[sku]/route.ts`
- **Purpose**: API endpoint for product data
- **Method**: GET
- **URL**: `/api/product/{sku}`
- **Caching**: 1 hour (3600s) with stale-while-revalidate
- **Fallback**: Returns basic data if scraping fails

### 3. `app/product/[sku]/page.tsx`
- **Purpose**: Product detail page
- **Features**:
  - Image gallery with thumbnails
  - Full product information
  - Specifications table
  - Related products section
  - Breadcrumb navigation
  - SEO metadata
- **Loading**: Shows skeleton while scraping

### 4. `app/product/[sku]/loading.tsx`
- **Purpose**: Loading state during scraping
- **Shows**: Skeleton UI with animated placeholders

## Benefits

✅ **No database needed** - Data fetched on-demand  
✅ **Always up-to-date** - Scrapes live data from source  
✅ **Cached responses** - 1-hour cache reduces load  
✅ **Graceful fallback** - Shows basic data if scraping fails  
✅ **Fast navigation** - Links directly from search page  

## Caching Strategy

- **Client-side**: Next.js automatically caches fetch requests
- **Server-side**: API responses cached for 1 hour
- **Revalidation**: `stale-while-revalidate` for 24 hours
- **Edge**: Can be deployed to Edge Runtime for global caching

## Testing

### Test the API directly:
```bash
curl http://localhost:3000/api/product/35012C2
```

### Test a product page:
```
http://localhost:3000/product/35012C2
```

## Performance Considerations

1. **First visit**: ~2-5 seconds (scraping + rendering)
2. **Cached visit**: <100ms (from cache)
3. **Concurrent requests**: Rate limited by Next.js
4. **Memory usage**: Minimal (no data storage)

## Potential Improvements

1. **Add Redis caching** for longer cache duration
2. **Background job** to pre-scrape popular products
3. **Database storage** for frequently accessed products
4. **Error retry logic** with exponential backoff
5. **Rate limiting** to avoid overwhelming TIMCO servers
6. **Proxy rotation** for high-volume scraping

## Error Handling

- ❌ Product not found → 404 page
- ❌ Scraping fails → Falls back to basic product data
- ❌ Network error → Shows error message with retry option
- ❌ Invalid SKU → Redirects to search page

## Legal & Ethical Considerations

⚠️ **Important**: 
- Check TIMCO's Terms of Service
- Respect `robots.txt` file
- Implement rate limiting
- Add proper User-Agent headers
- Consider contacting TIMCO for API access

## Deployment

### Environment Variables
```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Vercel Deployment
- Works out of the box
- Uses Edge Functions for API routes
- Automatic caching at CDN level

### Self-hosted
- Ensure Node.js 18+ runtime
- Configure caching proxy (Nginx/Cloudflare)
- Monitor scraping rate and errors


