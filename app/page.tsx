import { Hero } from "@/components/sections/hero";
import { NewHere } from "@/components/sections/new-here";
import { LatestSermon } from "@/components/sections/latest-sermon";
import { ThisWeek } from "@/components/sections/this-week";
import { Announcements } from "@/components/sections/announcements";
import { MinistriesGrid } from "@/components/sections/ministries-grid";
import { BeliefsTeaser } from "@/components/sections/beliefs-teaser";
import { Newsletter } from "@/components/sections/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewHere />
      <LatestSermon />
      <ThisWeek />
      <Announcements />
      <MinistriesGrid />
      <BeliefsTeaser />
      <Newsletter />
    </>
  );
}
