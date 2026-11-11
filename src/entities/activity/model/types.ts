export type {
  NetworkActivityResponse as NetworkActivity,
  NetworkActivityPublish,
  FeedResponse,
} from '../../../shared/api/generated/Api';

export interface ActivityFilterParams {
  search: string;
  maxTraffic: number;
}
