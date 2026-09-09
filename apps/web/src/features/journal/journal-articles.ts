export type JournalArticle = {
  id: string;
  category: string;
  kind: string;
  title: string;
  intro: string;
  minutes: number;
  published?: string;
  lede?: string;
  relatedIds?: string[];
  sectionLinks?: Record<number, { href: string; label: string }[]>;
  quote?: string;
  sectionTitles: string[];
  paragraphs: string[][];
};

export const articles: JournalArticle[] = [
  {
    id: "grandparent-sharing",
    category: "Family stories",
    kind: "Photo",
    title: "How to share photos with grandparents privately",
    intro:
      "Choose between a quick photo update, an invited family archive and a single-memory link—with a practical setup guide for Everlittle.",
    minutes: 4,
    published: "2026-09-10",
    lede: "For regular updates, invite grandparents into a family archive so they have one place to return to. For an occasional photo, a direct message may be enough. In either case, agree on whether pictures can be forwarded before you start sharing.",
    quote: "The best place to share a photo is one your family can comfortably return to.",
    relatedIds: ["private-sharing", "grandparents"],
    sectionTitles: [
      "Choose a way to share that fits your family",
      "Set up a private family archive in Everlittle",
      "Help a grandparent open the first invitation",
      "Share one memory without opening the archive",
      "Keep the story with the photograph",
      "Check costs, access and backups before committing",
    ],
    paragraphs: [
      [
        "Start with what the recipient needs. A direct message is useful for a small update to someone who already uses that messaging app. An invited archive is useful when relatives want to revisit dated memories and add their own. A single-memory link is useful for showing one item to someone outside the archive.",
        "These options have different boundaries. An archive invitation gives a person the access associated with their role. A public link can be opened by anyone who receives it, including someone it was forwarded to. Neither prevents a viewer from taking a screenshot. Agree on forwarding and posting photos elsewhere.",
      ],
      [
        "Create your Everlittle account and family archive, then choose a paid plan before adding memories. Add a photo with a date and a sentence explaining what happened. Starting with one familiar moment gives your relative something specific to look at.",
        "In the family settings, invite the grandparent by email. Choose Viewer if they should only view the memories available to them, or Contributor if you want them to add memories too. Review each memory’s audience: joining the family does not mean every person should see every entry.",
        "Everlittle works in a web browser. This guide does not require an iPhone or Android app download. Open the archive on the device your relative will actually use and check that text, pictures and playback are comfortable for them.",
      ],
      [
        "Send a short message separately so the invitation is expected: “I sent you an Everlittle invitation by email. It is where we are keeping family photos and stories. Open the invitation and follow the account steps. We can try the first photo together.”",
        "If the email is missing, check the address and spam folder, then resend the invitation from family settings. If the link has expired, send a fresh invitation. Keep passwords and access details out of a group conversation.",
        "Once they can open the archive, bookmark it in their browser. Ask them to find the first memory on their own. That small check is more useful than assuming that a successfully sent invitation means the setup is finished.",
      ],
      [
        "The author of a memory can enable a public link from its sharing options. Copy the link or use Share to an app. The recipient can view that single memory without joining the archive; the rest of the family archive remains protected.",
        "Everlittle’s public-memory links expire after 30 days and the author can disable sharing earlier. Anyone with a working link can view it, so use an invitation instead when you need access tied to a family member. Disabling a link cannot remove copies or screenshots someone already made.",
        "Before sending, check the memory’s photo, title, story and names. The shared page includes the child’s name and author attribution. Choose another photo if it shows details you would not want forwarded.",
      ],
      [
        "Pick a small number of photos rather than uploading every near-identical frame. Add the date, who was there and a detail the picture cannot show. For example: “You asked Grandpa to read the same page three times because you liked the sound of the train.”",
        "Invite a response that is easy to make: “What do you remember about that afternoon?” A relative with Contributor access can add a memory of their own. With permission, a voice recording can keep their way of telling a story as well as the words.",
        "There is no required posting schedule. A short update when you have something to share is better than a routine that becomes another obligation.",
      ],
      [
        "As of 10 September 2026, Everlittle’s family plan is $6 per month or $60 per year with 25 GB of storage. Account creation is free; adding memories requires a paid plan. Check the pricing page for current terms before subscribing.",
        "Keep a separate copy of irreplaceable original photos and recordings. Review the archive’s export options and who has access from time to time. Start with a few memories before deciding whether the arrangement works for your whole family.",
      ],
    ],
    sectionLinks: {
      "3": [
        {
          href: "/private-family-photo-sharing",
          label: "Read the private family photo-sharing guide",
        },
      ],
      "4": [
        {
          href: "/grandparents-memory-project",
          label: "Questions for recording grandparents’ stories",
        },
      ],
      "5": [
        {
          href: "/pricing",
          label: "See Everlittle’s plans and storage allowance",
        },
        {
          href: "/family-memory-app",
          label: "What to check when choosing a family memory app",
        },
      ],
    },
  },
  {
    id: "little-journal",
    category: "Everyday memories",
    kind: "Story",
    title: "A baby memory journal for real life",
    intro: "You don’t need a perfect routine. You only need a little place to begin.",
    minutes: 2,
    sectionTitles: [
      "Begin with something ordinary",
      "Make the first entry small",
      "Let the gaps be part of the story",
    ],
    paragraphs: [
      [
        "A memory journal can start in the middle of a day. A familiar expression, the way they hold your hand, a word they pronounce in their own way. Ordinary details often bring a season back more vividly than its milestones.",
        "Choose one detail from today and write it as if you were telling someone who loves your child. Two sentences are enough. There is no need to turn the moment into a finished story.",
      ],
      [
        "Try three simple pieces: what happened, one detail you noticed, and how it felt to be there. Add a photo if you have one. If you don’t, the words can stand on their own.",
        "“You called the moon a night-light today. We stood at the kitchen window until you were ready for bed.” That is an entire entry.",
      ],
      [
        "Some weeks will have pages of memories. Others will have none. Your archive does not need to account for every day to hold something meaningful.",
        "Come back when a little thing catches your attention. A journal is a place to return to, not another task to keep up with.",
      ],
    ],
  },
  {
    id: "future-letter",
    category: "Letters for later",
    kind: "Letter",
    title: "A letter for the person they’ll become",
    intro: "Write about who they are today, for the person they’ll become.",
    minutes: 2,
    sectionTitles: [
      "Write from right here",
      "Give them a little of yourself",
      "Choose a day, or leave it open",
    ],
    paragraphs: [
      [
        "You do not have to predict who your child will become. Tell them who they are to you today: the questions they ask, the songs they love, the small habits you hope you’ll always remember.",
        "Try starting with “Right now, you…” and follow it wherever it goes.",
      ],
      [
        "A letter can hold more than advice. It can hold what you were learning, what made you laugh, or what surprised you about being in their life.",
        "Be specific. “I love the way you stop to say hello to every dog” gives them a small scene to step into.",
      ],
      [
        "A birthday or a first day away from home can be a lovely time to receive a letter. An ordinary day can be just as right.",
        "Read it once, let it sound like you, and keep it. A sincere sentence means more than a perfect page.",
      ],
    ],
  },
  {
    id: "grandparents",
    relatedIds: ["grandparent-sharing", "future-letter"],
    category: "Family stories",
    kind: "Voice",
    title: "The stories only your grandparents can tell",
    intro: "Simple questions that help family stories find their way out.",
    minutes: 2,
    sectionTitles: [
      "Ask about an ordinary day",
      "Follow their curiosity",
      "Keep their voice with the story",
    ],
    paragraphs: [
      [
        "Big questions can be hard to answer. Start with a small one: What did your kitchen smell like? Who lived next door? What did the walk to school look like?",
        "A practical detail often opens a story you would never have thought to ask for.",
      ],
      [
        "You do not need to finish a list of questions. If a name or a place lights up their face, stay with it. Ask what they remember seeing, hearing, or feeling.",
        "Leave room for silence. Memories sometimes arrive after a pause.",
      ],
      [
        "If everyone is comfortable being recorded, a short voice memory can keep the way they tell the story as well as the words.",
        "Add the date and the names of the people mentioned. A little context helps the next generation find their way into the memory.",
      ],
    ],
  },
  {
    id: "small-firsts",
    category: "Everyday memories",
    kind: "Milestone",
    title: "The small firsts deserve a place, too",
    intro: "Not every milestone makes it into the baby book. That doesn’t make it any less theirs.",
    minutes: 1,
    sectionTitles: [
      "Notice their own milestones",
      "Keep the moment in their words",
      "Make room for the everyday",
    ],
    paragraphs: [
      [
        "The first time they order for themselves. The first joke that makes everyone laugh. The first time they comfort a friend. Growth has its own small landmarks.",
      ],
      [
        "Write down the exact words while you remember them. Let their language lead the story instead of explaining what the moment should mean.",
      ],
      [
        "A milestone can be a photo, a sentence, or a voice recording. Choose what feels easiest today. Add who was there and when it happened, so your child has the context when they return to it.",
      ],
    ],
  },
  {
    id: "photo-story",
    category: "Everyday memories",
    kind: "Photo",
    title: "The story just outside the photograph",
    intro: "A photo keeps what you saw. A sentence keeps what it was like to be there.",
    minutes: 2,
    sectionTitles: [
      "Look beyond the frame",
      "Add a detail you can’t see",
      "Invite another point of view",
    ],
    paragraphs: [
      [
        "Look at a photo you love and think about what happened just before it. What were you talking about? What made you reach for your camera?",
      ],
      [
        "A smell from the kitchen, a song playing nearby, the sound of everyone laughing: these are details a photograph cannot hold on its own.",
      ],
      [
        "Someone else may remember a different part of the same afternoon. Ask, ‘What do you remember about this day?’ Keep their words alongside yours, with their name. Your child will have more than one way into the memory.",
      ],
    ],
  },
  {
    id: "private-sharing",
    sectionLinks: {
      3: [
        {
          href: "/sharing-photos-with-grandparents",
          label: "Set up photo sharing with grandparents, step by step",
        },
      ],
      5: [{ href: "/pricing", label: "Check current plans and pricing" }],
    },
    relatedIds: ["grandparent-sharing", "family-archive"],
    category: "Family stories",
    kind: "Photo",
    title: "How to share family photos privately",
    intro:
      "Learn how invitations, viewing permissions and expiring links differ when sharing family photos privately, and what to check before inviting relatives.",
    minutes: 3,
    published: "2026-09-10",
    lede: "Before you send the next photo, decide who it is for, what they need to know, and where you want to find it years from now.",
    quote: "Share the photograph. Keep the story with it.",
    sectionTitles: [
      "Choose who belongs in the audience",
      "Agree on what stays in the family",
      "Keep the story beside the photograph",
      "Give grandparents a place to contribute",
      "Make a habit you can keep",
      "Choose a home you can leave",
    ],
    paragraphs: [
      [
        "Start with the people you actually want to share with: a partner, grandparents, or a few close relatives. A private archive works best when everyone knows who can enter it.",
        "Look for individual invitations and a way to remove access. A link that anyone can forward is different from an invitation tied to a person. Decide which suits the memory before sharing it.",
      ],
      [
        "A private space is a useful boundary, but someone who can see a photograph can still save or screenshot it. Have a simple conversation with relatives about asking before reposting or forwarding.",
        "For photographs of children, avoid including unnecessary details such as a school address, a daily routine, or a document in the background. As children grow, include them in decisions about which pictures are shared.",
      ],
      [
        "A group chat is convenient for a quick update. A few months later, finding that one photograph can mean scrolling through hundreds of messages. Keep the photographs you want to return to in a place where dates and descriptions stay together.",
        "Add one sentence about what happened before or after the picture. Name the people in it and let the caption sound like you. “Grandpa made the same pancakes he used to make for me” gives a future reader something the image cannot explain.",
      ],
      [
        "For regular photo updates, invite grandparents into the archive by email. In Everlittle, Viewer access is for viewing available memories; Contributor access lets a relative add memories too. Review the audience of each memory before sharing.",
        "For one occasional memory, its author can enable a public link that lasts 30 days and can be disabled earlier. The recipient does not need to join the archive, but anyone who receives the link can open it. This is different from a personal invitation.",
        "A short voice recording can preserve the way they tell the story. Ask permission before recording, and keep their name and a little context with the memory.",
      ],
      [
        "You do not need to upload an entire camera roll. Choose a handful of photographs that say something about your family’s ordinary life. One small entry each time you notice something is enough.",
        "Make it easy for relatives to participate. Send a direct invitation, explain who can see the archive, and suggest one memory they could add. Check that the experience works on the phones they already use.",
      ],
      [
        "Before committing to a service, check its price, storage allowance, privacy controls, and export options. Keeping a separate copy of irreplaceable originals gives you more freedom later.",
        "Everlittle keeps photos, voices, stories, and letters in an invited family archive. You can create an account free; adding memories requires a paid plan, currently $6 monthly or $60 yearly with 25 GB of storage. Choose the arrangement that your family will actually use.",
      ],
    ],
  },
  {
    id: "family-archive",
    relatedIds: ["private-sharing", "grandparent-sharing"],
    category: "Everyday memories",
    kind: "Story",
    title: "What to look for in a family memory app",
    intro: "Choose a place that helps your family keep the context, not just the camera roll.",
    minutes: 2,
    published: "2026-09-10",
    lede: "The right app should make one small memory easier to keep today—and easier to understand later.",
    quote: "A useful archive holds the moment and the people who remember it.",
    sectionTitles: [
      "Start with what you want to keep",
      "Try the experience together",
      "Check privacy and ownership",
      "Know what the plan includes",
    ],
    paragraphs: [
      [
        "A photograph may be enough for one day. On another, you might want a grandparent’s voice, a funny sentence, or a letter for a future birthday. List the kinds of memories you actually make before comparing features.",
        "Look for dates, descriptions, and ways to keep related memories understandable. A child returning to an archive years later may not recognize every person or place.",
      ],
      [
        "Try the service on your phone and on a device a relative uses. Can you add a memory without a tutorial? Is it clear who can see it? Can another person contribute?",
        "Start with a small selection rather than moving your whole collection at once. The experience of keeping a single memory tells you more than a long feature list.",
      ],
      [
        "Check whether access is invitation-only, how shared links work, and whether children have a separate view. Agree with relatives before they share family photographs elsewhere.",
        "Read the export options before uploading irreplaceable originals. Keep a separate copy of important files and consider how you would move them if your needs changed.",
      ],
      [
        "Compare the subscription price, storage allowance, and any limits on contributors or file types. A large allowance is only useful if the app fits your family’s habits.",
        "Everlittle combines photos, voice, video, stories, and future letters in a private archive. Account creation is free; adding memories requires a $6 monthly or $60 yearly plan with 25 GB. Begin when there is something you want to keep, rather than feeling you need a complete family history.",
      ],
    ],
  },
  {
    id: "time-capsule",
    category: "Letters for later",
    kind: "Letter",
    title: "How to make a digital time capsule for your child",
    intro: "Keep a little of today for a day they have not reached yet.",
    minutes: 2,
    published: "2026-09-10",
    lede: "A time capsule can be one letter, a familiar voice, or a few photographs with a story attached.",
    quote: "Write from the day you are in. Let the future arrive in its own time.",
    sectionTitles: [
      "Choose a moment to return to",
      "Include the ordinary details",
      "Invite a few familiar voices",
      "Decide when it opens",
      "Keep a copy and revisit the plan",
    ],
    paragraphs: [
      [
        "A birthday, the first day of school, or an ordinary afternoon can be a starting point. You do not need a major milestone to make a time capsule meaningful.",
        "Decide what you want your child to understand about this season of life. Write from what you know now rather than predicting who they will become.",
      ],
      [
        "Describe a favorite phrase, a bedtime routine, or the way a room looks today. A photograph can show the scene; a sentence can explain why you wanted to keep it.",
        "Let a letter include your own uncertainty and delight. Specific, sincere details will give them more to connect with than a polished list of advice.",
      ],
      [
        "Ask a grandparent or another close relative to add a short message. Offer one prompt: “What is something you love doing together right now?”",
        "Get everyone’s permission before recording. Add names and dates so your child can understand who is speaking and when the message was made.",
      ],
      [
        "Choose an opening date that feels right: a birthday, a future anniversary, or another day you want to mark. Check the family timezone when scheduling a digital capsule.",
        "In Everlittle, adults can keep letters and future capsules alongside the family archive. Review the intended audience before saving so the message is shared with the people you choose.",
      ],
      [
        "Keep copies of particularly important letters and original recordings. No app can promise that a device, login, or family arrangement will stay the same forever.",
        "Revisit your access details occasionally and check that a trusted adult knows where these memories are kept. A little maintenance helps a future message reach its reader.",
      ],
    ],
  },
];

export const articlePaths: Record<string, string> = {
  "little-journal": "/baby-memory-journal",
  "future-letter": "/letters-to-your-future-child",
  grandparents: "/grandparents-memory-project",
  "grandparent-sharing": "/sharing-photos-with-grandparents",
  "small-firsts": "/journal/small-firsts",
  "photo-story": "/journal/photo-story",
  "private-sharing": "/private-family-photo-sharing",
  "family-archive": "/family-memory-app",
  "time-capsule": "/digital-time-capsule-for-kids",
};
