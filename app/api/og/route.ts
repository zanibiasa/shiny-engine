import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
  }

  try {
    // Validate URL format
    new URL(targetUrl);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGMetadataFetcher/1.0;)'
      },
      next: { revalidate: 3600 } // Cache results for 1 hour
    } as any);

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Failed to fetch URL: ${response.statusText}` }, { status: response.status });
    }

    const html = await response.text();

    // Helper to extract meta tags using Regex to avoid heavy DOM parsers on server
    const getMetaContent = (propName: string, attr: 'property' | 'name' = 'property') => {
      // Matches <meta property="og:image" content="...">
      const regex = new RegExp(`<meta\\s+${attr}=["']${propName}["']\\s+content=["'](.*?)["']`, 'i');
      const match = html.match(regex);
      if (!match) {
         // Fallback regex for reversed attributes or different spacing: <meta content="..." property="og:image">
         const altRegex = new RegExp(`<meta\\s+content=["'](.*?)["']\\s+${attr}=["']${propName}["']`, 'i');
         const altMatch = html.match(altRegex);
         return altMatch ? altMatch[1] : null;
      }
      return match[1];
    };

    const getTitle = () => {
      const ogTitle = getMetaContent('og:title');
      if (ogTitle) return ogTitle;
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      return titleMatch ? titleMatch[1] : null;
    };

    const getImage = () => {
       return getMetaContent('og:image');
    };

    const getDescription = () => {
      return getMetaContent('og:description') || getMetaContent('description', 'name');
    };

    const image = getImage();
    const title = getTitle();
    const description = getDescription();

    // Resolve relative URLs
    let resolvedImage = image;
    if (image && !image.startsWith('http')) {
      try {
        resolvedImage = new URL(image, targetUrl).href;
      } catch (e) {
        resolvedImage = null; // Invalid relative URL
      }
    }

    // Basic HTML entity decoding
    const decodeHtml = (text: string | null) => {
        if (!text) return null;
        return text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");
    };

    return NextResponse.json({
      success: true,
      data: {
        url: targetUrl,
        image: resolvedImage,
        title: decodeHtml(title),
        description: decodeHtml(description)
      }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to process request' 
    }, { status: 500 });
  }
}