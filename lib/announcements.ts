// Type only. Data + loader live in content/announcements.

export type Announcement = {
  id: string;
  title: string;
  date: string;       // ISO "YYYY-MM-DD" — when this was posted
  expires?: string;   // ISO "YYYY-MM-DD" — optional auto-hide date
  pinned: boolean;    // Pinned items show first with a small badge
  link?: string;      // Optional URL or internal path (e.g. "/calendar")
  linkLabel?: string; // Optional button text — e.g. "See full menu"
  body: string;       // 1-2 sentences from the markdown body
};
