const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

/** Longest we wait for the API before giving up (a cold-starting server can take a while). */
const REQUEST_TIMEOUT_MS = 30_000;

/* =========================================================
   TYPES
========================================================= */

type ApiErrorPayload = {
  code?: string;
  message?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
  message?: string;
};

type ApiFetchOptions = RequestInit & {
  accessToken?: string;
};

/* =========================================================
   API ERROR
========================================================= */

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(
    message: string,
    status: number,
    code = "API_ERROR",
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/* =========================================================
   API FETCH
========================================================= */

async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    accessToken,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const headers = new Headers(
    customHeaders,
  );

  /*
   * JSON content type only when there is a body.
   */
  if (
    fetchOptions.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  /*
   * Access token is supplied by the auth store
   * when a protected API request is made.
   */
  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  /*
   * Never wait forever: a sleeping or unreachable API must end in a clear message, not a page
   * that spins until the platform gives up.
   */
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  const callerSignal = fetchOptions.signal;

  if (callerSignal) {
    if (callerSignal.aborted) {
      controller.abort();
    } else {
      callerSignal.addEventListener(
        "abort",
        () => controller.abort(),
        { once: true },
      );
    }
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...fetchOptions,

        headers,

        signal: controller.signal,

        /*
         * Required for the HTTP-only refresh-token
         * cookie created by the backend.
         */
        credentials: "include",

        cache: "no-store",
      },
    );
  } catch (error) {
    if (callerSignal?.aborted) {
      throw error;
    }

    throw new ApiError(
      controller.signal.aborted
        ? "The store is taking too long to respond. Please try again in a moment."
        : "We could not reach the store. Please check your connection and try again.",
      0,
      controller.signal.aborted
        ? "REQUEST_TIMEOUT"
        : "NETWORK_ERROR",
    );
  } finally {
    clearTimeout(timeout);
  }

  /* =======================================================
     RESPONSE PARSING
  ======================================================= */

  let result:
    | ApiResponse<T>
    | null = null;

  const contentType =
    response.headers.get(
      "content-type",
    );

  if (
    contentType?.includes(
      "application/json",
    )
  ) {
    try {
      result =
        (await response.json()) as ApiResponse<T>;
    } catch {
      result = null;
    }
  }

  /* =======================================================
     ERROR HANDLING
  ======================================================= */

  if (!response.ok) {
    throw new ApiError(
      result?.error?.message ||
        result?.message ||
        "Something went wrong while contacting the API.",
      response.status,
      result?.error?.code ||
        "API_ERROR",
    );
  }

  if (
    !result ||
    result.success !== true
  ) {
    throw new ApiError(
      result?.error?.message ||
        result?.message ||
        "The API returned an invalid response.",
      response.status,
      result?.error?.code ||
        "INVALID_API_RESPONSE",
    );
  }

  /*
   * Some successful endpoints may intentionally return
   * only a message and no data.
   */
  return result.data as T;
}

/* =========================================================
   EXPORTS
========================================================= */

export {
  API_BASE_URL,
  apiFetch,
};

export type {
  ApiResponse,
  ApiFetchOptions,
};