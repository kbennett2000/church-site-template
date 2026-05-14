// Type only. Data is loaded from /content/beliefs.json by /content/beliefs.ts.
// Keep this type in sync with the structure of beliefs.json entries.

export type Belief = {
  title: string;
  statement: string;
};
