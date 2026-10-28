export interface NetworkActivity {
  id: number;
  activity_title: string;
  activity_description: string;
  average_traffic_mbps: number;
  max_latency_ms: number;
  preview_image_url: string;
  preview_video_url: string;
  status?: string;
  creator_id?: number | null;
  likes_count: number;
  created_at?: string;
}

export type SortOption = 'default' | 'traffic-asc' | 'traffic-desc' | 'latency-asc' | 'likes-desc';

export interface ActivityFilterParams {
  search: string;
  maxTraffic: number;
  sortBy: SortOption;
}
