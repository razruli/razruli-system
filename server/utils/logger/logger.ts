// server/utils/logger.ts
type LogLevel = "info" | "error" | "warn" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isDebug = process.env.DEBUG === "true";

  private formatLog(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
    };
  }

  info(message: string, data?: any) {
    const log = this.formatLog("info", message, data);
    // eslint-disable-next-line no-console
    console.log(`[${log.level.toUpperCase()}] ${message}`, data || "");
  }

  error(message: string, error?: any) {
    const log = this.formatLog("error", message, error);
    console.error(`[${log.level.toUpperCase()}] ${message}`, error || "");
  }

  warn(message: string, data?: any) {
    const log = this.formatLog("warn", message, data);
    console.warn(`[${log.level.toUpperCase()}] ${message}`, data || "");
  }

  debug(message: string, data?: any) {
    if (this.isDebug || this.isDevelopment) {
      const log = this.formatLog("debug", message, data);
      // eslint-disable-next-line no-console
      console.debug(`[${log.level.toUpperCase()}] ${message}`, data || "");
    }
  }
}

export const logger = new Logger();
