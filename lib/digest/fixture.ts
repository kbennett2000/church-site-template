import type { DigestPayload, DigestSettings } from "./types";

/**
 * Static fixture data for digest preview rendering when the CMS has nothing
 * yet. Useful for theme development and for the admin preview's "show with
 * fixture" toggle.
 */
export function fixturePayload(settings: DigestSettings, siteUrl = "https://example.church"): DigestPayload {
  return {
    weekStart: "2026-05-11",
    weekEnd: "2026-05-17",
    churchName: "Grace Community Church",
    settings,
    siteUrl,
    note: {
      id: "2026-05-11",
      weekOf: "2026-05-11",
      title: "A Note from Pastor Sarah",
      signedBy: "Pastor Sarah",
      status: "ready",
      bodyHtml: "<p>Friends, what a gift it is to walk through these weeks together. I've been thinking about hospitality — not the kind that prepares the perfect table, but the kind that opens the door even when the kitchen is a mess. May we be that kind of church this week.</p><p>Grateful for all of you,<br/>Pastor Sarah</p>",
      bodyText: "Friends, what a gift it is to walk through these weeks together. I've been thinking about hospitality — not the kind that prepares the perfect table, but the kind that opens the door even when the kitchen is a mess. May we be that kind of church this week.\n\nGrateful for all of you,\nPastor Sarah",
    },
    announcements: [
      {
        id: "2026-05-12-welcome",
        title: "Welcome to Our Church Website",
        date: "2026-05-12",
        pinned: true,
        link: "/visit",
        linkLabel: "Plan a visit",
        body: "We're glad you're here. New to the church? Check out our visit page — we'd love to meet you in person this Sunday.",
      },
      {
        id: "2026-05-10-sunday-fellowship",
        title: "Stay for Coffee This Sunday",
        date: "2026-05-10",
        pinned: false,
        body: "Coffee, snacks, and conversation in the lobby right after the service.",
      },
      {
        id: "2026-05-08-volunteer-signup",
        title: "Volunteer Signups Open",
        date: "2026-05-08",
        pinned: false,
        link: "/connect/serve",
        linkLabel: "See where to serve",
        body: "We're looking for help on the welcome team, kids ministry, and worship team.",
      },
    ],
    events: [
      {
        id: "service-0-2026-05-17",
        title: "Sunday Service",
        date: "2026-05-17",
        time: "10:00 AM",
        durationMinutes: 75,
        location: "Main Sanctuary",
        description: "Worship and a message.",
        isRecurring: true,
      },
      {
        id: "wednesday-bible-study-2026-05-13",
        title: "Wednesday Bible Study",
        date: "2026-05-13",
        time: "7:00 PM",
        durationMinutes: 60,
        location: "Fellowship Hall",
        description: "Midweek verse-by-verse study.",
        isRecurring: true,
      },
    ],
    sermons: [
      {
        id: "2026-05-10-walking-in-faith-part-6",
        title: "Walking in Faith — Part 6",
        series: "Walking in Faith",
        speaker: "Pastor Alex Morgan",
        date: "2026-05-10",
        scripture: "Hebrews 11:1-16",
        book: "Hebrews",
        description: "The final message in our six-part series on what faith looks like in everyday life.",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "/images/placeholders/hero.svg",
        audioUrl: "#",
        notesUrl: "#",
      },
    ],
  };
}
