export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        // 1. Define the headers Vercel will send to the target
        // We can mimic a browser or just use Node defaults
        const outgoingHeaders = {
            // 'User-Agent': 'Vercel-Serverless-Proxy/1.0',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            // Optional: Forward the user's IP or other info if desired
            'X-Forwarded-For': req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        };

        // 2. Perform the actual fetch with these headers
        const response = await fetch(url, {
            method: 'GET',
            headers: outgoingHeaders
        });

        const body = await response.text();

        // 3. Capture the headers the Target sent back to Vercel
        const targetResponseHeaders = {};
        response.headers.forEach((value, key) => {
            targetResponseHeaders[key] = value;
        });

        // 4. Return everything to your browser
        res.status(200).json({
            browserToVercel: req.headers,      // What your browser sent to Vercel
            vercelToTarget: outgoingHeaders,   // What Vercel sent to the URL (NEW)
            targetToVercel: targetResponseHeaders, // What the URL sent back
            body: body
        });
    } catch (error) {
        res.status(500).json({ error: `Fetch Error: ${error.message}` });
    }
}