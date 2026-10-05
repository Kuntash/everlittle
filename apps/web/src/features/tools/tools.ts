export type ToolContent = {
  id: string;
  path: string;
  name: string;
  eyebrow: string;
  kind: string;
  title: string;
  searchTitle: string;
  summary: string;
  intro: string;
  sections: { title: string; paragraphs: string[]; list?: string[] }[];
  faq: { question: string; answer: string }[];
  sources?: { label: string; href: string }[];
  ctaTitle: string;
  ctaBody: string;
  related: { href: string; label: string; title: string; kind: string }[];
};

export const tools: ToolContent[] = [
  {
    id: "time-with-your-kids",
    path: "/tools/time-with-your-kids",
    name: "Time with your kids calculator",
    eyebrow: "Calculator",
    kind: "Milestone",
    title: "How many summers and weekends until your child turns 18?",
    searchTitle: "18 Summers Calculator: Time Left With Your Kids Before 18",
    summary:
      "Count the summers, weekends, birthdays and bedtimes between today and your child’s eighteenth birthday.",
    intro:
      "Enter a birthday to count the summers, weekends, birthdays and bedtimes between today and the day your child turns 18, and see the 936 weeks of childhood filled in so far.",
    sections: [
      {
        title: "How the numbers are counted",
        paragraphs: [
          "Everything here is calendar arithmetic from the birthday you enter to the eighteenth birthday. Bedtimes are the days remaining. Weekends are the whole weeks remaining. Birthdays include the eighteenth. A summer is counted if it starts before the eighteenth birthday and has not finished yet, using June to August, or December to February if you choose the southern hemisphere.",
          "The 936-square grid illustrates 18 years of 52 weeks. The exact calendar interval is about 939 weeks because years have extra days. The grid is a visual approximation; the countdown uses the actual birthday dates.",
        ],
      },
      {
        title: "What “18 summers” gets wrong",
        paragraphs: [
          "The phrase is a useful nudge and a poor prediction. Family life does not stop at eighteen. Adult children come home, travel with their parents and call on Sundays, and many parents say the relationship gets better. A count of weekends also says nothing about how those weekends are spent.",
          "What does change is the kind of time. Parents spend far more hours with young children than with teenagers, and the daily texture of early childhood, the mispronounced words and the bedtime routines, is over long before eighteen. That is the honest reason to pay attention now.",
          "You will often see it claimed that parents have spent 75% of their time with a child by age 12, or 90% by 18. We could not trace those figures to a primary source, so this calculator does not use them.",
        ],
      },
      {
        title: "A gentler way to use the number",
        paragraphs: [
          "Do not try to make every weekend count. Pick one small thing to keep from this week: a sentence they said, a photograph of an ordinary breakfast, thirty seconds of their voice. Those are the details that are hardest to reconstruct later.",
        ],
      },
    ],
    faq: [
      {
        question: "Where does “18 summers” come from?",
        answer:
          "It is a popular saying that a child spends about eighteen summers at home before adulthood. It is a rule of thumb, not a research finding.",
      },
      {
        question: "How many weekends are there in 18 years?",
        answer:
          "About 936, which is 18 years of 52 weeks. A six-year-old has roughly 624 left before eighteen.",
      },
      {
        question: "Is anything I enter saved?",
        answer:
          "Inputs stay in your browser. If you copy a result link, it includes the name and birthday you entered in its fragment so the recipient can see the same result. Share that link only with people you choose.",
      },
    ],
    ctaTitle: "Keep one thing from this weekend.",
    ctaBody: "A photo, a sentence or their voice, saved where the family can find it later.",
    related: [
      {
        href: "/baby-firsts-checklist",
        label: "Checklist",
        title: "90 firsts worth recording",
        kind: "Milestone",
      },
      {
        href: "/tools/how-old-will-i-be",
        label: "Calculator",
        title: "How old will I be when my child is 18?",
        kind: "Story",
      },
    ],
  },
  {
    id: "graduation-year",
    path: "/tools/graduation-year-calculator",
    name: "Graduation year calculator",
    eyebrow: "Calculator",
    kind: "Keepsake",
    title: "What year will my child graduate high school?",
    searchTitle: "Graduation Year Calculator: What Class Will My Child Be?",
    summary:
      "Find your child’s kindergarten start year, their high school “Class of” and the grade they will be in each year.",
    intro:
      "Enter a birthday to find the year your child starts kindergarten, their high school and college “Class of”, and which grade they will be in each school year.",
    sections: [
      {
        title: "How graduation year is worked out",
        paragraphs: [
          "In the United States a child usually starts kindergarten in the autumn of the year they are five on or before a cutoff date. They finish twelfth grade thirteen school years later, so the high school class year is the kindergarten start year plus 13. A four-year college degree adds four more.",
          "A baby born in March 2026 with a 1 September cutoff starts kindergarten in autumn 2031 and is in the Class of 2044.",
        ],
      },
      {
        title: "Check your own cutoff date",
        paragraphs: [
          "The cutoff varies. Many states use 1 September, others use dates from late July to the end of the year, and a few leave the decision to school districts. This calculator defaults to 1 September and lets you choose a different date. Confirm the date with your state education department or school district before relying on the result.",
          "The result is the typical path. Starting a year late, transitional kindergarten, skipping or repeating a grade all move the class year. School systems outside the United States are organised differently.",
        ],
      },
      {
        title: "A letter for graduation day",
        paragraphs: [
          "Knowing the year makes it real. Many parents write a short letter now, describing who their child is today, and save it to be opened on graduation day. It takes ten minutes and it gives them a personal memory to read alongside the congratulations.",
        ],
      },
    ],
    faq: [
      {
        question: "What year will a baby born in 2026 graduate high school?",
        answer:
          "With a 1 September cutoff, a child born from January to 1 September 2026 is typically in the Class of 2044, and a child born later in 2026 is typically in the Class of 2045.",
      },
      {
        question: "How old are most students when they graduate high school?",
        answer:
          "Most are 17 or 18. A child with a birthday shortly before the cutoff will usually be among the youngest in the class and may graduate at 17.",
      },
      {
        question: "Does this work outside the United States?",
        answer:
          "It follows the US kindergarten-to-twelfth-grade structure. Other countries use different starting ages and year names, so treat the result as a rough guide only.",
      },
    ],
    ctaTitle: "Write something for graduation day.",
    ctaBody: "Save a letter now and choose the date it opens.",
    related: [
      {
        href: "/time-capsule-letter-to-child-examples",
        label: "Examples",
        title: "Time capsule letter examples and a template",
        kind: "Letter",
      },
      {
        href: "/tools/time-capsule-letter-prompts",
        label: "Prompt generator",
        title: "Prompts for a letter to your child",
        kind: "Letter",
      },
    ],
  },
  {
    id: "birthday-interview",
    path: "/tools/birthday-interview-questions",
    name: "Birthday interview question generator",
    eyebrow: "Printable",
    kind: "Voice",
    title: "Birthday interview questions for your child, ready to print",
    searchTitle: "Birthday Interview Questions for Kids: Free Printable Generator",
    summary:
      "Build a printable birthday interview for your child’s age, with a core set of questions to repeat every year.",
    intro:
      "Choose your child’s age and get a printable birthday interview: ten questions to repeat every year, plus extras that suit their age. No email needed.",
    sections: [
      {
        title: "Why the first ten questions never change",
        paragraphs: [
          "A birthday interview is valuable because of the comparison. Asking the same questions in the same words every year lets you see the favorite color change, the best friend change and the answer to “what do you want to be?” travel from dinosaur to marine biologist.",
          "For ages 2 to 3, the core is shortened to the first five questions. The remaining questions are chosen for the age you select. Press “New extras” to swap them.",
        ],
      },
      {
        title: "How to run the interview",
        paragraphs: [
          "Choose a calm moment within a week of the birthday. Record it on your phone as well as writing the answers down, and say the date and their age at the start. Accept every answer exactly as given.",
        ],
        list: [
          "Ages 2 to 3: five questions is plenty, and pointing counts as an answer",
          "Ages 4 to 6: ask everything, and follow up with “why?”",
          "Ages 7 to 10: let them ask you a question back",
          "Teens: offer to let them fill it in alone",
        ],
      },
    ],
    faq: [
      {
        question: "At what age can you start a birthday interview?",
        answer:
          "Most children can answer a few simple questions from about two and a half or three. Before that, record a short video of them playing and describe what they are doing.",
      },
      {
        question: "How many questions should I ask?",
        answer:
          "Ten to twenty. Younger children manage five to ten before they wander off, and that is enough.",
      },
      {
        question: "Can I use this for the first day of school?",
        answer: "Yes. The same questions work well on the first and last day of each school year.",
      },
    ],
    ctaTitle: "Keep their answers in their own voice.",
    ctaBody: "Save each year’s interview on your child’s timeline and listen back next birthday.",
    related: [
      {
        href: "/birthday-interview-questions-for-kids",
        label: "Guide",
        title: "Birthday interview questions for kids, by age",
        kind: "Voice",
      },
      {
        href: "/letter-to-my-baby-on-first-birthday",
        label: "Examples",
        title: "A letter to my baby on their first birthday",
        kind: "Letter",
      },
    ],
  },
  {
    id: "how-old-will-i-be",
    path: "/tools/how-old-will-i-be",
    name: "Family age timeline",
    eyebrow: "Calculator",
    kind: "Story",
    title: "How old will I be when my child is 18?",
    searchTitle: "How Old Will I Be When My Child Is 18? Parent and Child Age Calculator",
    summary:
      "See how old you, your partner and the grandparents will be at each of your child’s milestones.",
    intro:
      "Enter your child’s birthday and the birthdays of the adults in their life to see everyone’s age when your child starts school, turns 18, turns 30 and more.",
    sections: [
      {
        title: "How to read the timeline",
        paragraphs: [
          "Each row is a moment in your child’s life. Each column shows how old that person will be on that day, counted in completed years. The first row answers the reverse question: how old each adult was on the day your child was born.",
          "Add a grandparent to see the ages that are easy to avoid thinking about. A grandfather who is 66 at the birth is 71 on the first day of school and 84 at the eighteenth birthday.",
        ],
      },
      {
        title: "What to do with it",
        paragraphs: [
          "The table is plain arithmetic, but it is a good prompt. If a grandparent will be in their eighties when your child is old enough to ask real questions, record a few of the answers now. Ten minutes of a grandparent telling one story, in their own voice, is the kind of thing families wish they had.",
        ],
      },
    ],
    faq: [
      {
        question: "How do I work out how old I will be when my child turns 18?",
        answer:
          "Add 18 to the age you were on the day your child was born. If you were 31 at the birth, you will be 49 on their eighteenth birthday.",
      },
      {
        question: "How old were my parents when I was born?",
        answer:
          "Enter your own birthday as the child and your parents’ birthdays as the adults. The first row shows their ages on the day you were born.",
      },
    ],
    ctaTitle: "Ask for one story while you can.",
    ctaBody: "Invite a grandparent to add a voice note or a letter to your family archive.",
    related: [
      {
        href: "/grandparents-memory-project",
        label: "Guide",
        title: "The stories only your grandparents can tell",
        kind: "Voice",
      },
      {
        href: "/tools/time-with-your-kids",
        label: "Calculator",
        title: "Summers and weekends until 18",
        kind: "Milestone",
      },
    ],
  },
  {
    id: "baby-milestone-dates",
    path: "/tools/baby-milestone-dates",
    name: "Baby milestone date calculator",
    eyebrow: "Calculator",
    kind: "Milestone",
    title: "When will my baby be 100 days old?",
    searchTitle: "Baby Milestone Date Calculator: 100 Days, Half Birthday, 1,000 Days",
    summary:
      "Find the dates of your baby’s 100th day, monthly birthdays, half birthday and 1,000th day, and add them to your calendar.",
    intro:
      "Enter a birth date to see your baby’s exact age today and the dates of every monthly birthday, the 100th day, the half birthday and the 1,000th day. Download them to your calendar in one file.",
    sections: [
      {
        title: "How the dates are counted",
        paragraphs: [
          "Monthly birthdays fall on the same day of each month. If a baby was born on the 29th, 30th or 31st and a month is too short, the last day of that month is used. The half birthday is six calendar months after birth.",
          "For the 100th day, the day of birth is counted as day 1, which is how most 100-day celebrations count, including the Korean baek-il. Some families count the day after birth as day 1, which makes the date one day later. The 500- and 1,000-day dates count full days since birth.",
        ],
      },
      {
        title: "Dates worth a photograph",
        paragraphs: [
          "Monthly photographs are easier to keep up if the date is already in your calendar. Use the same chair, blanket or toy each month so the growth is obvious. Add one sentence about what is new.",
          "These are calendar dates for celebrating and remembering. They are not developmental milestones. For questions about your baby’s development, including adjusted age for babies born early, ask your pediatrician.",
        ],
      },
    ],
    faq: [
      {
        question: "How do I calculate 100 days from my baby’s birth?",
        answer:
          "Count the day of birth as day 1 and add 99 days. A baby born on 1 January reaches day 100 on 10 April, or 9 April in a leap year.",
      },
      {
        question: "When is 1,000 days old?",
        answer:
          "1,000 days is about two years and nine months after birth. The calculator gives the exact date.",
      },
      {
        question: "What is a golden birthday?",
        answer:
          "It is the birthday when the age matches the day of the month, such as turning 7 on the 7th.",
      },
    ],
    ctaTitle: "Save a memory on each of these days.",
    ctaBody: "A photograph and one sentence, kept on your baby’s timeline.",
    related: [
      {
        href: "/baby-firsts-checklist",
        label: "Checklist",
        title: "90 baby firsts worth recording",
        kind: "Milestone",
      },
      {
        href: "/baby-book-alternatives",
        label: "Guide",
        title: "Baby book alternatives for busy parents",
        kind: "Story",
      },
    ],
  },
  {
    id: "letter-prompts",
    path: "/tools/time-capsule-letter-prompts",
    name: "Letter-to-my-child prompt generator",
    eyebrow: "Prompt generator",
    kind: "Letter",
    title: "Prompts for a letter to your child",
    searchTitle: "Letter to My Child Prompts: Free Time Capsule Letter Generator",
    summary:
      "Get an opening line and a set of prompts for a letter to your child, matched to their age, the occasion and who is writing.",
    intro:
      "Tell us who is writing, how old the child is and the occasion. You will get an opening line, six prompts and a closing line for a letter they can open later.",
    sections: [
      {
        title: "How to use the prompts",
        paragraphs: [
          "Answer each prompt in two or three sentences, in order, and you will have a full letter. Skip any that do not fit. Specific beats beautiful: the name of the stuffed rabbit matters more than a line about how fast time goes.",
          "Add the date and where you are writing at the top. Sign it the way your child knows you.",
        ],
      },
      {
        title: "When should they open it?",
        paragraphs: [
          "Eighteen is traditional. A tenth birthday, the first day of high school, graduation or the day they become a parent all work. Write the opening date on the envelope or set it on a digital capsule, and tell another adult where the letter is.",
        ],
      },
    ],
    faq: [
      {
        question: "How long should a letter to my child be?",
        answer:
          "Half a page to a page. A short letter that gets written is worth more than a long one that does not.",
      },
      {
        question: "What should a grandparent write?",
        answer:
          "Who you are, one story about the child’s parent when they were young and what you felt when the child arrived. Choose “Grandparent” above for prompts that fit.",
      },
    ],
    ctaTitle: "Write it where it will not get lost.",
    ctaBody: "Save your letter with an opening date, and add your voice reading it.",
    related: [
      {
        href: "/time-capsule-letter-to-child-examples",
        label: "Examples",
        title: "Time capsule letter examples and a template",
        kind: "Letter",
      },
      {
        href: "/letter-to-my-grandchild",
        label: "Examples",
        title: "What to write in a letter to your grandchild",
        kind: "Letter",
      },
    ],
  },
];

