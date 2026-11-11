import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { networkActivitiesApi } from '../../../shared/api/generatedClient';
import {
  NetworkActivityResponse,
  NetworkActivityPublish,
} from '../../../shared/api/generated/Api';
import { MOCK_ACTIVITIES } from './mock';

export interface ActivityState {
  activities: NetworkActivityResponse[];
  feedActivity: NetworkActivityResponse | null;
  nextActivityId: number | null;
  draft: NetworkActivityResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: MOCK_ACTIVITIES,
  feedActivity: MOCK_ACTIVITIES[0] || null,
  nextActivityId: MOCK_ACTIVITIES[1]?.id || null,
  draft: null,
  loading: false,
  error: null,
};

// 1. Сгенерированный метод: listActivities (Скриншоты 13-14)
export const fetchActivitiesThunk = createAsyncThunk<
  NetworkActivityResponse[],
  number | undefined
>('networkActivities/fetchActivities', async (filterTraffic) => {
  try {
    const response = await networkActivitiesApi.listActivities(
      filterTraffic !== undefined ? { filter_traffic: filterTraffic } : undefined
    );
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    return response.data;
  } catch {
    // Fallback на mock-коллекцию при отсутствии доступа к бэкенду (только как гость)
    const filtered = MOCK_ACTIVITIES.filter((item) => {
      const traffic = item.average_traffic_mbps ?? 0;
      return filterTraffic === undefined || traffic <= filterTraffic;
    });
    return filtered;
  }
});

// 2. Сгенерированный метод: getFeed
export const fetchFeedThunk = createAsyncThunk<
  { activity: NetworkActivityResponse | null; next_activity_id?: number | null },
  number | undefined
>('networkActivities/fetchFeed', async (activityId) => {
  try {
    const response = await networkActivitiesApi.getFeed(
      activityId !== undefined ? { activity_id: activityId } : undefined
    );
    return {
      activity: response.data.activity || null,
      next_activity_id: response.data.next_activity_id ?? response.data.next_id ?? null,
    };
  } catch {
    // Fallback на mock-коллекцию
    const targetIdx =
      activityId !== undefined
        ? MOCK_ACTIVITIES.findIndex((item) => item.id === activityId)
        : 0;
    const current = MOCK_ACTIVITIES[targetIdx !== -1 ? targetIdx : 0] || null;
    const nextIdx = (targetIdx + 1) % MOCK_ACTIVITIES.length;
    return {
      activity: current,
      next_activity_id: MOCK_ACTIVITIES[nextIdx]?.id || null,
    };
  }
});

// 3. Сгенерированный метод: getDraft
export const fetchDraftThunk = createAsyncThunk<NetworkActivityResponse | null>(
  'networkActivities/fetchDraft',
  async () => {
    try {
      const response = await networkActivitiesApi.getDraft();
      return response.data;
    } catch {
      return null;
    }
  }
);

// 4. Сгенерированный метод: createDraft (multipart/form-data через Axios)
export const createDraftThunk = createAsyncThunk<
  NetworkActivityResponse,
  { title: string; pic: File; video: File }
>('networkActivities/createDraft', async ({ title, pic, video }, { rejectWithValue }) => {
  try {
    const response = await networkActivitiesApi.createDraft({
      activity_title: title,
      pic,
      video,
    });
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail || 'Ошибка создания черновика');
  }
});

// 5. Сгенерированный метод: publishActivity
export const publishActivityThunk = createAsyncThunk<
  NetworkActivityResponse,
  { id: number; data: NetworkActivityPublish }
>('networkActivities/publishActivity', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await networkActivitiesApi.publishActivity(id, data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail || 'Ошибка публикации активности');
  }
});

// 6. Сгенерированный метод: deleteActivity
export const deleteActivityThunk = createAsyncThunk<number, number>(
  'networkActivities/deleteActivity',
  async (id, { rejectWithValue }) => {
    try {
      await networkActivitiesApi.deleteActivity(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Ошибка удаления активности');
    }
  }
);

// 7. Сгенерированный метод: toggleLike
export const toggleLikeThunk = createAsyncThunk<
  { id: number; status: number },
  number
>('networkActivities/toggleLike', async (id, { rejectWithValue }) => {
  try {
    const response = await networkActivitiesApi.toggleLike(id);
    return { id, status: response.data.status ?? 0 };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail || 'Ошибка установки лайка');
  }
});

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearDraft: (state) => {
      state.draft = null;
    },
    localToggleLike: (state, action) => {
      const id = action.payload;
      const item = state.activities.find((a) => a.id === id);
      if (item) {
        const isLiked = item.is_liked === 1;
        item.is_liked = isLiked ? 0 : 1;
        item.likes_count = (item.likes_count || 0) + (isLiked ? -1 : 1);
      }
      if (state.feedActivity && state.feedActivity.id === id) {
        const isLiked = state.feedActivity.is_liked === 1;
        state.feedActivity.is_liked = isLiked ? 0 : 1;
        state.feedActivity.likes_count =
          (state.feedActivity.likes_count || 0) + (isLiked ? -1 : 1);
      }
    },
  },
  extraReducers: (builder) => {
    // 1. fetchActivitiesThunk
    builder
      .addCase(fetchActivitiesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivitiesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivitiesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки каталога';
      });

    // 2. fetchFeedThunk
    builder
      .addCase(fetchFeedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feedActivity = action.payload.activity;
        state.nextActivityId = action.payload.next_activity_id ?? null;
      })
      .addCase(fetchFeedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      });

    // 3. fetchDraftThunk
    builder.addCase(fetchDraftThunk.fulfilled, (state, action) => {
      state.draft = action.payload;
    });

    // 4. createDraftThunk
    builder
      .addCase(createDraftThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDraftThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = action.payload;
      })
      .addCase(createDraftThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Не удалось создать черновик';
      });

    // 5. publishActivityThunk
    builder
      .addCase(publishActivityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishActivityThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = null;
        state.activities.unshift(action.payload);
      })
      .addCase(publishActivityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Не удалось опубликовать активность';
      });

    // 6. deleteActivityThunk
    builder
      .addCase(deleteActivityThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteActivityThunk.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.activities = state.activities.filter((item) => item.id !== deletedId);
        if (state.feedActivity && state.feedActivity.id === deletedId) {
          state.feedActivity = state.activities[0] || null;
        }
      })
      .addCase(deleteActivityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Не удалось удалить активность';
      });

    // 7. toggleLikeThunk
    builder.addCase(toggleLikeThunk.fulfilled, (state, action) => {
      const { id, status } = action.payload;
      const act = state.activities.find((a) => a.id === id);
      if (act) {
        act.is_liked = status;
        act.likes_count = (act.likes_count || 0) + (status === 1 ? 1 : -1);
      }
      if (state.feedActivity && state.feedActivity.id === id) {
        state.feedActivity.is_liked = status;
        state.feedActivity.likes_count =
          (state.feedActivity.likes_count || 0) + (status === 1 ? 1 : -1);
      }
    });
  },
});

export const { clearDraft, localToggleLike } = activitySlice.actions;
export default activitySlice.reducer;
