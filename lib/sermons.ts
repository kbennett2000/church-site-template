// Sermon TYPE only. Data is loaded from /content/sermons/*.md by
// /content/sermons.ts. Consumer pages import the data from /content/sermons.

export type Sermon = {
  id: string;
  title: string;
  series: string;
  speaker: string;
  date: string;
  scripture: string;
  book: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  audioUrl: string;
  notesUrl: string;
};
