import { fetchWithTimeout } from "@/lib/http";
import { logger } from "@/lib/logger";

interface PostWebhookOptions {
  url: string;
  operation: string;
  payload?: unknown;
  body?: BodyInit;
  headers?: HeadersInit;
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
}

export interface WebhookResult<T = unknown> {
  ok: boolean;
  status?: number;
  data: T | null;
}

export async function postWebhook<T = unknown>({
  url,
  operation,
  payload,
  body,
  headers,
  timeoutMs = 30000,
  metadata,
}: PostWebhookOptions): Promise<WebhookResult<T>> {
  try {
    const requestHeaders =
      headers ??
      (body
        ? undefined
        : {
            "Content-Type": "application/json",
          });

    const requestBody =
      body ?? (payload === undefined ? undefined : JSON.stringify(payload));

    const response = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: requestHeaders,
        cache: "no-store",
        body: requestBody,
      },
      timeoutMs,
    );

    const data = (await response.json().catch(() => null)) as T | null;

    if (!response.ok) {
      logger.warn(operation, {
        ...metadata,
        status: response.status,
      });
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    logger.error(operation, error, metadata);

    return {
      ok: false,
      data: null,
    };
  }
}
