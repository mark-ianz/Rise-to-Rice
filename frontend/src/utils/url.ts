/**
 * Dynamic URL helper that constructs clean, SEO-friendly announcement URLs.
 * Format: /announcements/[id]/[title_slug]
 */
export function getAnnouncementUrl(announcement: { announcement_id: string | number; title: string }): string {
  const cleanTitle = announcement.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, "");     // Trim dashes from start/end
  
  return `/announcements/${announcement.announcement_id}/${cleanTitle}`;
}
