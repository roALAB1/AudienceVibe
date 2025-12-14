/**
 * Segment Mapping Service
 * 
 * Manages the mapping between AudienceLab audiences and Studio segments
 * Enables hybrid API approach: Audiences API for management, Studio API for data
 */

import { getDb } from '../db';
import { audienceSegments } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export class SegmentMappingService {
  /**
   * Create a new audience-to-segment mapping
   */
  async createMapping(
    audienceId: string,
    audienceName: string,
    segmentId: string,
    segmentName: string,
    totalRecords?: number
  ) {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    const [result] = await db.insert(audienceSegments).values({
      audienceId,
      audienceName,
      segmentId,
      segmentName,
      totalRecords: totalRecords || null
    });

    return result;
  }

  /**
   * Get segment mapping for an audience
   */
  async getSegmentForAudience(audienceId: string) {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    const result = await db
      .select()
      .from(audienceSegments)
      .where(eq(audienceSegments.audienceId, audienceId))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Get all segment mappings
   */
  async getAllMappings() {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    return db.select().from(audienceSegments);
  }

  /**
   * Update the cached record count for a segment
   */
  async updateRecordCount(segmentId: string, totalRecords: number) {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    await db
      .update(audienceSegments)
      .set({ 
        totalRecords,
        updatedAt: new Date()
      })
      .where(eq(audienceSegments.segmentId, segmentId));
  }

  /**
   * Delete a segment mapping
   */
  async deleteMapping(audienceId: string) {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    await db
      .delete(audienceSegments)
      .where(eq(audienceSegments.audienceId, audienceId));
  }

  /**
   * Check if a segment mapping exists for an audience
   */
  async hasMapping(audienceId: string): Promise<boolean> {
    const mapping = await this.getSegmentForAudience(audienceId);
    return mapping !== null;
  }
}

// Export singleton instance
export const segmentMappingService = new SegmentMappingService();
