// Type definition for an elder. Elder records themselves live as
// markdown files in /content/elders/ and are loaded by /content/elders.ts.
// Keep this type in sync with the frontmatter fields used in those files.

export type Elder = {
  name: string;
  occupation: string;
  bio: string;
  photo: string;
};
