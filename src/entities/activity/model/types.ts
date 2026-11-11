export type ActivityStatus = 'draft' | 'published';

export interface NetworkActivity {
  id: number;
  activity_title: string;
  activity_description: string;
  average_traffic_mbps: number;
  max_latency_ms: number;
  preview_image_url: string;
  preview_video_url: string;
  status: ActivityStatus;
  creator_id: number;
  likes_count: number;
  created_at: string;
}

export interface ActivityFilterParams {
  search: string;
  maxTraffic: number;
}
