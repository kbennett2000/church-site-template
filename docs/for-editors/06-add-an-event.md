---
type: how-to
audience: editor
time: 8 minutes
---

# Add a recurring event

**Who this is for:** Whoever maintains the church calendar — adding a new weekly Bible study, a monthly potluck, or any other event that happens on a regular schedule.
**What you'll accomplish:** Add a recurring event that automatically shows up on the calendar for every future occurrence.
**You'll need first:**
- Logged in to the editor at `/admin/`. See [Getting started](./01-getting-started.md).
- The event's name, time, location, and how often it meets.

## What "recurring" means here

A **recurring event** is one that happens on a schedule — every Sunday, the second Saturday of each month, the last Sunday of each month, and so on. You add it once, and the website calendar fills in every future date automatically.

If the event is a single one-off (a guest speaker on a specific date, for instance), it's handled differently — ask your tech volunteer to add one-off events.

## The three recurrence types

The website understands three patterns. Pick the one that matches your event:

1. **Weekly** — happens every week on the same day. (Example: Sunday service, Wednesday Bible study.)
2. **Nth of month** — happens on the Nth Saturday/Sunday/etc. of each month. (Example: "Second Saturday Men's Breakfast" — the 2nd Saturday every month.)
3. **Last of month** — happens on the last Saturday/Sunday/etc. of each month. (Example: "Last Sunday Potluck.")

## Three filled-in examples (read these first)

Most editors find it easier to see a complete example than to read the steps cold. Here are the three patterns above, filled in:

**Example 1 — Wednesday Bible Study (weekly, 7 PM)**

| Field | Value |
| --- | --- |
| Internal ID | `wednesday-bible-study` |
| Event Name | Wednesday Bible Study |
| Start Time | 7:00 PM |
| Duration | 90 |
| Location | Fellowship Hall |
| Recurrence Type | weekly |
| Day of Week | 3 (Wednesday) |
| Which week of the month | (leave blank) |
| Needs RSVP? | Off |

**Example 2 — Second Saturday Men's Breakfast**

| Field | Value |
| --- | --- |
| Internal ID | `mens-breakfast` |
| Event Name | Men's Breakfast |
| Start Time | 8:00 AM |
| Duration | 90 |
| Location | Fellowship Hall |
| Recurrence Type | nth-of-month |
| Day of Week | 6 (Saturday) |
| Which week of the month | 2 (second) |
| Needs RSVP? | On |

**Example 3 — Last Sunday Potluck**

| Field | Value |
| --- | --- |
| Internal ID | `last-sunday-potluck` |
| Event Name | Last Sunday Potluck |
| Start Time | 11:00 AM |
| Duration | 90 |
| Location | Fellowship Hall |
| Recurrence Type | last-of-month |
| Day of Week | 0 (Sunday) |
| Which week of the month | (leave blank) |
| Needs RSVP? | On |

The fields are explained in the steps below — but if you can already see which row of which example matches your event, you can skip to step 13 (Save) once you've filled them in.

## Steps

### 1. Open Recurring Events

**Click** **Recurring Events** in the left sidebar.

You should now see a list with one entry: **Calendar — Recurring Events**.

**Click** that entry.

You should now see a list of all the existing recurring events.

![Recurring events list](/docs/screenshots/editor/add-an-event-list.png)

### 2. Add a new event row

**Scroll** to the bottom of the events list.

**Click** the **Add Events** button.

You should now see a new blank event card open up at the bottom of the list.

### 3. Fill in Internal ID

The **Internal ID** is a short nickname for the event in the system. It never shows up on the public site — but it has to be unique and stable.

**Type** a short, lowercase nickname using letters and hyphens only. Examples:

- `wednesday-bible-study`
- `mens-breakfast`
- `last-sunday-potluck`
- `youth-night`

> **Warning:** Once you publish an event, don't change its Internal ID later. If you do, links and RSVPs tied to it can break. Pick once, leave alone.

### 4. Fill in Event Name

**Type** the public name as it should appear on the calendar.

