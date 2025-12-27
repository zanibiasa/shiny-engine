import http from "http";
import https from "https";
import { URL } from "url";

export const config = {
  runtime: "nodejs",
};

export default function handler(req, res) {
  const { targetUrl } = req.query;

  if (!targetUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  let urlObj;
  try {
    urlObj = new URL(targetUrl);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const lib = urlObj.protocol === "https:" ? https : http;

  // Your strict requirement: ONLY Accept header
  const requestHeaders = {
    Accept: "/",
    User-Agent: "WhatsApp/3.22.862"
  };

  const proxyReq = lib.request(
    urlObj,
    {
      method: "GET",
      headers: requestHeaders,
    },
    (proxyRes) => {
      let body = "";
      proxyRes.setEncoding("utf8");

      proxyRes.on("data", (chunk) => (body += chunk));
      proxyRes.on("end", () => {
        res.status(200).json({
          requestHeaders,
          responseHeaders: proxyRes.headers,
          status: proxyRes.statusCode,
          content: body,
        });
      });
    }
  );

  proxyReq.on("error", (err) => {
    res.status(500).json({ error: "Failed to fetch URL", details: err.message });
  });

  proxyReq.end();
}