export function findTool(id: string) {
  return tools.find((tool) => tool.id === id)!;
}

const ORIGIN = "https://geteverlittle.com";
const SOCIAL_IMAGE = `${ORIGIN}/marketing/family-album-us.jpg`;

export function toolHead(id: string, stylesheets: string[]) {
  const tool = findTool(id);
  const url = `${ORIGIN}${tool.path}`;
  const title = `${tool.searchTitle} | Everlittle`;
  return {
    links: [
      { rel: "canonical", href: url },
      ...stylesheets.map((href) => ({ rel: "stylesheet", href })),
    ],
    meta: [
      { title },
      { name: "description", content: tool.intro },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: tool.intro },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Everlittle" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          description: tool.intro,
          url,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "Everlittle", url: ORIGIN },
        },
      },
    ],
  };
}

export function toolsHubHead(stylesheets: string[]) {
  const title = "Free Tools for Parents and Grandparents | Everlittle";
  const description =
    "Free calculators and printable prompt generators for families: time until 18, graduation year, baby milestone dates, birthday interviews and letters to your child.";
  return {
    links: [
      { rel: "canonical", href: `${ORIGIN}/tools` },
      ...stylesheets.map((href) => ({ rel: "stylesheet", href })),
    ],
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${ORIGIN}/tools` },
      { property: "og:site_name", content: "Everlittle" },
      { property: "og:image", content: SOCIAL_IMAGE },
    ],
  };
}
