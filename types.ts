export interface OGData {
  url: string;
  image: string | null;
  title: string | null;
  description: string | null;
}

export interface FetchResult {
  success: boolean;
  data?: OGData;
  error?: string;
}
