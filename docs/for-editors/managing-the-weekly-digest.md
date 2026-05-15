---
title: "Managing the Weekly Digest"
type: how-to
---

# Managing the Weekly Digest

The weekly digest is a single email that goes out once a week. It pulls together everything a member would want a quick recap of, so people who can't keep up with daily emails still feel connected.

Each digest is composed **automatically** from content already in the CMS — you don't have to write the email itself. Your only optional editorial input is a short pastor's note (see below).

---

## What's in each digest

The send job pulls together four sections. Each section only appears if it has something to show:

| Section | Source | Hide condition |
|---|---|---|
| **Pastor's note** | The most recent "Pastor's Note" in the CMS with status `Ready` for this week | Section disappears if there's no Ready note |
| **Announcements** | Active announcements posted in the last 7 days | Section disappears if there are no recent announcements |
| **Upcoming events** | Calendar events in the next 10 days (or whatever lookahead is configured) | Section disappears if nothing is scheduled |
| **Recent sermon** | The most recent sermon(s) added to the CMS | Section disappears if there are no sermons in the system |

If **all four** sections are empty, the send job skips this week entirely and logs "no content to send." No empty digest is mailed.

---

## Writing a pastor's note

1. In the CMS, go to **Pastor's Notes (Digest)** in the left sidebar.
2. Click **New Note**.
3. Fill in the fields:
   - **Week Of** — the Monday of the week you want the note to appear in. The send job uses this to match the note to the right week.
   - **Title** *(optional)* — shown above the note. Example: "A Note from Pastor Sarah". If you leave this blank, the section just shows the body.
   - **Signed By** *(optional)* — shown below the note. Example: "Pastor Sarah" or "The GCC Staff". Leave blank if you don't want a signature line.
   - **Status** — choose **Ready** to include in the next send. Use **Draft** while you're still writing.
4. Write your note in the body. Aim for 2–4 sentences. Warm, personal, brief — this is the part readers look forward to most.
5. Click **Save**.

The note will appear in the next digest send for that week.

### After the digest sends

There's nothing you *have* to do — the send only happens once per week and is locked by week, so a stray "Ready" note from last week can't accidentally send twice. But for tidiness, you can mark the note as **Sent** after delivery.

### What if you forget to write a note?

Nothing breaks. The pastor's note section is simply omitted from that week's digest. There's no "no note this week" placeholder, no awkward filler. The other sections still send normally.

---

## Previewing this week's digest

You can see exactly what would be sent at any time by visiting `/admin/digest/preview` on your site. The preview page shows:

- A rendered preview of the email (identical to what subscribers will receive).
- A sidebar telling you which sections are populated, how many subscribers will receive it, and when the next scheduled send is.
- A **Send test to my email** button so you can see it in your actual inbox before it goes out to everyone.

The preview is gated by the same admin password used for the other admin tools — your tech volunteer will have set this up.

---

## Turning the digest on or off

In the CMS, go to **Digest Email Settings** → toggle **Enable Weekly Digest**.

Use this for short pauses — for example, during a holiday week when you don't want the auto-send to fire, but you don't want to disable the whole feature.

For longer pauses (weeks or months), ask your tech volunteer to turn off the `digest` feature flag in **Site Settings → Feature Flags**.

---

## Changing the send day or time

In the CMS → **Digest Email Settings**:

- **Send Day** — pick a weekday (Sunday–Saturday).
- **Send Hour** — 0–23, in your church's timezone. `14` = 2 PM.
- **Church Timezone** — IANA timezone string. Examples: `America/Denver`, `America/New_York`, `Pacific/Honolulu`. Ask your tech volunteer if you're not sure.

Changes take effect immediately. The next cron run after the new send time will fire.

---

## Subscribers

People sign up at `/digest` or `/digest/subscribe`. Subscribers get a verification email; once they click the link, they start receiving digests.

The admin dashboard at `/admin/digest` shows:

- How many subscribers you currently have
- The next scheduled send
- A history of recent sends with delivery stats

Subscribers can manage their preferences or unsubscribe at any time using links in every digest.

---

## Troubleshooting

**"I marked a note as Ready but it didn't show up in the digest."**
Check that the **Week Of** date is set to the Monday of the *current* week (or the upcoming send week). The send job only includes notes whose `weekOf` falls inside the digest window. If you set it to a date outside that window (e.g., next month), it'll wait until then.

**"The digest didn't send this week."**
Visit `/admin/digest` and check the **Recent sends** table. If there's no row for this week, the cron either hasn't fired yet (wait until the configured day/hour), the feature was disabled, or every section was empty. The send log surfaces a `skipReason` for empty-content skips.

**"I want to send the digest right now, not wait for the scheduled time."**
Use the manual trigger described in the tech volunteer guide. You'll need admin access.
