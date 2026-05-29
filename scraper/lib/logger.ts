type LogLevel = "info" | "warn" | "error" | "debug";

function timestamp(): string {
  return new Date().toISOString();
}

function format(level: LogLevel, message: string, meta?: unknown): string {
  const base = `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
  if (meta !== undefined) {
    return `${base} ${typeof meta === "string" ? meta : JSON.stringify(meta)}`;
  }
  return base;
}

export const logger = {
  info(message: string, meta?: unknown) {
    console.log(format("info", message, meta));
  },
  warn(message: string, meta?: unknown) {
    console.warn(format("warn", message, meta));
  },
  error(message: string, meta?: unknown) {
    console.error(format("error", message, meta));
  },
  debug(message: string, meta?: unknown) {
    if (process.env.SCRAPER_DEBUG === "1") {
      console.debug(format("debug", message, meta));
    }
  },
};
