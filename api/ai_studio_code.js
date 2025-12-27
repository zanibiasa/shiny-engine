// api/proxy.js
export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('Error: Missing URL parameter');
    }

    try {
        const response = await fetch(url);
        const data = await response.text();
        
        // Forward the response status and content
        res.status(response.status).send(data);
    } catch (error) {
        res.status(500).send(`Error fetching the URL: ${error.message}`);
    }
}