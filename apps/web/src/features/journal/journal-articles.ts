export type JournalArticle = {
  id: string;
  category: string;
  kind: string;
  title: string;
  intro: string;
  minutes: number;
  published?: string;
  updated?: string;
  cover?: { src: string; alt: string; width: number; height: number; caption: string };
  sectionImages?: Record<
    number,
    { src: string; alt: string; width: number; height: number; caption: string }
  >;
  comparison?: { title: string; rows: { method: string; bestFor: string; check: string }[] };
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
    title: "Photo sharing for grandparents: a private mobile guide",
    intro:
      "Share pictures with grandparents, send a photo to Grandma, and keep family stories together. Compare your options and see Everlittle’s mobile web app.",
    minutes: 7,
    published: "2026-09-10",
    updated: "2026-09-15",
    lede: "For a quick photo to Grandma, use a messaging app she already knows. For regular updates that the family can revisit, choose a shared album or a private family archive. Start with the simplest option your grandparents can open comfortably, then decide how much of the story you want to keep.",
    quote: "The best place to share a photo is one your family can comfortably return to.",
    relatedIds: ["private-sharing", "family-archive"],
    sectionImages: {
      1: {
        src: "/journal/grandparents-mobile-family.png",
        alt: "Everlittle mobile Family screen showing Grandma June as a Contributor and the email invitation form.",
        width: 390,
        height: 1000,
        caption:
          "Choose a role when you invite a loved one. This owner’s view shows a fictional family; no invitation was sent.",
      },
      4: {
        src: "/journal/grandparents-mobile-memory.png",
        alt: "A mobile photo memory with its title, story, author, date and Family audience.",
        width: 390,
        height: 844,
        caption:
          "Keep the story beside the photograph. This demo shows the author’s view, including editing controls.",
      },
    },
    cover: {
      src: "/journal/grandparents-mobile-overview.png",
      alt: "Everlittle on mobile: a family memory feed, a photo with its story, and family invitations.",
      width: 1200,
      height: 720,
      caption:
        "Everlittle’s actual mobile interface, shown with fictional family details and an illustrative photo.",
    },
    comparison: {
      title: "Choose how to share pictures with grandparents",
      rows: [
        {
          method: "A direct message",
          bestFor: "A few photos now, using an app Grandma already knows.",
          check: "Pictures may be forwarded. Agree on sharing, and keep your own originals.",
        },
        {
          method: "A shared photo album",
          bestFor: "A collection of photos relatives can return to.",
          check:
            "Try the invitation on their device. Check account requirements, storage and who can add pictures.",
        },
        {
          method: "A private family archive",
          bestFor: "Photos alongside dated stories, voices and letters from several relatives.",
          check: "Check roles, price, exports and the steps each relative needs to join.",
        },
        {
          method: "A link to one memory",
          bestFor:
            "Showing someone one photo and its story without inviting them into the archive.",
          check:
            "Anyone with a working public link can view it. Share only content you are comfortable having forwarded.",
        },
      ],
    },
    sectionTitles: [
      "Make grandparent photo sharing easy to return to",
      "Share pictures with grandparents in Everlittle",
      "Help Grandma open her first invitation",
      "How to send photos to Grandma without an archive account",
      "Preserve family memories with an app: keep the story, too",
      "What to look for in a memory sharing platform",
      "Common questions about photo sharing for grandparents",
    ],
    paragraphs: [
      [
        "Ask which device your grandparent actually uses and how they prefer to receive an update. A phone, a tablet and a shared household computer can require different setup help. Try opening one photo together before moving a whole collection.",
        "For a one-off update, a direct message may be enough. For a growing collection, choose a shared album or archive with a place to find older memories. Check whether an invitation needs an account, whether text is comfortable to read, and whether the person can find the photo again without your help.",
        "Agree on one simple boundary: who may see the pictures, and whether they can be forwarded or posted elsewhere. Private sharing still allows a recipient to save a copy or take a screenshot.",
      ],
      [
        "Create your Everlittle account and family archive, then choose a plan before adding memories. Account creation is free; adding memories requires a paid plan. Open the archive on your phone and tap Add a memory. Choose a photo, add a title and date, and write a sentence about what happened.",
        "In Family → People, enter your grandparent’s email address and choose an invitation role. Choose Viewer for someone who should only see memories available to them. Choose Contributor for a grandparent who wants to add photos and stories, too. Send the invitation, then help them complete the account and acceptance steps.",
        "Review the audience on each memory. Joining the archive does not give every relative access to every entry. The mobile Home view keeps recent memories together; Timeline helps the family return to earlier moments.",
      ],
      [
        "Tell your grandparent that an invitation is coming before sending it. You can use this message: “I sent you an Everlittle invitation by email. It is where we are keeping family photos and stories. Open it on your phone and follow the account steps. Let’s look at the first photo together.”",
        "If the invitation is missing, check the email address and spam folder. If the link has expired, send a fresh invitation from family settings. Avoid sharing passwords in a family group chat.",
        "After they join, bookmark the archive in their browser. Ask them to reopen it, find the photo and return to Home on their own. Everlittle works in a web browser, so these steps do not require an App Store or Google Play download.",
      ],
      [
        "To send photos to Grandma occasionally, a direct message on an app she already uses may be the quickest choice. You do not need to move every family conversation into a new service.",
        "For a photo already kept in Everlittle, its author can open the memory’s sharing options and enable a public link. Copy that link and send it through your usual messaging app. The recipient can view that single memory without joining the archive; the rest of the archive stays protected.",
        "Everlittle’s public-memory links expire after 30 days and the author can disable them earlier. Anyone with a working link can open it, including someone it was forwarded to. The shared page includes the child’s name and author attribution. Check the photo, story and names before sending; use an invitation when you need access tied to a family member.",
      ],
      [
        "A photo tells part of the story. Add the date, who was there and one detail the picture cannot show: “You wanted to hear the story behind every picture. Grandma had time for them all.” Those words make an ordinary afternoon easier to remember years later.",
        "An app to preserve family memories should help you keep that context with the original moment. In Everlittle, you can keep photos, voices, stories, videos, milestones and letters. A grandparent with Contributor access can add a memory of their own, including a voice recording they are comfortable sharing.",
        "Keep a separate copy of irreplaceable original photos and recordings. Check the archive’s export options before committing your collection, and review who has access from time to time. A sharing service is one part of a preservation routine.",
      ],
      [
        "Choose a memory sharing platform by trying the full family experience: add a photo, invite a relative, open the invitation on their device, and find an older entry. Look for clear permissions and a way to keep the date and story alongside the photo.",
        "Compare the total family cost, storage allowance, supported media, invitation requirements and export options. Ask whether relatives pay separately and what happens when a subscription changes. A low starting price tells you little without those details.",
        "Everlittle’s family plan is $6 per month or $60 per year, with 25 GB for photos, voices and video and unlimited invited family members. The yearly plan saves $12 compared with twelve monthly payments. Account creation is free; choose a plan before adding memories. Check the pricing page for current terms.",
      ],
      [
        "What is the easiest way to share pictures with grandparents? Start with a messaging app they already use for a few pictures. A shared album or private archive is useful when they want a collection to revisit. Test the first invitation and photo together.",
        "Do grandparents need an Everlittle account? They need to complete the account and invitation steps to join your private archive. A public link to one memory can be opened without joining, but anyone with that working link can view it.",
        "Can grandparents add photos as well as view them? Yes, when invited as Contributors. Viewers can see the memories available to them but cannot add their own. Choose the role that fits how each person wants to take part.",
        "Is Everlittle free? Creating an account is free. Adding memories requires a family plan at $6 per month or $60 per year. Unlimited invited family members are included.",
      ],
    ],
    sectionLinks: {
      "1": [
        {
          href: "/sign-up",
          label: "Start your family archive",
        },
      ],
      "3": [
        {
          href: "/privacy",
          label: "Read how Everlittle sharing and privacy work",
        },
      ],
      "4": [
        {
          href: "/family-memory-app",
          label: "Explore ways to preserve family memories",
        },
        {
          href: "/grandparents-memory-project",
          label: "Find prompts for the stories only grandparents can tell",
        },
      ],
      "5": [
        {
          href: "/pricing",
          label: "See the family plan and pricing",
        },
        {
          href: "/private-family-photo-sharing",
          label: "Read the private family photo sharing guide",
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
