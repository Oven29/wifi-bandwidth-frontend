/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** NetworkActivityResponse */
export interface NetworkActivityResponse {
  /** Id */
  id: number;
  /** Activity Title */
  activity_title: string;
  /** Activity Description */
  activity_description?: string | null;
  /** Average Traffic Mbps */
  average_traffic_mbps?: number | null;
  /** Max Latency Ms */
  max_latency_ms?: number | null;
  /** Preview Image Url */
  preview_image_url: string;
  /** Preview Video Url */
  preview_video_url: string;
  /** Status */
  status: string;
  /** Creator Id */
  creator_id?: number | null;
  /**
   * Created At
   * @format date-time
   */
  created_at?: string | null;
  /**
   * Updated At
   * @format date-time
   */
  updated_at?: string | null;
  /**
   * Is Owner
   * @default 0
   */
  is_owner?: number;
  /**
   * Is Liked
   * @default 0
   */
  is_liked?: number;
  /**
   * Likes Count
   * @default 0
   */
  likes_count?: number;
}

/** FeedResponse */
export interface FeedResponse {
  activity?: NetworkActivityResponse | null;
}

/** NetworkActivityPublish */
export interface NetworkActivityPublish {
  /** Activity Description */
  activity_description?: string | null;
  /** Description */
  description?: string | null;
  /** Average Traffic Mbps */
  average_traffic_mbps: number;
  /** Max Latency Ms */
  max_latency_ms: number;
}

/** Body_create_draft */
export interface BodyCreateDraft {
  /** Activity Title */
  activity_title: string;
  /**
   * Pic
   * @format binary
   */
  pic: File;
  /**
   * Video
   * @format binary
   */
  video: File;
}

/** Body_auth_user */
export interface BodyAuthUser {
  /** Username */
  username: string;
  /** Password */
  password: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Bandwidth Router Calc API
 * @version 1.0.0
 *
 * API определения необходимой пропускной способности Wi-Fi роутера
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags NetworkActivities
     * @name ListActivities
     * @summary List Activities
     * @request GET:/api/network-activities/
     */
    listActivities: (
      query?: {
        /** Filter Traffic */
        filter_traffic?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<NetworkActivityResponse[], any>({
        path: `/api/network-activities/`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NetworkActivities
     * @name CreateDraft
     * @summary Create Draft
     * @request POST:/api/network-activities/
     */
    createDraft: (data: BodyCreateDraft, params: RequestParams = {}) =>
      this.request<NetworkActivityResponse, any>({
        path: `/api/network-activities/`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NetworkActivities
     * @name GetFeed
     * @summary Get Feed
     * @request GET:/api/network-activities/feed
     */
    getFeed: (
      query?: {
        /** Activity Id */
        activity_id?: number;
        /** Current Id */
        current_id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<FeedResponse, any>({
        path: `/api/network-activities/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NetworkActivities
     * @name GetDraft
     * @summary Get Draft
     * @request GET:/api/network-activities/draft
     */
    getDraft: (params: RequestParams = {}) =>
      this.request<NetworkActivityResponse | null, any>({
        path: `/api/network-activities/draft`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NetworkActivities
     * @name PublishActivity
     * @summary Publish Activity
     * @request PUT:/api/network-activities/{id}/publish
     */
    publishActivity: (
      id: number,
      data: NetworkActivityPublish,
      params: RequestParams = {},
    ) =>
      this.request<NetworkActivityResponse, any>({
        path: `/api/network-activities/${id}/publish`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NetworkActivities
     * @name DeleteActivity
     * @summary Delete Activity
     * @request DELETE:/api/network-activities/{id}
     */
    deleteActivity: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          message?: string;
          id?: number;
        },
        any
      >({
        path: `/api/network-activities/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NetworkActivities
     * @name ToggleLike
     * @summary Toggle Like
     * @request POST:/api/network-activities/{id}/like
     */
    toggleLike: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          status?: number;
        },
        any
      >({
        path: `/api/network-activities/${id}/like`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AuthUser
     * @summary Auth
     * @request POST:/api/users/auth
     */
    authUser: (data: BodyAuthUser, params: RequestParams = {}) =>
      this.request<
        {
          message?: string;
          session_id?: string;
        },
        any
      >({
        path: `/api/users/auth`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name LogoutUser
     * @summary Logout
     * @request POST:/api/users/logout
     */
    logoutUser: (params: RequestParams = {}) =>
      this.request<
        {
          message?: string;
        },
        any
      >({
        path: `/api/users/logout`,
        method: "POST",
        format: "json",
        ...params,
      }),
  };
}
