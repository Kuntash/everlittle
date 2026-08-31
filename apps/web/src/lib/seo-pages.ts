import type { SeoPagePath } from "@/lib/seo-page-paths";

type SeoPageSection = {
  title: string;
  body: string;
};

type SeoPageFaq = {
  question: string;
  answer: string;
};

export type SeoLandingPageContent = {
  path: SeoPagePath;
  navLabel: string;
  eyebrow: string;
  title: string;
  introduction: string;
  promise: string;
  visualLabel: string;
  visualTitle: string;
  visualNote: string;
  problemTitle: string;
  problemBody: string;
  benefits: SeoPageSection[];
  guideEyebrow: string;
  guideTitle: string;
  guideIntroduction: string;
  guideItems: SeoPageSection[];
  keepsakeTitle: string;
  keepsakeBody: string;
  keepsakeIdeas: string[];
  faq: SeoPageFaq[];
  related: SeoPagePath[];
  metaTitle: string;
  metaDescription: string;
};

export const seoLandingPages: Record<SeoPagePath, SeoLandingPageContent> = {
  "/family-memory-app": {
    path: "/family-memory-app",
    navLabel: "Family memory app",
    eyebrow: "A calmer family memory app",
    title: "Keep your family story somewhere made for remembering.",
    introduction:
      "Everlittle is a private family memory app for collecting photographs, voice notes, videos, everyday stories, and letters for the future—with the people who know the story best.",
    promise: "One shared archive. No public profile. No algorithm deciding what matters.",
    visualLabel: "OUR FAMILY ARCHIVE",
    visualTitle: "The Sunday we made pancakes for dinner",
    visualNote: "Photo, story, and Grandpa’s voice—all kept together",
    problemTitle: "A camera roll holds files. A family archive holds meaning.",
    problemBody:
      "Family memories usually end up scattered across phones, message threads, cloud folders, and half-finished albums. Everlittle gives those pieces a lasting home, with the names, dates, voices, and small details that make them worth returning to.",
    benefits: [
      {
        title: "Tell the story around the photo",
        body: "Add who was there, what happened before, and the sentence everyone still repeats. The context stays beside the memory.",
      },
      {
        title: "Gather every kind of memory",
        body: "Keep photographs, video, voice recordings, written stories, milestones, and future letters in one chronological family archive.",
      },
      {
        title: "Invite the people who remember",
        body: "Parents, grandparents, and trusted relatives can each contribute their part without publishing family life to a social feed.",
      },
    ],
    guideEyebrow: "A simple way to begin",
    guideTitle: "Build the archive one ordinary moment at a time.",
    guideIntroduction:
      "You do not need to organize an entire lifetime before you start. Choose one memory that would be hard to reconstruct later, then let the archive grow naturally.",
    guideItems: [
      {
        title: "Start with one photograph",
        body: "Pick a picture that makes someone in the family immediately begin telling a story.",
      },
      {
        title: "Add the detail outside the frame",
        body: "Write down the nickname, recipe, joke, mistake, or tradition the image cannot show.",
      },
      {
        title: "Ask one other person",
        body: "Invite a relative to add what they remember. Different points of view turn a file into family history.",
      },
    ],
    keepsakeTitle: "Good first memories to collect",
    keepsakeBody:
      "Begin with moments that are familiar enough to describe now, but specific enough that the details may disappear later.",
    keepsakeIdeas: [
      "The story behind a family saying",
      "A voice recording of a bedtime song",
      "A photograph of an ordinary Sunday",
      "The recipe everyone requests",
      "A letter about what life feels like right now",
    ],
    faq: [
      {
        question: "What is a family memory app?",
        answer:
          "A family memory app is a private place to collect and organize meaningful family photographs, recordings, videos, stories, and milestones. Unlike a social network, its purpose is preservation and shared family access rather than public posting.",
      },
      {
        question: "Can relatives add their own memories?",
        answer:
          "Yes. Everlittle lets you invite trusted family members so grandparents, parents, and other relatives can contribute the stories and media they hold.",
      },
      {
        question: "Can I export what my family adds?",
        answer:
          "Yes. Everlittle is designed so families can export the memories they add rather than being locked into a public platform.",
      },
    ],
    related: [
      "/baby-memory-journal",
      "/private-family-photo-sharing",
      "/grandparents-memory-project",
    ],
    metaTitle: "Family Memory App for Private Family Stories | Everlittle",
    metaDescription:
      "Keep family photos, voices, videos, stories, and future letters together in Everlittle, a private family memory app built for the people you trust.",
  },
  "/digital-time-capsule-for-kids": {
    path: "/digital-time-capsule-for-kids",
    navLabel: "Time capsules for kids",
    eyebrow: "A digital time capsule for kids",
    title: "Save something today that will mean more to them later.",
    introduction:
      "Create a private digital time capsule for your child with letters, voice recordings, photographs, videos, and family stories—then choose the day it becomes theirs to open.",
    promise: "Made for birthdays, beginnings, hard days, and the person they are becoming.",
    visualLabel: "SEALED FOR LATER",
    visualTitle: "Open on your eighteenth birthday",
    visualNote: "A letter from Mum · 14 photographs · Grandpa’s recording",
    problemTitle: "The best gift may be the part of their childhood they could not remember.",
    problemBody:
      "A child will not remember the sound of their own early laugh, how the house felt when they arrived, or what you hoped for them before they could read. A digital time capsule lets you preserve those pieces now and deliver them at a meaningful moment in the future.",
    benefits: [
      {
        title: "Choose an opening date",
        body: "Set a capsule to open on a birthday, graduation, first day away from home, or any date that matters to your family.",
      },
      {
        title: "Mix words, voices, and images",
        body: "A capsule can hold more than a letter. Combine written notes with photographs, recordings, video, and the story behind each one.",
      },
      {
        title: "Let the whole family contribute",
        body: "Invite grandparents and relatives to add their own message so the finished capsule carries more than one loving voice.",
      },
    ],
    guideEyebrow: "Time capsule plan",
    guideTitle: "Make a capsule they will recognize as yours.",
    guideIntroduction:
      "The most moving time capsules are personal, specific, and imperfect. Record the phrases you actually use and the details only your family would know.",
    guideItems: [
      {
        title: "Name the moment",
        body: "Choose who the capsule is for and the future day when its message will matter most.",
      },
      {
        title: "Capture the present",
        body: "Describe their personality, daily routines, favorite things, and what the world around your family feels like today.",
      },
      {
        title: "Add more than advice",
        body: "Include a laugh, a short video, a familiar song, or a photograph of home so the capsule feels alive when it opens.",
      },
    ],
    keepsakeTitle: "Ideas for a child’s digital time capsule",
    keepsakeBody:
      "Choose a small set of personal artifacts. A capsule feels richer when every item has a reason for being there.",
    keepsakeIdeas: [
      "A tour of the home they grew up in",
      "Messages from each grandparent",
      "A list of the funny things they say",
      "A letter for their first day away",
      "Your hopes without expectations",
    ],
    faq: [
      {
        question: "What can I put in a digital time capsule for my child?",
        answer:
          "You can include letters, photographs, voice notes, short videos, family stories, milestones, and messages from relatives. The strongest capsules mix everyday details with a message written for a specific future moment.",
      },
      {
        question: "When should a child’s time capsule open?",
        answer:
          "Common choices include a milestone birthday, graduation, a first move away from home, or the day they become a parent. The best date is one that gives the contents new meaning.",
      },
      {
        question: "Can grandparents contribute to the capsule?",
        answer:
          "Yes. Trusted family members can be invited to contribute their own stories, recordings, and messages to a shared family capsule.",
      },
    ],
    related: [
      "/letters-to-your-future-child",
      "/grandparents-memory-project",
      "/family-memory-app",
    ],
    metaTitle: "Digital Time Capsule for Kids | Everlittle",
    metaDescription:
      "Create a private digital time capsule for your child with letters, photos, videos, voices, and family stories to open on a meaningful future date.",
  },
  "/letters-to-your-future-child": {
    path: "/letters-to-your-future-child",
    navLabel: "Letters to your child",
    eyebrow: "Letters to your future child",
    title: "Write the words you want them to find when they need them.",
    introduction:
      "Everlittle gives your letters to your child a private home beside the memories that inspired them. Write now, add photographs or your voice, and choose whether the letter is kept for today or sealed for later.",
    promise: "You do not need perfect words. You only need words that sound like you.",
    visualLabel: "A LETTER FROM DAD",
    visualTitle: "For the first day you doubt yourself",
    visualNote: "Written on an ordinary Tuesday · Opens when you turn 16",
    problemTitle: "The details you assume you will remember are often the first to fade.",
    problemBody:
      "A letter creates a small bridge between who you are today and who your child will become. It can preserve the shape of this season, explain a family decision, celebrate something only you noticed, or simply remind them how deeply they were known.",
    benefits: [
      {
        title: "Write for a real future moment",
        body: "Address a birthday, a difficult day, a new beginning, or the moment they become curious about who they were as a child.",
      },
      {
        title: "Keep the memory beside the message",
        body: "Add the photograph, recording, or story that prompted the letter so its meaning does not arrive without context.",
      },
      {
        title: "Seal it until the right day",
        body: "Choose an unlock date for letters meant for later, while keeping everyday notes available inside the family archive.",
      },
    ],
    guideEyebrow: "A gentle writing guide",
    guideTitle: "Begin with a moment, not a life lesson.",
    guideIntroduction:
      "Specific memories make a letter feel true. Start with something that happened today, describe what you noticed, and let the larger meaning emerge from there.",
    guideItems: [
      {
        title: "Describe what you see",
        body: "Write down the expression, habit, question, or small act of courage that made you want to remember this day.",
      },
      {
        title: "Say what it meant to you",
        body: "Tell them what you felt, what surprised you, or what the moment helped you understand about them.",
      },
      {
        title: "Leave room for who they become",
        body: "Offer love and perspective without prescribing a future. The letter is a witness, not a set of instructions.",
      },
    ],
    keepsakeTitle: "Letter prompts when the page feels too quiet",
    keepsakeBody:
      "Use one prompt and follow it wherever it leads. A short, honest paragraph is already something worth keeping.",
    keepsakeIdeas: [
      "Today you surprised me when…",
      "A part of our family I hope you carry…",
      "The ordinary thing I love doing with you…",
      "Something I learned after becoming your parent…",
      "If you ever feel alone, remember…",
    ],
    faq: [
      {
        question: "What should I write in a letter to my future child?",
        answer:
          "Write about a specific moment, what you noticed about them, what life in your family feels like now, and what you hope they understand later. Honest detail is usually more meaningful than polished advice.",
      },
      {
        question: "How often should I write letters to my child?",
        answer:
          "There is no required schedule. Some parents write on birthdays, while others write after ordinary moments they do not want to lose. A few sincere letters can become a powerful record.",
      },
      {
        question: "Can I add audio or photographs to a letter?",
        answer:
          "Yes. Everlittle lets you keep photographs, voice recordings, video, and related memories in the same private archive as your letters.",
      },
    ],
    related: ["/digital-time-capsule-for-kids", "/baby-memory-journal", "/family-memory-app"],
    metaTitle: "Letters to Your Future Child | Everlittle",
    metaDescription:
      "Write meaningful letters to your future child, keep them with photos and voice memories, and seal them to open on a birthday or milestone.",
  },
  "/private-family-photo-sharing": {
    path: "/private-family-photo-sharing",
    navLabel: "Private photo sharing",
    eyebrow: "Private family photo sharing",
    title: "Share family photographs without turning family life into content.",
    introduction:
      "Everlittle is an invite-only place for private family photo sharing, where each picture can keep its date, people, story, and related voice or video—without a public profile or advertising feed.",
    promise: "For relatives you trust, with context you want your children to inherit.",
    visualLabel: "SHARED WITH FAMILY",
    visualTitle: "First steps in Grandma’s kitchen",
    visualNote: "Visible to 8 invited people · Story added by Grandma",
    problemTitle: "Sharing should bring the family closer without making the moment public.",
    problemBody:
      "Group chats are immediate but difficult to search later. Public social platforms make family photographs part of a feed. Everlittle gives trusted relatives a dedicated archive where shared pictures remain connected to the people and stories behind them.",
    benefits: [
      {
        title: "Invite-only family access",
        body: "Choose the people who belong in the archive and keep family memories away from public profiles and unknown audiences.",
      },
      {
        title: "A story instead of a disappearing chat",
        body: "Keep captions, dates, contributors, and related recordings with the photograph rather than losing them in a message thread.",
      },
      {
        title: "One place across generations",
        body: "Parents and relatives can contribute to the same child spaces, so the archive is not trapped on one person’s phone.",
      },
    ],
    guideEyebrow: "A thoughtful sharing habit",
    guideTitle: "Share fewer photographs, with more of the story.",
    guideIntroduction:
      "A lasting family archive does not need every image. Choose the photographs that reveal a relationship, a change, a tradition, or an ordinary day worth explaining.",
    guideItems: [
      {
        title: "Choose the keepers",
        body: "Pick the image that best holds the moment instead of uploading every near-duplicate from the camera roll.",
      },
      {
        title: "Name the people and place",
        body: "Add the details a child may not know later: who is pictured, where they are, and why the day mattered.",
      },
      {
        title: "Invite a second memory",
        body: "Ask someone who was there to add what happened next or record how they remember it.",
      },
    ],
    keepsakeTitle: "Photographs that become family history",
    keepsakeBody:
      "Look beyond formal milestones. Everyday scenes often carry more clues about the life your family actually shared.",
    keepsakeIdeas: [
      "A grandparent teaching something",
      "The kitchen during a family recipe",
      "A favorite toy in the room it lived in",
      "The unplanned moment after a celebration",
      "A place the family returned to every year",
    ],
    faq: [
      {
        question: "How can I share family photos privately?",
        answer:
          "Use an invite-only family archive where you control membership instead of posting to a public profile or open link. Everlittle is designed around trusted family access and private child spaces.",
      },
      {
        question: "Is Everlittle a social network?",
        answer:
          "No. Everlittle does not use public profiles or an advertising feed. It is a private family archive focused on preserving memories with the people you invite.",
      },
      {
        question: "Can grandparents add captions and stories?",
        answer:
          "Yes. Invited relatives can contribute their own memories, helping preserve names, places, and stories that a photograph alone cannot explain.",
      },
    ],
    related: ["/family-memory-app", "/grandparents-memory-project", "/baby-memory-journal"],
    metaTitle: "Private Family Photo Sharing App | Everlittle",
    metaDescription:
      "Share family photos privately with invited relatives, preserve the story behind each picture, and keep family life away from public social feeds.",
  },
  "/baby-memory-journal": {
    path: "/baby-memory-journal",
    navLabel: "Baby memory journal",
    eyebrow: "A baby memory journal for real life",
    title: "Remember more than the milestones on the checklist.",
    introduction:
      "Everlittle is a private baby memory journal for photographs, firsts, voice notes, short videos, funny phrases, and letters—easy to build with a partner and the family who are watching your child grow.",
    promise:
      "A living record of the baby, toddler, and child they become—not homework for tired parents.",
    visualLabel: "AGE 14 MONTHS",
    visualTitle: "The week every spoon was called ‘moon’",
    visualNote: "3 photos · 1 voice note · remembered by both parents",
    problemTitle:
      "A first year is full of firsts, but the in-between is where their personality appears.",
    problemBody:
      "Traditional baby books are beautiful, yet they often leave little room for sound, movement, or contributions from the rest of the family. Everlittle lets your journal grow in small pieces, capturing both milestones and the ordinary details that are easiest to forget.",
    benefits: [
      {
        title: "Capture a moment in the format it needs",
        body: "Save the photograph, record the sound, add a short video, or write the sentence before it disappears from memory.",
      },
      {
        title: "Share the remembering",
        body: "A partner, grandparent, or trusted relative can contribute their own view instead of leaving one parent to document everything.",
      },
      {
        title: "Grow from baby book to childhood archive",
        body: "Keep adding to the same private child space as newborn days become toddler stories, school years, and future letters.",
      },
    ],
    guideEyebrow: "A five-minute journal habit",
    guideTitle: "Record what changed, what delighted you, and what felt ordinary.",
    guideIntroduction:
      "A useful baby journal can be brief. One image, one sentence, and one detail about this particular season are enough to bring a day back later.",
    guideItems: [
      {
        title: "Choose one moment",
        body: "Use the clearest memory from the week: a new sound, an unexpected reaction, or a routine that suddenly changed.",
      },
      {
        title: "Add one sensory detail",
        body: "Describe the sound of their laugh, the song that calmed them, or the way they held your finger.",
      },
      {
        title: "Write to your future selves",
        body: "Include the part you and your child may otherwise forget: how tired, proud, amused, or astonished you felt.",
      },
    ],
    keepsakeTitle: "Baby journal moments beyond the usual firsts",
    keepsakeBody:
      "Milestones provide a timeline. These smaller observations preserve the person emerging between them.",
    keepsakeIdeas: [
      "The sound that always made them laugh",
      "A tour of the nursery before it changed",
      "The first nickname that truly stuck",
      "A grandparent’s version of the birth story",
      "A day that felt difficult but tender",
    ],
    faq: [
      {
        question: "What should I include in a baby memory journal?",
        answer:
          "Include milestones, everyday routines, favorite sounds, funny expressions, photographs of familiar places, short videos, voice recordings, and how this season felt to the people caring for your baby.",
      },
      {
        question: "What if I am behind on the baby book?",
        answer:
          "Start with today. You do not need to reconstruct every month in order. Add one memory you can describe clearly now, then return to earlier moments when something prompts them.",
      },
      {
        question: "Can both parents contribute?",
        answer:
          "Yes. Everlittle is built as a shared family archive, so partners and trusted relatives can add memories from their own point of view.",
      },
    ],
    related: [
      "/family-memory-app",
      "/letters-to-your-future-child",
      "/private-family-photo-sharing",
    ],
    metaTitle: "Baby Memory Journal for the Whole Family | Everlittle",
    metaDescription:
      "Keep a private baby memory journal with photos, milestones, voice notes, video, stories, and letters contributed by the people who love your child.",
  },
  "/grandparents-memory-project": {
    path: "/grandparents-memory-project",
    navLabel: "Grandparents memory project",
    eyebrow: "A grandparents memory project",
    title: "Keep the stories only your grandparents can tell.",
    introduction:
      "Create a private grandparents memory project with guided questions, voice recordings, photographs, recipes, and family stories—then preserve it inside the same archive the next generation can grow into.",
    promise:
      "Less like an interview. More like making room for the stories that surface when someone feels listened to.",
    visualLabel: "GRANDPA’S STORY · 06:42",
    visualTitle: "The old house, the blue bicycle, and the monsoon",
    visualNote: "Recorded by Maya · photograph dated with Grandpa’s help",
    problemTitle:
      "Names, voices, and everyday family history can disappear in a single generation.",
    problemBody:
      "Grandparents often hold the context missing from old photographs: who the people were, how a tradition began, what work felt like, and which version of the family story is actually true. A memory project turns those conversations into an archive your family can revisit.",
    benefits: [
      {
        title: "Record their voice",
        body: "A voice carries laughter, pauses, pronunciation, and character that a transcript or caption cannot preserve on its own.",
      },
      {
        title: "Give old photographs their names back",
        body: "Use a photograph as a prompt, then keep the people, places, dates, and story together for the next generation.",
      },
      {
        title: "Build it together",
        body: "Different relatives can ask questions and add material, making the project a shared family practice rather than one person’s unfinished task.",
      },
    ],
    guideEyebrow: "A conversation-first plan",
    guideTitle: "Ask about a scene they can return to, not an entire lifetime.",
    guideIntroduction:
      "Broad questions can feel overwhelming. A place, object, smell, photograph, or family recipe gives memory somewhere concrete to begin.",
    guideItems: [
      {
        title: "Bring one prompt",
        body: "Choose an old photograph, a familiar object, or a question about a specific home, person, journey, or tradition.",
      },
      {
        title: "Follow the unexpected detail",
        body: "Listen for the side story, unusual name, or small correction. That is often where the most valuable family history begins.",
      },
      {
        title: "Label it while you are together",
        body: "Confirm names, relationships, places, and approximate dates before saving the recording with its related photographs.",
      },
    ],
    keepsakeTitle: "Questions that invite a real story",
    keepsakeBody:
      "Use these as openings, not a questionnaire. Let one answer become a conversation and save the details that emerge.",
    keepsakeIdeas: [
      "What did an ordinary school morning look like?",
      "Who taught you the family recipe, and how?",
      "What could you hear from your childhood home?",
      "Which family story is usually told incorrectly?",
      "What do you hope the youngest person remembers?",
    ],
    faq: [
      {
        question: "How do I start a grandparents memory project?",
        answer:
          "Begin with one photograph or specific question, ask permission to record, and let the conversation follow the details that interest them. Label names and places while you are together, then save the recording with any related images.",
      },
      {
        question: "What questions should I ask my grandparents?",
        answer:
          "Ask concrete, open questions about ordinary routines, childhood homes, work, celebrations, recipes, journeys, family sayings, and people shown in old photographs. Specific prompts usually produce richer stories than asking for a whole life history.",
      },
      {
        question: "Can several relatives work on the project?",
        answer:
          "Yes. Everlittle lets invited family members contribute recordings, photographs, and stories to one shared private archive.",
      },
    ],
    related: [
      "/family-memory-app",
      "/private-family-photo-sharing",
      "/digital-time-capsule-for-kids",
    ],
    metaTitle: "Grandparents Memory Project | Everlittle",
    metaDescription:
      "Start a grandparents memory project with voice recordings, old photos, recipes, and guided family-story prompts in one private archive.",
  },
};

const SOCIAL_IMAGE = "https://geteverlittle.com/marketing/family-album.jpg";

export function seoLandingPageHead(page: SeoLandingPageContent) {
  const url = `https://geteverlittle.com${page.path}`;

  return {
    links: [{ href: url, rel: "canonical" }],
    meta: [
      { title: page.metaTitle },
      { name: "description", content: page.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Everlittle" },
      { property: "og:url", content: url },
      { property: "og:title", content: page.metaTitle },
      { property: "og:description", content: page.metaDescription },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      {
        property: "og:image:alt",
        content: "Three generations looking through a family album together",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.metaTitle },
      { name: "twitter:description", content: page.metaDescription },
      { name: "twitter:image", content: SOCIAL_IMAGE },
      {
        name: "twitter:image:alt",
        content: "Three generations looking through a family album together",
      },
      { name: "robots", content: "index,follow" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              name: page.metaTitle,
              url,
              description: page.metaDescription,
              isPartOf: {
                "@type": "WebSite",
                name: "Everlittle",
                url: "https://geteverlittle.com/",
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: page.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
          ],
        },
      },
    ],
  };
}
