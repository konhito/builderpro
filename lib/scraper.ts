import * as cheerio from 'cheerio';

export type ScrapedProduct = {
  sku: string;
  title: string;
  description: string;
  price?: string;
  images: string[];
  specifications: Record<string, string>;
  availability?: string;
  category?: string;
  breadcrumbs: string[];
  relatedProducts?: Array<{
    sku: string;
    title: string;
    image?: string;
    url: string;
  }>;
};

export async function scrapeTimcoProduct(url: string): Promise<ScrapedProduct | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract SKU
    const sku = $('.product-code, .sku, [itemprop="sku"]').first().text().trim() || 
                url.split('/').pop()?.split('-')[0] || '';

    // Extract title
    const title = $('h1.product-name, h1[itemprop="name"], .product-title h1').first().text().trim() || 
                  $('.page-title h1').first().text().trim() || '';

    // Extract description
    let description = '';
    const descElement = $('.product-collateral .std, .product-description, [itemprop="description"], .full-description');
    if (descElement.length) {
      description = descElement.first().text().trim();
    }
    // Fallback to meta description
    if (!description) {
      description = $('meta[name="description"]').attr('content') || '';
    }

    // Extract price
    const price = $('.price-box .price, .product-price .price, [itemprop="price"]').first().text().trim() || 
                  $('.price').first().text().trim();

    // Extract images
    const images: string[] = [];
    
    // Try different image selectors
    $('.product-image img, .product-img-box img, [itemprop="image"]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !src.includes('loading') && !src.includes('placeholder')) {
        const fullUrl = src.startsWith('http') ? src : `https://timco.co.uk${src}`;
        if (!images.includes(fullUrl)) {
          images.push(fullUrl);
        }
      }
    });

    // Try gallery images
    $('.product-image-gallery img, .gallery-image img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-zoom-image');
      if (src && !src.includes('loading') && !src.includes('placeholder')) {
        const fullUrl = src.startsWith('http') ? src : `https://timco.co.uk${src}`;
        if (!images.includes(fullUrl)) {
          images.push(fullUrl);
        }
      }
    });

    // Extract specifications
    const specifications: Record<string, string> = {};
    
    // Try table format
    $('.product-specs table tr, .additional-attributes tr, .data-table tr').each((_, row) => {
      const label = $(row).find('th, td:first-child').text().trim();
      const value = $(row).find('td:last-child').text().trim();
      if (label && value && label !== value) {
        specifications[label] = value;
      }
    });

    // Try dl/dt format
    $('.product-specs dl dt, .product-attributes dt').each((_, dt) => {
      const label = $(dt).text().trim();
      const value = $(dt).next('dd').text().trim();
      if (label && value) {
        specifications[label] = value;
      }
    });

    // Extract availability
    const availability = $('.availability, .stock-status, [itemprop="availability"]').first().text().trim();

    // Extract breadcrumbs
    const breadcrumbs: string[] = [];
    $('.breadcrumbs a, .breadcrumb a, [itemprop="breadcrumb"] a').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.toLowerCase() !== 'home') {
        breadcrumbs.push(text);
      }
    });

    // Extract category from breadcrumbs or page
    const category = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : 
                     $('.category-title, .page-title').first().text().trim();

    // Extract related products
    const relatedProducts: Array<{sku: string; title: string; image?: string; url: string}> = [];
    $('.related-products .product-item, .product-variations .variant-item').each((_, el) => {
      const relTitle = $(el).find('.product-name, .variant-name, h3, h4').first().text().trim();
      const relUrl = $(el).find('a').first().attr('href') || '';
      const relSku = $(el).find('.sku, .product-code').first().text().trim() || 
                     relUrl.split('/').pop()?.split('-')[0] || '';
      const relImg = $(el).find('img').first().attr('src');
      
      if (relTitle && relUrl) {
        relatedProducts.push({
          sku: relSku,
          title: relTitle,
          image: relImg ? (relImg.startsWith('http') ? relImg : `https://timco.co.uk${relImg}`) : undefined,
          url: relUrl.startsWith('http') ? relUrl : `https://timco.co.uk${relUrl}`
        });
      }
    });

    return {
      sku,
      title,
      description,
      price,
      images,
      specifications,
      availability,
      category,
      breadcrumbs,
      relatedProducts: relatedProducts.length > 0 ? relatedProducts : undefined
    };

  } catch (error) {
    console.error('Error scraping product:', error);
    return null;
  }
}


