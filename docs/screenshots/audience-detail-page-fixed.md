# Audience Detail Page - Fixed

**Date:** December 14, 2025
**Status:** Working with real API data

## Screenshot

![Audience Detail Page](/home/ubuntu/screenshots/3000-isczn7k8phfypft_2025-12-14_16-10-13_5674.webp)

## What Was Fixed

### Problem
The audience detail page was showing "0" for audience size and "Not set" for all dates because:
1. The page was calling `getById` which returns `{status: "no data"}` from the API
2. The API's `GET /audiences/:id` endpoint doesn't return detailed information

### Solution
1. Changed the page to fetch from the `list` endpoint instead
2. Updated the `Audience` type to only include the 6 fields the API actually returns:
   - id
   - name
   - next_scheduled_refresh
   - refresh_interval
   - scheduled_refresh
   - webhook_url

3. Removed references to non-existent fields:
   - audience_size
   - created_at
   - last_refreshed
   - refresh_count

4. Added a clear notice explaining the API limitation
5. Marked unavailable metrics as "Not Available" with "API limitation" labels

## Real Data Now Showing

- ✅ Audience Name: "B2B ICP Adtech"
- ✅ Audience ID: "e2ec99b6-f21b-411c-90ea-faad93b220a8"
- ✅ Scheduled Refresh: "Enabled" (green badge)
- ✅ Refresh Interval: "1"
- ✅ Next Scheduled Refresh: "Dec 15, 2025, 8:00 AM"
- ✅ Webhook URL: "Not set"
- ✅ Status: "Active" with "auto-refresh" label

## API Limitations Clearly Communicated

The page now shows a blue notice box at the top:
> "The AudienceLab API currently does not provide audience size, creation date, last refreshed date, or refresh count information. Only refresh settings and metadata are available."

This sets proper expectations for users about what data is available.
