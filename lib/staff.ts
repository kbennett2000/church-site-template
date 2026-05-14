// Type definition for a staff member. Staff records themselves live as
// markdown files in /content/staff/ and are loaded by /content/staff.ts.
// Keep this type in sync with the frontmatter fields used in those files.

export type StaffMember = {
  name: string;
  role: string;
  email: string;
  bio: string;
  photo: string;
};
