export type PrayerRequest = {
  id: string;
  initials: string;
  request: string;
  daysAgo: number;
};

export const prayerWall: PrayerRequest[] = [
  {
    id: "1",
    initials: "K. M.",
    request:
      "My dad is having heart surgery on Tuesday. Praying for the surgeons and for peace for our family.",
    daysAgo: 1,
  },
  {
    id: "2",
    initials: "Anonymous",
    request:
      "Job interview Thursday after six months looking. Asking God for favor and clarity.",
    daysAgo: 2,
  },
  {
    id: "3",
    initials: "S. R.",
    request:
      "Thanks for praying for our daughter — she came home this weekend and we talked for the first time in months. God is faithful.",
    daysAgo: 4,
  },
  {
    id: "4",
    initials: "Anonymous",
    request:
      "Marriage is in a hard place right now. Both of us are trying. Pray for wisdom and softer hearts.",
    daysAgo: 5,
  },
  {
    id: "5",
    initials: "J. D.",
    request:
      "Our youngest starts kindergarten next week. Pray for her — and honestly, for me.",
    daysAgo: 6,
  },
];