Examples: `Wednesday Bible Study`, `Men's Breakfast`, `Last Sunday Potluck`, `Youth Night`.

### 5. Fill in Start Time

**Type** the time the event starts. Use the format `6:30 PM` or `9:00 AM` — include the space before AM/PM and capital letters.

### 6. Fill in Duration (minutes)

**Type** how long the event lasts, in minutes.

- 1-hour event = `60`
- 90-minute event = `90`
- 2-hour event = `120`

### 7. Fill in Location

**Type** the room or building. Examples: `Fellowship Hall`, `Sanctuary`, `Pastor John's Home`, `Online via Zoom`.

### 8. Fill in Description

**Type** one or two sentences. What is it? Who is it for? Anything to bring?

Example: *"A relaxed potluck on the last Sunday of each month right after service. Bring a dish to share — or just yourself."*

### 9. Pick the recurrence type

This is the part that needs careful attention. Find the **When It Recurs** section.

**Click** the **Recurrence Type** dropdown.

**Choose** one of:

- `weekly` — for events that happen every week on the same day.
- `nth-of-month` — for events like "the second Saturday of every month."
- `last-of-month` — for events like "the last Sunday of every month."

### 10. Pick the Day of Week

**Type** a number in the **Day of Week** field:

| Number | Day |
| --- | --- |
| 0 | Sunday |
| 1 | Monday |
| 2 | Tuesday |
| 3 | Wednesday |
| 4 | Thursday |
| 5 | Friday |
| 6 | Saturday |

So for **Wednesday** Bible Study, you'd type `3`. For a **Saturday** Men's Breakfast, you'd type `6`.

> **Tip:** Sunday is `0`, not `7`. The numbering starts at zero — that's a computer thing.

### 11. (Only if you picked `nth-of-month`) Fill in Which week

If you chose **nth-of-month** in step 9, **type** the week number in the **Which week of the month** field:

- `1` = first (e.g. "first Saturday")
- `2` = second (e.g. "second Saturday")
- `3` = third
- `4` = fourth
- `5` = fifth (rare — only 4 months a year have a fifth occurrence of a given weekday)

If you chose **weekly** or **last-of-month**, **leave** this field blank.

### 12. Turn on RSVPs (if needed)

If you want visitors to RSVP for this event (useful for things like a potluck where you need a headcount):

**Click** the **Needs RSVP?** toggle to turn it on.

This adds an RSVP button to the event's calendar entry.

If RSVPs aren't needed (like for regular Sunday service), **leave** the toggle off.

### 13. Save

**Click** the **Save** button at the top of the page.

TinaCMS commits the change directly to the site. Within 2-3 minutes, the new event will appear on the calendar for every future occurrence.

## Common Mistakes

- **Event appears on the wrong day of the week.** You used the wrong number. Sunday is `0`, Monday is `1`, Saturday is `6`. Re-check the table above.
- **Event shows up every Saturday instead of the second Saturday.** You picked `weekly` instead of `nth-of-month`. Change the **Recurrence Type** and fill in **Which week of the month**.
- **You picked nth-of-month but didn't fill in Which week.** The event won't appear at all. Open the event and pick a number 1-5.
- **The event time looks odd (`19:00` instead of `7:00 PM`).** Always use 12-hour format with AM or PM.

## What's next?

- [Update service times](./05-update-service-times.md) — for the regular Sunday service time.
- [Publishing changes](./08-publishing-changes.md) — what happens between **Publish** and the change being live.

## Stuck?

- [Troubleshooting](./troubleshooting.md) — common problems and fixes.
- **Ask your church's tech volunteer.** They can sit next to you, share screens, or look over the problem with you. This is your fastest path to help.
- If you'd rather report something in writing: [open a GitHub issue](https://github.com/kbennett2000/church-site-template/issues) (this is the tech-volunteer route — your tech volunteer can help you do it if needed).

---
*Was this helpful? [Tell us how to improve this doc](https://github.com/kbennett2000/church-site-template/issues/new?template=docs-feedback.md&title=Feedback:%20Add%20an%20Event).*
