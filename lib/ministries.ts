// Type definitions for a ministry. Ministry records themselves live as
// markdown files in /content/ministries/ and are loaded by /content/ministries.ts.
// Keep this file in sync with the frontmatter fields used in those files.

export type MinistryMeeting = {
  day: string;
  time: string;
  location: string;
  note?: string;
};

export type Ministry = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  whoFor: string;
  meetings: MinistryMeeting[];
  whatToExpect: string[];
  leader: { name: string; role: string; email: string; photo: string };
  gallery: string[];
};
