import { ActivityFilterParams, NetworkActivity } from '../types/activity';
import { MOCK_ACTIVITIES } from './mock';

/**
 * Retrieves all network activities directly from the mock collection.
 * According to lab requirements, cards content is loaded from mock objects.
 */
export const getActivities = async (): Promise<NetworkActivity[]> => {
  // Returns mock collection (simulating an async request)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ACTIVITIES]);
    }, 100);
  });
};

/**
 * Retrieves a single network activity by ID from mock collection.
 */
export const getActivityById = async (id: number | string): Promise<NetworkActivity | undefined> => {
  const numericId = Number(id);
  const found = MOCK_ACTIVITIES.find((item) => item.id === numericId);
  return found ? { ...found } : undefined;
};

/**
 * Optional web-service API connector (section 7.4 of the guide).
 * Tries fetching from backend /api/network-activities via Vite reverse proxy;
 * falls back to MOCK_ACTIVITIES on network error, CORS, or if backend is offline.
 */
export const fetchActivitiesFromBackend = async (
  filterTraffic?: number
): Promise<NetworkActivity[]> => {
  try {
    const url = filterTraffic !== undefined
      ? `/api/network-activities?filter_traffic=${filterTraffic}`
      : '/api/network-activities';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return MOCK_ACTIVITIES;
  } catch {
    // Graceful fallback to mock data as required
    return MOCK_ACTIVITIES;
  }
};

/**
 * Pure filter and sort function for the catalog view.
 */
export const filterActivities = (
  items: NetworkActivity[],
  filters: ActivityFilterParams
): NetworkActivity[] => {
  let result = items.filter((item) => {
    // Filter by name (case-insensitive substring)
    const matchesSearch = !filters.search.trim() ||
      item.activity_title.toLowerCase().includes(filters.search.trim().toLowerCase()) ||
      item.activity_description.toLowerCase().includes(filters.search.trim().toLowerCase());

    // Filter by maximum traffic volume
    const matchesTraffic = filters.maxTraffic === 0 || item.average_traffic_mbps <= filters.maxTraffic;

    return matchesSearch && matchesTraffic;
  });

  // Sorting
  switch (filters.sortBy) {
    case 'traffic-asc':
      result.sort((a, b) => a.average_traffic_mbps - b.average_traffic_mbps);
      break;
    case 'traffic-desc':
      result.sort((a, b) => b.average_traffic_mbps - a.average_traffic_mbps);
      break;
    case 'latency-asc':
      result.sort((a, b) => a.max_latency_ms - b.max_latency_ms);
      break;
    case 'likes-desc':
      result.sort((a, b) => b.likes_count - a.likes_count);
      break;
    default:
      result.sort((a, b) => a.id - b.id);
      break;
  }

  return result;
};
