import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

import { apiErrorLogs, InsertApiErrorLog, InsertUser, users } from "../drizzle/schema";

import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * API Error Logs Functions
 */

export async function insertApiErrorLog(log: InsertApiErrorLog): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert API log: database not available");
    return;
  }

  try {
    await db.insert(apiErrorLogs).values(log);
  } catch (error) {
    console.error("[Database] Failed to insert API log:", error);
    // Don't throw - logging failures shouldn't break API calls
  }
}

export async function insertApiErrorLogs(logs: InsertApiErrorLog[]): Promise<void> {
  if (logs.length === 0) return;

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert API logs: database not available");
    return;
  }

  try {
    await db.insert(apiErrorLogs).values(logs);
  } catch (error) {
    console.error("[Database] Failed to insert API logs:", error);
    // Don't throw - logging failures shouldn't break API calls
  }
}

export async function getApiErrorLogs(params: {
  limit?: number;
  offset?: number;
  level?: string;
  endpoint?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get API logs: database not available");
    return [];
  }

  try {
    let query = db.select().from(apiErrorLogs);

    // Apply filters (simplified - would use .where() with conditions in production)
    const result = await query
      .orderBy(apiErrorLogs.timestamp)
      .limit(params.limit || 100)
      .offset(params.offset || 0);

    return result;
  } catch (error) {
    console.error("[Database] Failed to get API logs:", error);
    return [];
  }
}

export async function getApiErrorLogStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get API log stats: database not available");
    return { totalLogs: 0, errorCount: 0, warnCount: 0, avgDurationMs: 0 };
  }

  try {
    // Get basic counts (simplified - would use aggregation functions in production)
    const allLogs = await db.select().from(apiErrorLogs);
    
    const totalLogs = allLogs.length;
    const errorCount = allLogs.filter(log => log.level === 'ERROR').length;
    const warnCount = allLogs.filter(log => log.level === 'WARN').length;
    const avgDurationMs = allLogs.reduce((sum, log) => sum + (log.durationMs || 0), 0) / totalLogs || 0;

    return { totalLogs, errorCount, warnCount, avgDurationMs };
  } catch (error) {
    console.error("[Database] Failed to get API log stats:", error);
    return { totalLogs: 0, errorCount: 0, warnCount: 0, avgDurationMs: 0 };
  }
}

// TODO: add feature queries here as your schema grows.
