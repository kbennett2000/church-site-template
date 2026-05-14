import type { LucideIcon } from "lucide-react";
import {
  HandHeart,
  Baby,
  BookOpenCheck,
  Music,
  Coffee,
  Sliders,
  UtensilsCrossed,
  HandHelping,
} from "lucide-react";

export type ServeRole = {
  id: string;
  title: string;
  team: string;
  commitment: string;
  training: string;
  description: string;
  icon: LucideIcon;
};

export const serveRoles: ServeRole[] = [
  {
    id: "greeter",
    title: "Greeter",
    team: "Welcome Team",
    commitment: "1 Sunday a month · arrive 8:30 AM",
    training: "30-minute onboarding; shadow a Sunday before serving solo.",
    description:
      "First face our guests see. Hold the door, say hello, and help people find what they need.",
    icon: HandHelping,
  },
  {
    id: "kids-checkin",
    title: "Kids Check-In",
    team: "Kids Ministry",
    commitment: "Every other Sunday · 8:30–9:15 AM",
    training: "Background check + 1-hour orientation. Tablet walkthrough provided.",
    description:
      "Tag kids in, hand parents their pickup ticket, and keep our front desk welcoming.",
    icon: Baby,
  },
  {
    id: "kids-midweek",
    title: "Kids Midweek Leader",
    team: "Kids Ministry",
    commitment: "Wednesdays · 6:00–8:00 PM · school year",
    training: "Leader training before the season starts. Curriculum provided.",
    description:
      "Lead a small group of K–6th graders through Scripture, songs, and games.",
    icon: BookOpenCheck,
  },
  {
    id: "worship-team",
    title: "Worship Team",
    team: "Sunday Worship",
    commitment: "1–2 Sundays a month · Thursday rehearsal",
    training: "Audition + one rehearsal. Vocalists and instrumentalists welcome.",
    description:
      "Help lead the congregation in singing. Vocalists, acoustic guitar, bass, keys, drums.",
    icon: Music,
  },
  {
    id: "hospitality",
    title: "Hospitality",
    team: "Welcome Team",
    commitment: "1–2 Sundays a month · 8:00–10:30 AM",
    training: "Quick walkthrough — no special skills required.",
    description: "Brew the coffee, set up the snack table, restock during fellowship.",
    icon: Coffee,
  },
  {
    id: "tech",
    title: "Tech Booth",
    team: "Production",
    commitment: "1–2 Sundays a month · arrive 7:45 AM",
    training: "2–3 Sundays shadowing. We'll teach you the boards.",
    description: "Run sound, slides, or the livestream. Great for the technically curious.",
    icon: Sliders,
  },
  {
    id: "wed-supper",
    title: "Wednesday Supper Crew",
    team: "Hospitality",
    commitment: "Wednesdays · 4:00–6:00 PM",
    training: "Food handler card encouraged — we'll help you get one.",
    description: "Prep and serve the family meal before midweek programs.",
    icon: UtensilsCrossed,
  },
  {
    id: "prayer-team",
    title: "Prayer Team",
    team: "Pastoral Care",
    commitment: "1 Sunday a month · stay 15 min after service",
    training: "Pastoral conversation + 1-hour training on praying for people.",
    description: "Stand at the front after the service. Pray with anyone who comes forward.",
    icon: HandHeart,
  },
];
