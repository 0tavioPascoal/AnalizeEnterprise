type LogLevel = "info" | "warn" | "error";
type LogMetadata = Record<string, unknown>;

const sensitiveKeys = [
  "authorization",
  "cookie",
  "email",
  "password",
  "path",
  "payload",
  "token",
  "secret",
  "service_role",
  "serviceRole",
  "signed",
  "signedUrl",
  "url",
  "body",
  "file",
  "webhook",
];

function sanitizeMetadata(metadata?: LogMetadata): LogMetadata | undefined {
  if (!metadata) return undefined;

  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      const isSensitive = sensitiveKeys.some((sensitiveKey) =>
        key.toLowerCase().includes(sensitiveKey.toLowerCase()),
      );

      return [key, isSensitive ? "[redacted]" : value];
    }),
  );
}

function serializeError(error: unknown): LogMetadata {
  if (error instanceof Error) {
    const serialized: LogMetadata = {
      name: error.name,
      message: error.message,
    };

    if (process.env.NODE_ENV !== "production") {
      serialized.stack = error.stack;
    }

    return serialized;
  }

  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;

    return {
      name: record.name,
      message: record.message,
      code: record.code,
      details: record.details,
      hint: record.hint,
      status: record.status,
      value: "[object]",
    };
  }

  return {
    value: String(error),
  };
}

function writeLog(
  level: LogLevel,
  operation: string,
  metadata?: LogMetadata,
): void {
  const entry = {
    level,
    operation,
    timestamp: new Date().toISOString(),
    ...sanitizeMetadata(metadata),
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(entry));
    return;
  }

  console.info(JSON.stringify(entry));
}

export const logger = {
  info(operation: string, metadata?: LogMetadata) {
    writeLog("info", operation, metadata);
  },

  warn(operation: string, metadata?: LogMetadata) {
    writeLog("warn", operation, metadata);
  },

  error(operation: string, error: unknown, metadata?: LogMetadata) {
    writeLog("error", operation, {
      ...metadata,
      error: serializeError(error),
    });
  },
};
