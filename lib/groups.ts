// Small-group placeholder data. Replace these examples with your church's
// actual small groups, or migrate this to a CMS collection if you want
// editors to manage groups in the browser.
//
// The leader photo is optional — leave the field empty to use the SVG
// avatar fallback that the GroupsFinder component handles.

export type Group = {
  id: string;
  name: string;
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  time: string;
  neighborhood: string;
  lifeStage:
    | "Young Adults"
    | "Couples"
    | "Men"
    | "Women"
    | "Moms"
    | "Mixed"
    | "Empty Nesters";
  leader: string;
  leaderPhoto: string;
  description: string;
};

export const groups: Group[] = [
  {
    id: "young-adults-monday",
    name: "Young Adults Group",
    day: "Monday",
    time: "6:30 PM",
    neighborhood: "Downtown",
    lifeStage: "Young Adults",
    leader: "Group Leader",
    leaderPhoto: "",
    description: "20s & 30s working through a book of the Bible — dinner included.",
  },
  {
    id: "couples-wednesday",
    name: "Couples Group",
    day: "Wednesday",
    time: "7:00 PM",
    neighborhood: "North Side",
    lifeStage: "Couples",
    leader: "Group Leader",
    leaderPhoto: "",
    description: "Married couples studying Scripture and praying for each other's homes.",
  },
  {
    id: "mens-saturday",
    name: "Men's Saturday Study",
    day: "Saturday",
    time: "7:00 AM",
    neighborhood: "Church · Fellowship Hall",
    lifeStage: "Men",
    leader: "Group Leader",
    leaderPhoto: "",
    description: "Coffee, breakfast, and one chapter at a time. New guys always welcome.",
  },
  {
    id: "womens-tuesday",
    name: "Women's Bible Study",
    day: "Tuesday",
    time: "9:30 AM",
    neighborhood: "South Side",
    lifeStage: "Women",
    leader: "Group Leader",
    leaderPhoto: "",
    description: "After kid drop-off — bring your Bible, your coffee, and your questions.",
  },
  {
    id: "family-friday",
    name: "Friday Family Group",
    day: "Friday",
    time: "6:00 PM",
    neighborhood: "East Side",
    lifeStage: "Mixed",
    leader: "Group Leader",
    leaderPhoto: "",
    description: "Potluck, kids playing in the backyard, parents in the living room.",
  },
  {
    id: "empty-nesters",
    name: "Empty Nesters",
    day: "Thursday",
    time: "6:30 PM",
    neighborhood: "Hilltop",
    lifeStage: "Empty Nesters",
    leader: "Group Leader",
    leaderPhoto: "",
    description: "Stage of life is its own ministry. Honest conversation, deep friendships.",
  },
  {
    id: "moms-wednesday",
    name: "Moms Together",
    day: "Wednesday",
    time: "10:00 AM",
    neighborhood: "Church · Conference Room",
    lifeStage: "Moms",
    leader: "Group Leader",
    leaderPhoto: "",
    description: "Moms of littles — childcare provided. Coffee, study, and the occasional cry.",
  },
  {
    id: "bible-study-sunday",
    name: "Sunday Evening Bible Study",
    day: "Sunday",
    time: "6:00 PM",
    neighborhood: "West Side",
    lifeStage: "Mixed",
    leader: "Group Leader",
    leaderPhoto: "",
    description: "A deeper dive into the morning's text. Open to anyone, any stage.",
  },
];
