export type AuthErrorCode = "INVALID_CREDENTIALS" | "SESSION_EXPIRED";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | AuthErrorCode;

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
};

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: ApiError };