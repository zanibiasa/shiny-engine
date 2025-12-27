// api/proxy.js
export default async function handler(req, res) {
  const { targetUrl } = req.query;

  if (!targetUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // User Requirement: Request header only contains "Accept": "/"
  const customHeaders = {
    "Accept": "/"
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: customHeaders
    });

    const data = await response.text();

    // Convert Headers object to a plain JSON object for display
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    res.status(200).json({
      requestHeaders: customHeaders,
      responseHeaders: responseHeaders,
      content: data
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch URL', 
      details: error.message 
    });
  }
}