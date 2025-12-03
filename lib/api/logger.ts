interface LogEntry {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  metadata?: Record<string, any>
  userId?: string
  requestId?: string
}

class APILogger {
  private logs: LogEntry[] = []

  private createLogEntry(
    level: LogEntry["level"],
    message: string,
    metadata?: Record<string, any>,
    userId?: string,
    requestId?: string,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      userId,
      requestId,
    }
  }

  info(message: string, metadata?: Record<string, any>, userId?: string, requestId?: string) {
    const entry = this.createLogEntry("info", message, metadata, userId, requestId)
    this.logs.push(entry)
    console.log(`[INFO] ${entry.timestamp} - ${message}`, metadata)
  }

  warn(message: string, metadata?: Record<string, any>, userId?: string, requestId?: string) {
    const entry = this.createLogEntry("warn", message, metadata, userId, requestId)
    this.logs.push(entry)
    console.warn(`[WARN] ${entry.timestamp} - ${message}`, metadata)
  }

  error(message: string, error?: Error, metadata?: Record<string, any>, userId?: string, requestId?: string) {
    const entry = this.createLogEntry("error", message, { ...metadata, error: error?.stack }, userId, requestId)
    this.logs.push(entry)
    console.error(`[ERROR] ${entry.timestamp} - ${message}`, error, metadata)
  }

  debug(message: string, metadata?: Record<string, any>, userId?: string, requestId?: string) {
    const entry = this.createLogEntry("debug", message, metadata, userId, requestId)
    this.logs.push(entry)
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${entry.timestamp} - ${message}`, metadata)
    }
  }

  // Get recent logs for monitoring
  getRecentLogs(limit = 100): LogEntry[] {
    return this.logs.slice(-limit)
  }

  // Get logs by level
  getLogsByLevel(level: LogEntry["level"], limit = 100): LogEntry[] {
    return this.logs.filter((log) => log.level === level).slice(-limit)
  }

  // Get logs by user
  getLogsByUser(userId: string, limit = 100): LogEntry[] {
    return this.logs.filter((log) => log.userId === userId).slice(-limit)
  }

  // Clear old logs (keep last 1000)
  cleanup() {
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000)
    }
  }
}

export const apiLogger = new APILogger()

// Cleanup logs every hour
if (typeof window === "undefined") {
  setInterval(
    () => {
      apiLogger.cleanup()
    },
    60 * 60 * 1000,
  )
}
