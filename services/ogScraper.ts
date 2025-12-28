import { FetchResult } from '../types';

/**
 * Fetches Open Graph data using the server-side Next.js API route.
 */
export const fetchOGData = async (targetUrl: string): Promise<FetchResult> => {
  try {
    const response = await fetch(`/api/og?url=${encodeURIComponent(targetUrl)}`);
    
    if (!response.ok) {
       try {
         const errorData = await response.json();
         return { success: false, error: errorData.error || `Server error: ${response.status}` };
       } catch {
         return { success: false, error: `Request failed: ${response.statusText}` };
       }
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch OG data:", error);
    return { success: false, error: "Network connection failed." };
  }
};