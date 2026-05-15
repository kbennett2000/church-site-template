---
type: how-to
audience: editor
time: 7 minutes
---

# Add a staff member

**Who this is for:** Whoever maintains the list of paid pastors and staff on the website.
**What you'll accomplish:** Add a new staff member with photo, bio, and the correct display order.
**You'll need first:**
- Logged in to the editor at `/admin/`. See [Getting started](./01-getting-started.md).
- The person's full name and job title.
- (Optional) Their public email address.
- A square headshot photo (about 800 by 800 pixels works best). See [Upload photos](./07-upload-photos.md).
- 2-3 sentences for their bio.

## Steps

### 1. Open the Staff collection

**Click** **Staff** in the left sidebar.

You should now see a list of current staff members in their display order.

![Staff collection list](/docs/screenshots/editor/add-a-staff-member-list.png)

### 2. Click New Staff Member

**Click** the **New Staff Member** button in the top right.

You should now see a blank staff form.

### 3. Fill in Full Name

**Type** the person's name as they want it shown publicly.

Include "Pastor" or other titles if applicable. For example: `Pastor Alex Morgan` or `Jamie Rivera`.

### 4. Fill in Role / Title

**Type** the job title.

Examples: `Senior Pastor`, `Associate Pastor`, `Worship Director`, `Office Manager`, `Children's Ministry Coordinator`.

### 5. Fill in Email (optional)

**Type** the public email address.

If they prefer to be contacted through the church office, **leave** this field blank. The site will show "Contact via church office" instead.

> **Tip:** Be careful publishing personal emails. Some staff prefer the office handle their inquiries.

### 6. Upload Photo

**Click** the **Choose an image** button next to **Photo**.

**Click** **Upload** at the top of the picker.

**Pick** the headshot from your computer.

**Click** **Choose Selected** at the bottom right.

You should now see a small preview of the photo next to the field.

> **Important:** Use a square photo (or one that's close to square) — the site crops it to a circle for staff portraits. Wide photos get cropped strangely.

### 7. Set Display Order (this is the tricky one)

The **Display Order** number controls who appears first on the staff page.

- `1` = first (shown at the top).
- `2` = second.
- `3` = third.
- ...and so on.

**Convention:**
- Senior Pastor = `1`
- Associate Pastor = `2`
- Worship Director = `3`
- Office Manager = `4`

**Type** the number for where this person should appear.

> **Warning:** If you give two people the same number, the order between them is unpredictable. Check the staff list before you publish to make sure each person has a unique number.

> **Tip:** If you need to insert a new person between existing entries (say, between #2 and #3), give the new person `2.5`. Fractional numbers work fine — you don't have to renumber anyone else. The site sorts by the number, so `2.5` lands between `2` and `3` exactly where you'd expect.

### 8. Fill in Bio

**Type** 2-3 sentences that introduce this person.

What would a first-time visitor want to know if they shook this person's hand on Sunday? Where are they from? How long have they served here? Family? A hobby?

Example: *"John has served as Senior Pastor since 2018. He and his wife Sarah have three kids and a beagle named Wendell. Before pastoring, John taught high school history for twelve years."*

### 9. Save

**Click** the **Save** button at the top.

TinaCMS commits (saves a snapshot of) your change directly to the site. Within 2-3 minutes, the new staff member will appear on the About page and the Contact page in the order you set.

## How to remove a staff member

If someone leaves the staff:

**Open** their entry from the Staff list.

**Click** the **Delete entry** button at the top right.

**Confirm** the deletion.

The deletion commits directly to the site and takes effect within 2-3 minutes. If you delete by mistake, ask your tech volunteer — they can restore the entry from GitHub history.

## How to update an existing staff member

To change a photo, bio, or role:

**Open** their entry from the Staff list.

**Edit** the fields you want to change.

**Click** **Save**. The change goes live in 2-3 minutes.

## Common Mistakes

- **Two people show up in the wrong order.** They share the same Display Order number. **Open** each entry and give them different numbers.
- **The photo is cropped weirdly (you can only see half their face).** The photo isn't square. Re-crop the original to a square in any photo app, then re-upload it.
- **The new person shows up at the bottom even though you set order = 1.** You may have set order = 1 on someone who was already #1. Whoever you displaced needs a new number too.

## What's next?

- [Add an event](./06-add-an-event.md) — for recurring calendar items.
- [Upload photos](./07-upload-photos.md) — what makes a good photo for the site.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Add%20a%20Staff%20Member).*
