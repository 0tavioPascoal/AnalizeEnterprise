import { NextResponse } from "next/server";

export type ApiResult<T = unknown> =
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      message: string;
    };

export function apiSuccess<T>(data?: T, status = 200): NextResponse<ApiResult<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export function apiError(
  message: string,
  status = 500,
): NextResponse<ApiResult> {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
