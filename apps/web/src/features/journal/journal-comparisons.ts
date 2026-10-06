import type { JournalArticle } from "./journal-articles";

// App comparisons. Every competitor price, limit and feature below was read on the company's own
// site, help center or App Store listing on the date in CHECKED, and is linked in `sources`.
// Re-check all of them before changing that date.
const CHECKED = "6 October 2026";

const CAPTION = `Prices and limits checked on ${CHECKED} on each company’s own site or App Store listing. They change, so confirm before you pay.`;

// Everlittle leads every table. The cost line is the same everywhere; see lib/plans.ts and the
// pricing page before changing it.
const EVERLITTLE_COST =
  "Free up to 100 MB, with no card and no expiry. $6 a month or $60 a year for 25 GB. Invited family are free on both plans. No ads.";

function everlittleRow(bestFor: string, note: string) {
  return { method: "Everlittle", bestFor, check: `${EVERLITTLE_COST} ${note}` };
}

const START_FREE = { href: "/sign-up", label: "Start your family archive, free" };
const SEE_PLANS = { href: "/pricing", label: "See Everlittle’s plans" };

const REDDIT_TINYBEANS = {
  label: "Reddit, r/beyondthebump: “Alternative to tiny beans for photo sharing?”",
  href: "https://www.reddit.com/r/beyondthebump/comments/eyy349/alternative_to_tiny_beans_for_photo_sharing/",
};
const REDDIT_DADDIT = {
  label: "Reddit, r/daddit: “Photo sharing with family”",
  href: "https://www.reddit.com/r/daddit/comments/1m3vtka/photo_sharing_with_family/",
};
const REDDIT_BABYBUMPS = {
  label: "Reddit, r/BabyBumps: “Family Album photo sharing app?”",
  href: "https://www.reddit.com/r/BabyBumps/comments/zp27sl/family_album_photo_sharing_app/",
};
const REDDIT_NEWPARENTS = {
  label: "Reddit, r/NewParents: “Baby book, but an app?”",
  href: "https://www.reddit.com/r/NewParents/comments/1agvpgk/baby_book_but_an_app/",
};

const TINYBEANS_PRICE = {
  label: "Tinybeans Help Center: How much is a Tinybeans+ subscription?",
  href: "https://tinybeans.helpscoutdocs.com/article/22-how-much-is-a-tinybeans-premium-subscription",
};
const TINYBEANS_STORAGE = {
  label: "Tinybeans Help Center: Do you have a storage limit?",
  href: "https://tinybeans.helpscoutdocs.com/article/24-do-you-have-a-storage-limit",
};
const TINYBEANS_STORE = {
  label: "App Store: Tinybeans Private Family Album",
  href: "https://apps.apple.com/us/app/id521633042",
};
const TINYBEANS_HOME = { label: "Tinybeans", href: "https://tinybeans.com/" };

const QEEPSAKE_PRICING = { label: "Qeepsake: Pricing", href: "https://www.qeepsake.com/pricing" };
const QEEPSAKE_HELP = {
  label: "Qeepsake Help Center: How does Qeepsake work?",
  href: "https://help.qeepsake.com/article/116-how-does-qeepsake-work",
};
const QEEPSAKE_STORE = {
  label: "App Store: Qeepsake",
  href: "https://apps.apple.com/us/app/qeepsake-family-photo-album/id1332312787",
};

const FAMILYALBUM_HOME = { label: "FamilyAlbum", href: "https://family-album.com/" };
const FAMILYALBUM_FREE = {
  label: "FamilyAlbum Blog: Is FamilyAlbum really free? What you get without paying",
  href: "https://blog.family-album.com/blog/is-familyalbum-really-free-what-you-get-without-paying/",
};
const FAMILYALBUM_STORE = {
  label: "App Store: FamilyAlbum",
  href: "https://apps.apple.com/us/app/familyalbum-photo-sharing/id935672069",
};

const GOOGLE_STORAGE = {
  label: "Google Photos Help: Choose the backup quality of your photos and videos",
  href: "https://support.google.com/photos/answer/6220791",
};
const GOOGLE_SHARING = {
  label: "Google Photos Help: Share photos and videos",
  href: "https://support.google.com/photos/answer/6131416",
};

const SHORT_YEARS_HOME = { label: "The Short Years", href: "https://theshortyearsbooks.com/" };
const SHORT_YEARS_STORE = {
  label: "App Store: The Short Years Baby Book",
  href: "https://apps.apple.com/us/app/the-short-years-baby-book/id1327539226",
};
const BABY_NOTEBOOK = { label: "Baby Notebook", href: "https://www.babynotebookapp.com/" };

const EVERLITTLE_PRICING = {
  label: "Everlittle: Pricing",
  href: "https://geteverlittle.com/pricing",
};

export const comparisonArticles: JournalArticle[] = [
  {
    id: "tinybeans-alternatives",
    category: "Family stories",
    kind: "Photo",
    title: "A Tinybeans alternative that keeps the story with the photo",
    searchTitle: "Tinybeans Alternatives (2026): A Private, Ad-Free Family Archive",
    intro:
      "Looking for a Tinybeans alternative? Everlittle keeps each photo with its story, voices and sealed letters, with no ads. Four other options compared.",
    minutes: 8,
    published: "2026-10-06",
    lede: "If you are leaving Tinybeans because of the ads on the free plan, the monthly upload limit or a year of photos with nothing written beside them, try Everlittle. It is a private family archive where each photo keeps its story, grandparents add memories of their own, and a letter can stay sealed until your child is old enough to read it. It is free to start, with no card.",
    quote: "A year from now you will want the sentence as much as the photo.",
    relatedIds: ["photo-sharing-apps", "qeepsake-alternatives"],
    comparison: {
      title: "Everlittle, Tinybeans and the other alternatives at a glance",
      columns: ["Option", "Good at", "Cost and limits"],
      caption: CAPTION,
      rows: [
        everlittleRow(
          "Photos kept with the story behind them, voice recordings and sealed letters, added by the family you invite, with a view for your child.",
          "A web app you add to your home screen.",
        ),
        {
          method: "Tinybeans",
          bestFor: "A private photo journal that relatives can follow by email without the app.",
          check:
            "Free with 20 uploads a month and 5 GB. Tinybeans+ is $7.99 a month or $74.99 a year for unlimited uploads, 200 GB and no ads.",
        },
        {
          method: "FamilyAlbum",
          bestFor: "Lots of photos and short clips, sorted by month, for relatives of any age.",
          check:
            "Free with unlimited storage; videos up to 2 minutes. Premium Family is $5.99 a month or $59 a year for 10-minute videos.",
        },
        {
          method: "Google Photos shared album",
          bestFor: "Families who already back up to Google Photos and want no new app.",
          check:
            "Free within the 15 GB shared by your Google Account. Anyone with the album link can view and add.",
        },
        {
          method: "Qeepsake",
          bestFor: "Parents who want to be prompted by text message to write memories down.",
          check:
            "Essential is $4.99 a month, Premium $9.99 a month, each with a 7-day free trial. Now run by Tinybeans.",
        },
        {
          method: "A family group chat",
          bestFor: "A quick photo today, in an app everyone already opens.",
          check: "Free. Photos scroll away and are hard to find a year later.",
        },
      ],
    },
    sectionTitles: [
      "Why parents look for a Tinybeans alternative",
      "1. Everlittle: each photo keeps its story",
      "Everlittle or Tinybeans?",
      "2. FamilyAlbum",
      "3. A Google Photos shared album",
      "4. Qeepsake",
      "5. A family group chat",
      "Moving from Tinybeans to Everlittle",
    ],
    paragraphs: [
      [
        "Tinybeans is a private photo journal. You post photos and videos of your child, and the relatives you invite follow in the app or through email updates.",
        `On ${CHECKED} the free plan allowed 20 uploads a month and 5 GB of storage. Tinybeans+ cost $7.99 a month or $74.99 a year. It lifts the upload cap, allows videos of up to five minutes, raises storage to 200 GB and removes ads for you and for the people following your journal. Voice notes and exporting your memories are both listed as Tinybeans+ features.`,
        "Twenty uploads a month is roughly one photo every weekday, and parents of a newborn tend to pass that in the first week. That is usually when the searching starts. A second reason arrives later, when you scroll back through a year of photos and find that nothing says what was going on in any of them.",
      ],
      [
        "Everlittle is ours, and it is the one we would point you to first. It is a private family archive where a photo goes on a dated timeline with a title and the story behind it. Beside the photos you can keep voice recordings, video, milestones, written stories and letters.",
        "Your family builds it with you. You invite relatives by email and give each one a role: a Viewer sees what is shared with them, and a Contributor adds memories of their own. A grandmother can put in the photo she took at the park and say in her own words what happened. Every memory has its own audience, so the bath photo can stay between the two of you.",
        "You can also write a letter and seal it until a date you choose. Nobody can read it before then, including you. And your child can have a view of their own, opened with a family PIN and no email account, which shows only what you have shared with them.",
        "Nothing is public unless the author of a memory creates a link for it, and that link stops working after 30 days. There are no ads on either plan. The free plan gives you 100 MB with no card and no end date, and the family plan is $6 a month or $60 a year for 25 GB. The relatives you invite never pay.",
      ],
      [
        "Tinybeans is built for a steady flow of photos. Everlittle is built for the ones you want your child to have, with enough written or spoken beside each that it still makes sense in fifteen years.",
        "Voice is a good example. Tinybeans lists voice notes under its paid plan. In Everlittle a voice recording is a kind of memory on both plans, so a grandparent’s first contribution can be a story told aloud.",
        "The paid plans are priced differently too: $60 a year for Everlittle against $74.99 for Tinybeans+. Tinybeans+ comes with far more storage, 200 GB to Everlittle’s 25 GB, and Tinybeans has phone apps, email updates for relatives and photo books. Everlittle is a web app you add to your home screen, and it has none of those three.",
        "Choose Tinybeans instead if your relatives will only ever read an email, or if you want every photo you take uploaded to one place.",
      ],
      [
        "FamilyAlbum is the app Reddit parents recommend most often for relatives who are not comfortable with technology. One parent in r/daddit said a grandparent of almost ninety uses it daily. It sorts photos by month on its own, and only people you invite can see the album.",
        `Storage and uploads are unlimited on the free plan. The limit that matters is video length: two minutes per clip on the free plan and ten minutes with Premium Family, which was $5.99 a month or $59 a year on ${CHECKED}. One subscription covers the whole album, and relatives can view in a browser without making an account.`,
        "It is a photo album designed around volume. Parents in the same threads mention being nudged toward photo books, and one wished for a proper caption on each photo. Choose FamilyAlbum instead if you want every photo, free, in front of every relative. The two work well side by side: FamilyAlbum for the daily stream, Everlittle for the photos that need explaining.",
      ],
      [
        "In a thread on r/beyondthebump asking for a Tinybeans alternative, the most upvoted reply was a Google Photos album shared with immediate family. Create an album, share it with the relatives you choose and add photos as you take them. People in the album can comment, like photos and add their own.",
        "The catch is in Google’s own help pages: anyone with the album link can view the photos and add to the album. Invite people by their Google Account instead of posting a link in a group chat, and check the album’s sharing settings once it is set up.",
        "Storage is the other limit. Each Google Account comes with up to 15 GB shared across Gmail, Drive and Photos, so a year of video can fill it. Choose this instead if both parents already use Google Photos and you want the least possible effort.",
      ],
      [
        "Qeepsake solves a different problem from Tinybeans. It texts you a question about your child and saves your reply as a journal entry, so the words get written even if you never open an app. You can add photos and video in the app and order the journal as a printed book.",
        `On ${CHECKED} its pricing page listed Essential at $4.99 a month, or $3.99 a month billed yearly, with two questions a day, and Premium at $9.99 a month, or $7.99 billed yearly, with four. Each has a seven-day free trial. Essential caps photo uploads at 50 a month.`,
        "The App Store now lists Tinybeans USA Ltd as Qeepsake’s developer, so this is a move within the same company. Choose it instead if a daily text is the only thing that will get you writing.",
      ],
      [
        "A WhatsApp, iMessage or Signal group costs nothing and nobody needs to learn anything. For a photo that says “look what she did this morning”, it is hard to beat.",
        "It is a poor place to keep anything. Photos arrive between dinner plans and birthday reminders, video is compressed, and the day somebody changes phones without a backup the history goes with them. Use a group chat for today, and put the photos you would be upset to lose somewhere with a date and a story.",
      ],
      [
        "Get your photos out before you cancel anything. Tinybeans lists export as a Tinybeans+ feature, so check whether you need a month of the paid plan to do it. Save the files somewhere you control and confirm a few of them open. Keep that folder afterward too.",
        "Then resist uploading all of it. Pick ten photos from the past year that you would be sad to lose, and add each one with its date and two sentences about the day. That fits comfortably in the free plan.",
        "Invite one relative next, the one most likely to struggle. Sit with them while they open the first photo and ask them to find it again on their own the next day. If that works, invite everyone else.",
      ],
    ],
    sectionLinks: {
      "1": [
        START_FREE,
        {
          href: "/sharing-photos-with-grandparents",
          label: "How inviting a grandparent to Everlittle works",
        },
      ],
      "2": [SEE_PLANS],
      "3": [
        {
          href: "/familyalbum-vs-google-photos-vs-tinybeans",
          label: "FamilyAlbum, Google Photos and Tinybeans compared side by side",
        },
      ],
      "5": [
        {
          href: "/qeepsake-alternatives",
          label: "Qeepsake alternatives, and Tinybeans vs Qeepsake",
        },
      ],
      "7": [
        { href: "/sign-up", label: "Create your free archive and add the first photo" },
        { href: "/private-family-photo-sharing", label: "How to share family photos privately" },
      ],
    },
    sources: [
      TINYBEANS_PRICE,
      TINYBEANS_STORAGE,
      TINYBEANS_STORE,
      TINYBEANS_HOME,
      REDDIT_TINYBEANS,
      GOOGLE_SHARING,
      GOOGLE_STORAGE,
      FAMILYALBUM_HOME,
      FAMILYALBUM_FREE,
      REDDIT_DADDIT,
      QEEPSAKE_PRICING,
      QEEPSAKE_STORE,
      EVERLITTLE_PRICING,
    ],
    sectionSources: {
      "0": [0, 1, 2, 3],
      "1": [12],
      "2": [0],
      "3": [7, 8, 9],
      "4": [4, 5, 6],
      "5": [10, 11],
      "7": [0],
    },
  },
  {
    id: "qeepsake-alternatives",
    category: "Everyday memories",
    kind: "Story",
    title: "A Qeepsake alternative the whole family can add to",
    searchTitle: "Qeepsake Alternatives (2026): Everlittle, Plus Tinybeans vs Qeepsake",
    intro:
      "A Qeepsake alternative with a free plan that does not expire: Everlittle keeps photos, voices and letters from the whole family. Plus Tinybeans vs Qeepsake.",
    minutes: 8,
    published: "2026-10-06",
    lede: "Qeepsake texts you questions and saves your answers as a journal, on paid plans after a seven-day trial. If you want the photos, the voices and the grandparents in the same place as the words, try Everlittle. It is a private family archive where everyone you invite adds their own memories, and its free plan does not expire.",
    quote:
      "The stories about your child are spread across the whole family. Give them one place to land.",
    relatedIds: ["tinybeans-alternatives", "baby-book-apps"],
    comparison: {
      title: "Everlittle, Qeepsake and the other alternatives at a glance",
      columns: ["Option", "Good at", "Cost and limits"],
      caption: CAPTION,
      rows: [
        everlittleRow(
          "Stories, photos, voice recordings and sealed letters from parents and grandparents, on one timeline your child can open later.",
          "No monthly photo count. No text prompts or printed books.",
        ),
        {
          method: "Qeepsake",
          bestFor: "Text-message questions you answer in a line, saved as a journal you can print.",
          check:
            "Essential $4.99 a month with 2 questions a day and 50 photos a month. Premium $9.99 a month with 4 questions a day. 7-day free trial.",
        },
        {
          method: "Tinybeans",
          bestFor: "Sharing photos and video with relatives, who can follow by email.",
          check:
            "Free with 20 uploads a month and 5 GB. Tinybeans+ is $7.99 a month or $74.99 a year.",
        },
        {
          method: "The Short Years",
          bestFor: "A printed first-year baby book, built from a weekly photo and a few questions.",
          check:
            "The app is free to download; you buy the book. Covers the first year, with an add-on to age five.",
        },
        {
          method: "Baby Notebook",
          bestFor: "A hardbound first-year book with weekly prompts and no layout work.",
          check:
            "First three chapters free. Plus is billed monthly and Premium yearly once the baby arrives.",
        },
        {
          method: "A notes app and a weekly reminder",
          bestFor: "Parents who only need the nudge and are happy with plain text.",
          check: "Free. Lives on one phone unless you share the note and export it.",
        },
      ],
    },
    sectionTitles: [
      "Why parents look for a Qeepsake alternative",
      "1. Everlittle: one archive the whole family adds to",
      "Everlittle or Qeepsake?",
      "2. Tinybeans, and Tinybeans vs Qeepsake",
      "3. The Short Years",
      "4. Baby Notebook",
      "5. A notes app and a weekly reminder",
      "Start with one memory",
    ],
    paragraphs: [
      [
        "Qeepsake sends you a question about your child by text message. You reply to the text and your answer is saved in that child’s journal. In the app you can add photos and video, edit entries and order the journal as a hardcover or softcover book. A partner or another relative can be added as a contributor.",
        `On ${CHECKED} the pricing page showed two plans. Essential was $4.99 a month, or $3.99 a month billed yearly, with two questions a day, up to 50 photo uploads a month and two journals. Premium was $9.99 a month, or $7.99 a month billed yearly, with four questions a day, up to 100 photo uploads a month and unlimited journals. Both start with a seven-day free trial, and both include credit toward a printed book.`,
        "The reasons people move on are easy to read from that list. The texts pile up unanswered, or the photo caps feel tight for the price. Often it is that you wanted the grandparents to see the memories and add to them, and found a journal that is mostly yours.",
      ],
      [
        "Everlittle is ours. It is a private family archive: photos, written stories, voice recordings, video, milestones and letters on one dated timeline, each with room for the story behind it.",
        "Qeepsake collects your answers. Everlittle collects everyone’s. Invite grandparents, aunts and uncles by email as Contributors and they add memories from their own phones: the photo from their visit, a story about you at the same age, a recording of the lullaby they sing. Invite them as Viewers if they would rather just look. Invited family are free on both plans, however many you add.",
        "What you write does not have to be read now. Seal a letter as a capsule with an opening date and it stays unreadable until that day, even to the person who wrote it. Your child can also have a view of their own, opened with a family PIN and no email account, which shows only what has been shared with them.",
        "You can start without paying and without a deadline. The free plan holds 100 MB, asks for no card and does not expire. The family plan is $6 a month or $60 a year for 25 GB. There are no ads, and nothing is public unless you create a link to a single memory, which expires after 30 days.",
      ],
      [
        "Qeepsake’s plans count photos: 50 uploads a month on Essential and 100 on Premium. Everlittle counts storage and leaves the number of photos to you. Qeepsake begins with a seven-day trial. Everlittle’s free plan has no end date, so you can add a memory a week for months before deciding anything.",
        "Qeepsake does two things Everlittle does not: it texts you questions every day, and it prints your journal as a book. It also has a phone app, where Everlittle is a web app you add to your home screen. Choose Qeepsake instead if the daily text is the only thing that gets you writing.",
        "If you can manage without the text, a list of prompts and a reminder on your phone does much the same work. The checklist of baby firsts is a good place to start, and each one you tick off is a memory to add.",
      ],
      [
        "They used to be rivals. On the App Store, Qeepsake is now published by Tinybeans USA Ltd, the same company that publishes Tinybeans, so this is a choice between two products from one owner.",
        "The difference is what each one asks of you. Qeepsake asks for a sentence: it sends a prompt and you type an answer. Tinybeans asks for a photo: you post it and the family sees it in the app or by email. Qeepsake ends in a printed journal. Tinybeans ends in a shared photo history, and it sells photo books too.",
        "On price, Tinybeans has a free plan with 20 uploads a month and 5 GB, and Tinybeans+ at $7.99 a month or $74.99 a year. Voice notes and exporting your memories are listed as Tinybeans+ features. Choose Tinybeans instead if relatives following along by email is the whole point.",
        "If you want the words and the family in one place, that is what Everlittle does.",
      ],
      [
        "The Short Years is a baby book with an app attached. Once a week the app reminds you to upload a photo and answer a couple of questions, and it turns those into finished pages. After you have bought the book, pages are printed and shipped each time you finish three chapters, and you add them to a ring-bound cover.",
        "It covers the first year in 119 pages, with an add-on that continues to age five. The app is free to download and the book is the purchase; the price was not shown on the pages we read, so check it at checkout. Choose it instead if the object on the shelf is what you want and you do not plan to keep going past the early years.",
      ],
      [
        "Baby Notebook works on the same idea: weekly reminders to add a photo or answer a prompt, with the layout done for you, and a hardbound book ordered at the end of the first year. You can hide pages that do not apply to your family, which helps if a standard baby book never fit.",
        "The first three chapters, covering pregnancy, family and home, are free without a card. After the baby arrives it offers a monthly Plus plan and a yearly Premium plan; the site did not state the prices when we looked. Like The Short Years, it is built around one book for one year.",
      ],
      [
        "If the prompt is what you valued, you can make one. Set a repeating reminder for Sunday evening that says “one thing they did this week”, and keep a single note per child with the newest entry at the top and the date at the start of each.",
        "It costs nothing. It also sits on one parent’s phone, holds no voices, and nobody else can add to it unless you share the note. The same Sunday reminder works just as well pointed at an archive the family shares.",
      ],
      [
        "Whichever you choose, keep your original photos somewhere of your own.",
        "To try Everlittle, add one photo from this week and write two sentences about it. Then invite one grandparent as a Contributor and ask them for a memory of their own. You will know within a few days whether it suits your family, and it will have cost you nothing.",
      ],
    ],
    sectionLinks: {
      "1": [START_FREE, SEE_PLANS],
      "2": [
        { href: "/baby-firsts-checklist", label: "A checklist of 90 baby firsts to record" },
        { href: "/baby-memory-journal", label: "How a baby memory journal works in Everlittle" },
      ],
      "3": [{ href: "/tinybeans-alternatives", label: "Tinybeans alternatives compared" }],
      "5": [{ href: "/best-baby-book-apps", label: "More baby book apps, compared" }],
      "6": [
        { href: "/baby-book-alternatives", label: "Nine baby book alternatives that are not apps" },
      ],
      "7": [{ href: "/sign-up", label: "Create your free archive and add the first memory" }],
    },
    sources: [
      QEEPSAKE_PRICING,
      QEEPSAKE_HELP,
      QEEPSAKE_STORE,
      TINYBEANS_STORE,
      TINYBEANS_PRICE,
      TINYBEANS_HOME,
      SHORT_YEARS_HOME,
      SHORT_YEARS_STORE,
      BABY_NOTEBOOK,
      EVERLITTLE_PRICING,
    ],
    sectionSources: {
      "0": [0, 1, 2],
      "1": [9],
      "2": [0, 2],
      "3": [2, 3, 4, 5],
      "4": [6, 7],
      "5": [8],
    },
  },
  {
    id: "storyworth-alternatives",
    category: "Family stories",
    kind: "Voice",
    title: "A Storyworth alternative that keeps a grandparent’s voice",
    searchTitle: "Storyworth Alternatives (2026): Keep Their Voice in a Family Archive",
    intro:
      "A Storyworth alternative for families who want the voice as well as the words: Everlittle keeps recordings, photos and sealed letters. Four others compared.",
    minutes: 8,
    published: "2026-10-06",
    lede: "Storyworth turns a year of written answers into a book. If what you want to keep is your mother telling the story in her own voice, beside the photographs it belongs to, and you want the family to go on adding after the year is up, try Everlittle. It is free to start.",
    quote: "Ask a small question, press record, and keep the answer where the family can find it.",
    relatedIds: ["grandparents", "long-distance-grandparenting"],
    comparison: {
      title: "Everlittle, Storyworth and the other alternatives at a glance",
      columns: ["Option", "Good at", "Cost and limits"],
      caption: CAPTION,
      rows: [
        everlittleRow(
          "A grandparent’s voice recordings, letters and photos kept in the family’s archive for a grandchild, with no end date and everyone adding.",
          "No weekly questions and no printed book.",
        ),
        {
          method: "Storyworth",
          bestFor: "A year of weekly questions answered in writing, bound into a hardcover book.",
          check:
            "Plans start at $59 and include one hardcover book. Telling stories over the phone is an upgrade.",
        },
        {
          method: "Remento",
          bestFor: "A storyteller who would rather speak. Recordings become a book with QR codes.",
          check:
            "$99 for the first year with one color hardcover. Extra copies $69. Renews at $99 a year or $12 a month.",
        },
        {
          method: "StoryCorps app",
          bestFor: "One long recorded conversation between two people, with suggested questions.",
          check:
            "Free on iPhone and Android. No book. Recordings can go to a public archive, so read the options.",
        },
        {
          method: "Storii",
          bestFor:
            "A grandparent with a landline and no smartphone. It phones them with a question.",
          check:
            "Three scheduled calls a week, with transcripts and an audiobook. Price shown at checkout.",
        },
        {
          method: "Your phone’s voice recorder",
          bestFor: "Starting this weekend with a list of questions and no account.",
          check: "Free. You do the asking, the naming of files and the backing up.",
        },
      ],
    },
    sectionTitles: [
      "Why families look for a Storyworth alternative",
      "1. Everlittle: their voice, kept beside the photographs",
      "Everlittle or Storyworth?",
      "Questions that get a story started",
      "2. Remento",
      "3. The StoryCorps app",
      "4. Storii",
      "5. Your phone’s voice recorder",
      "Start with one story this week",
    ],
    paragraphs: [
      [
        "Storyworth sends your parent or grandparent one question a week, by text or email, for a year. They answer by replying to the email, writing on the website or recording their voice over the phone, and at the end the answers are printed as a hardcover book. You can pick from a library of more than 500 questions or write your own.",
        `On ${CHECKED} its site advertised plans starting at $59, each including weekly questions and one hardcover book. Telling stories over the phone, with a guided interview or speech turned into text, is listed as an upgrade. A separate Unlimited plan includes two color books and any number of storytellers.`,
        "It has been doing this since 2013 and says it has printed a million books. Where families get stuck is the writing. Fifty-two essays is a lot to ask of someone who has not written at length since school, and a half-finished year can leave them feeling they let you down.",
        "The other reason is the voice. A book keeps what was said. It does not keep the accent, the pause before the punchline or the laugh, and for many grandchildren that is the part they will want.",
      ],
      [
        "Everlittle is ours. It is a private family archive built around a child: photos, written stories, voice recordings, video and letters on one dated timeline. A grandparent’s story goes in as a recording in their own voice and sits beside the photographs from the same years, so a grandchild finds it in context.",
        "It has no finish line. Storyworth runs for a year and ends in a book. An Everlittle archive stays open, and a story remembered at a birthday five years from now goes in the same way as the first one. Everyone you invite can add to it: a grandfather records, an aunt adds the photo he was describing, and you write down the part he left out.",
        "A grandparent can also write to the future. A letter sealed as a capsule stays unreadable until the date chosen, such as an eighteenth birthday, even to the person who wrote it. When your child is old enough, they can have their own view of the archive, opened with a family PIN and no email account.",
        "The archive is private and has no ads. People join by email invitation, and nothing is public unless you create a link to one memory, which expires after 30 days. The free plan is 100 MB with no card and no end date, enough to try a few recordings. The family plan is $6 a month or $60 a year for 25 GB, with any number of invited relatives.",
      ],
      [
        "Storyworth’s plans start at $59 and each includes a hardcover book. Everlittle is free to begin and prints nothing. Choose Storyworth instead if a bound book on the shelf is what you are after and your grandparent enjoys writing.",
        "Everlittle also does not send weekly questions or turn recordings into text. You ask the questions yourself, in person or on a call, and add the recording afterward from your phone or theirs. A grandparent who is not comfortable with a browser does not need an account at all, because you can add the recording for them.",
        "In return you keep the sound of them, with the family’s photographs, in a place that goes on growing.",
      ],
      [
        "Whatever you use, the question decides the answer. “Tell me about your childhood” gets a shrug. A small, concrete question gets a story. Ask one of these, record the answer, and add it with the date and the names of the people mentioned.",
      ],
      [
        "Remento is the closest thing to Storyworth, built around speaking. Each week it sends the storyteller a prompt by email or text. They tap the link and record on any device, with no app, login or password. Each recording is turned into a written chapter, either word for word or tidied into a narrative, and printed in a book where a QR code plays the original.",
        `On ${CHECKED} it cost $99 for the first year, including one color 8 by 10 inch hardcover of up to 380 pages. Additional copies were $69 each, and continuing after the first year was $99 a year or $12 a month.`,
        "Choose Remento instead if you want a book and your grandparent will not type. It is still a one-year project with a book as the goal.",
      ],
      [
        "StoryCorps is a nonprofit that has been recording conversations between ordinary people since 2003. Its free app, for iPhone and Android, helps you prepare questions and records the conversation on your phone.",
        "It is designed for one sitting: you and your grandmother at the kitchen table for forty minutes. There is no book and no weekly rhythm. Recordings can be uploaded to the StoryCorps Archive and the Library of Congress, which some families love and others would not want, so read the sharing options before you press record.",
      ],
      [
        "Storii phones the storyteller. It places up to three scheduled calls a week, asks a life-story question and records and transcribes the answer. A storyteller with only a landline can also call in to hear their next question, and the stories can be downloaded as an audiobook or an ebook.",
        "Choose Storii instead for a grandparent in their nineties who answers the phone and does nothing else with technology. Its pricing page did not display a price when we loaded it, so we have left the cost out. Check it at checkout.",
      ],
      [
        "Every phone has a recorder, and it is enough. Sit somewhere quiet, put the phone on a folded towel between you, say the date and both your names, and ask one question. Stop after twenty minutes; come back next week.",
        "The work lands on you. Name each file with the date and the subject on the same day, copy it to a second place and write two lines about what was said. Families who skip that step end up with forty files called “New Recording”. Adding each recording to Everlittle on the day you make it, with a title and a date, is one way to keep them findable.",
      ],
      [
        "Do not wait for the right tool. Record one story on your phone this week.",
        "Then give it a home. Create a free Everlittle archive, add the recording with its date, and invite the rest of the family to add what they remember.",
      ],
    ],
    lists: {
      "3": [
        "What did your kitchen smell like when you were small?",
        "Who was the first person you ever had a crush on?",
        "What was the naughtiest thing my mother or father did as a child?",
        "What did you do with your first pay packet?",
        "Which house did you love most, and what could you see from the window?",
        "What did your own grandparents call you?",
        "What is a thing you were sure about at thirty that you have changed your mind on?",
      ],
    },
    sectionLinks: {
      "1": [
        START_FREE,
        { href: "/letter-to-my-grandchild", label: "What to write in a letter to your grandchild" },
      ],
      "2": [SEE_PLANS],
      "3": [
        {
          href: "/grandparents-memory-project",
          label: "More prompts for the stories only grandparents can tell",
        },
      ],
      "7": [
        {
          href: "/tools/how-old-will-i-be",
          label: "See how old the grandparents will be at each of your child’s milestones",
        },
      ],
      "8": [
        { href: "/sign-up", label: "Create your free archive and add the first recording" },
        {
          href: "/long-distance-grandparenting-ideas",
          label: "Ideas for grandparents who live far away",
        },
      ],
    },
    sources: [
      { label: "Storyworth", href: "https://welcome.storyworth.com/" },
      { label: "Remento", href: "https://www.remento.co/" },
      { label: "StoryCorps: The StoryCorps App", href: "https://storycorps.org/app" },
      {
        label: "App Store: StoryCorps",
        href: "https://apps.apple.com/us/app/storycorps/id359071069",
      },
      { label: "Storii: Pricing", href: "https://www.storii.com/pricing" },
      EVERLITTLE_PRICING,
    ],
    sectionSources: { "0": [0], "1": [5], "2": [0], "4": [1], "5": [2, 3], "6": [4] },
  },
  {
    id: "photo-sharing-apps",
    category: "Family stories",
    kind: "Photo",
    title: "FamilyAlbum vs Google Photos vs Tinybeans, and where Everlittle fits",
    searchTitle:
      "Family Photo Sharing Apps: FamilyAlbum vs Google Photos vs Tinybeans vs Everlittle",
    intro:
      "FamilyAlbum, Google Photos and Tinybeans compared for family photo sharing, and why the photos you want kept belong in Everlittle with their story.",
    minutes: 8,
    published: "2026-10-06",
    lede: "FamilyAlbum, a Google Photos shared album and Tinybeans all get today’s photos in front of relatives quickly. They are built for the stream. Everlittle is built for the photos you want your child to have one day: each is kept with its story, the family’s voices and their own memories of it. It is free to start, and it works well beside whichever photo app you already use.",
    quote: "Share the stream wherever it is easiest. Keep the ones that matter with their story.",
    relatedIds: ["tinybeans-alternatives", "grandparent-sharing"],
    comparison: {
      title: "The four apps side by side",
      columns: ["App", "Good at", "Cost and limits"],
      caption: CAPTION,
      rows: [
        everlittleRow(
          "The photos you want kept, each with its story, plus voice recordings, video and sealed letters. Relatives add their own.",
          "A web app; it does not upload your camera roll.",
        ),
        {
          method: "FamilyAlbum",
          bestFor:
            "Unlimited photos and short videos, sorted by month. Relatives can view in a browser without an account.",
          check:
            "Free. Videos up to 2 minutes. Premium Family is $5.99 a month or $59 a year for 10-minute videos and uploading from a computer.",
        },
        {
          method: "Google Photos shared album",
          bestFor: "No new app. Relatives can comment, like and add their own photos.",
          check:
            "Free within the 15 GB shared across Gmail, Drive and Photos. Anyone with the album link can view and add.",
        },
        {
          method: "Tinybeans",
          bestFor: "Relatives follow by email update or in the app. Photo books in the app.",
          check:
            "Free with 20 uploads a month and 5 GB. Tinybeans+ is $7.99 a month or $74.99 a year for unlimited uploads and 200 GB, without ads.",
        },
      ],
    },
    sectionTitles: [
      "The short answer",
      "Everlittle: where a photo gets its story",
      "FamilyAlbum",
      "A Google Photos shared album",
      "Tinybeans",
      "What parents on Reddit say",
      "How private is each one?",
      "Common questions",
      "Give this week’s best photo its story",
    ],
    paragraphs: [
      [
        "For getting a lot of photos to relatives fast, pick by who has to do the work. Google Photos asks the least of you, because the photos are already there. FamilyAlbum asks the least of grandparents, because it was made for them. Tinybeans asks the least of relatives who will never install an app, because it emails them.",
        "For the photos that will matter in ten years, use Everlittle, on its own or beside one of those. A shared album can tell your daughter what she looked like at eight months. It takes a sentence, a voice or a letter to tell her what she was like, and Everlittle is where those are kept with the photograph.",
      ],
      [
        "Everlittle is ours. It is a private family archive where each photo goes on a dated timeline with a title and the story behind it. Voice recordings, video, milestones, written stories and letters sit on the same timeline.",
        "Sharing works by invitation. Relatives join by email as Viewers or Contributors, and a grandparent invited as a Contributor adds photos and stories of their own. Each memory has its own audience, so you decide whether it is for the two of you, the invited family or your child.",
        "A letter can be sealed until a date you choose, and it stays unreadable until then, even to you. Your child can have a view of their own, opened with a family PIN and no email account, which shows only what you have shared with them.",
        "It costs nothing to start: 100 MB with no card and no end date, and no ads. The family plan is $6 a month or $60 a year for 25 GB, with any number of invited relatives.",
        "For sheer volume the three apps below do more. Everlittle is a web app you add to your home screen, with no App Store or Google Play app, and it does not upload your camera roll or email relatives when you post. Use it for the handful of photos each month that deserve an explanation.",
      ],
      [
        "FamilyAlbum is made by MIXI and is free with unlimited storage for photos and videos. It sorts everything by month, relatives can comment and react, and only people you invite can see the album. They can use the iPhone or Android app, or view in a browser without creating an account.",
        `The free plan limits each video to two minutes. Premium Family, at $5.99 a month or $59 a year on ${CHECKED}, raises that to ten minutes and adds uploading from a computer and a page per child. A higher tier, Premium Family Pro, was $10.99 a month or $109 a year. One subscription covers everybody in the album.`,
        "It also sells photo books and prints made from your album, and parents notice the suggestions to buy them. Choose it for the stream if you post many photos a week and want to pay nothing.",
      ],
      [
        "A shared album in Google Photos is the option many parents reach for first. Select photos, create an album, share it with the people you choose. Members can comment, like and add their own pictures, which is handy when grandparents visit and take photos of their own.",
        "Storage is shared. Each Google Account has up to 15 GB across Gmail, Drive and Photos, and photos you back up count toward it. More storage is sold through Google One.",
        "It is a general photo tool and it feels like one. There is no month-by-month baby view and nothing reminds relatives to look. Choose it for the stream if both parents already back up to Google Photos and the family is comfortable with Google accounts.",
      ],
      [
        "Tinybeans is a photo journal for one child or family. Its distinguishing feature is email: relatives can comment and react in the app or through email updates, so a grandparent with no smartphone can still follow along.",
        `The free plan allowed 20 uploads a month and 5 GB on ${CHECKED}. Tinybeans+ was $7.99 a month or $74.99 a year, with unlimited uploads, videos up to five minutes, 200 GB and no ads for you or your followers.`,
        "Twenty uploads a month is the limit most new parents hit. Choose Tinybeans for the stream if the email updates are what will get your relatives looking, and budget for the paid plan.",
      ],
      [
        "In a 55-comment r/daddit thread on sharing photos with family, FamilyAlbum was the most upvoted answer, followed by a Google Photos album shared with relatives. One father listed FamilyAlbum’s good points as security, price and the short videos it makes automatically, and its drawbacks as captions and the photo books his household keeps buying. Another said a grandparent of nearly ninety uses it.",
        "In r/BabyBumps, a relative on the receiving end said FamilyAlbum was easy for their older parents, though they needed a fresh invitation link after changing phones. A Google Photos user in the same thread liked that family can comment and save photos, and another said the album feeds a smart display at the grandparents’ house.",
        "Tinybeans gets fewer mentions in these threads. The complaint about captions is worth noticing, because the caption is where Everlittle starts: every photo has room for its story.",
      ],
      [
        "None of the four posts your photos publicly. The differences are in how someone gets in.",
        "FamilyAlbum and Tinybeans are invitation-based. In Google Photos you can invite specific people, or share a link, and Google’s own help page says anyone with the link can view the photos and add to the album. If you use Google Photos, invite named accounts and avoid pasting the link into a large group chat.",
        "Everlittle is invitation-only, with a role for each relative and an audience on each memory. A public link exists only when the author of a memory creates one. It covers that single memory, it expires after 30 days and it can be switched off sooner. Everlittle shows no ads on either plan.",
        "In all four, a relative who can see a photo can screenshot or save it. No setting changes that. Have one conversation with the family about not reposting pictures of your child, and leave school uniforms and house numbers out of the frame.",
      ],
      [
        "Which is the best family photo sharing app? For volume, FamilyAlbum is the one parents on Reddit name most often. For photos kept with their stories and voices, Everlittle.",
        "Is FamilyAlbum really free? Yes. Storage and uploads are unlimited on the free plan, and the main limit is two minutes per video. The paid tiers add longer videos and extras.",
        "Do grandparents need a Google Account for a shared album? Not if you share by link, but then anyone who has the link can open it. Inviting them by account is safer.",
        "Is Everlittle free? Yes, up to 100 MB, with no card and no expiry. The relatives you invite are free on both plans.",
        "Can I use more than one? Yes. A shared album for everything and Everlittle for the photos that come with a story make a sensible pair.",
      ],
      [
        "Pick one photo from this week. Add it to a free Everlittle archive with the date and two sentences about what was going on, then invite a grandparent to add what they remember. That is the whole test, and you can do it tonight.",
      ],
    ],
    sectionLinks: {
      "1": [START_FREE, SEE_PLANS],
      "4": [{ href: "/tinybeans-alternatives", label: "Tinybeans alternatives compared" }],
      "6": [
        { href: "/private-family-photo-sharing", label: "How to share family photos privately" },
      ],
      "8": [
        { href: "/sign-up", label: "Create your free archive and add the first photo" },
        {
          href: "/sharing-photos-with-grandparents",
          label: "Photo sharing for grandparents, step by step",
        },
      ],
    },
    sources: [
      FAMILYALBUM_HOME,
      FAMILYALBUM_FREE,
      FAMILYALBUM_STORE,
      GOOGLE_SHARING,
      GOOGLE_STORAGE,
      TINYBEANS_HOME,
      TINYBEANS_PRICE,
      TINYBEANS_STORAGE,
      TINYBEANS_STORE,
      REDDIT_DADDIT,
      REDDIT_BABYBUMPS,
      EVERLITTLE_PRICING,
    ],
    sectionSources: {
      "1": [11],
      "2": [0, 1, 2],
      "3": [3, 4],
      "4": [5, 6, 7, 8],
      "5": [9, 10],
      "6": [3],
    },
  },
  {
    id: "baby-book-apps",
    category: "Everyday memories",
    kind: "Milestone",
    title: "Best baby book apps, starting with one that grows with your child",
    searchTitle: "Best Baby Book Apps in 2026: 6 Compared, and One That Grows With Them",
    intro:
      "Six baby book apps compared. Everlittle keeps photos, voices and sealed letters past the first year, with a view for your child. Free to start.",
    minutes: 9,
    published: "2026-10-06",
    lede: "Some baby book apps stop at the first birthday. Others keep every photo and none of the words. Everlittle is the one we make and the one we would start with: a private archive of photos, stories, voice recordings and sealed letters that carries on as your child grows, and that they can open themselves one day. If you want a printed book instead, look at The Short Years or Baby Notebook.",
    quote: "Write it for the person who will read it at eighteen.",
    relatedIds: ["baby-book-alternatives", "little-journal"],
    comparison: {
      title: "Six baby book apps at a glance",
      columns: ["App", "What you end up with", "Cost and limits"],
      caption: CAPTION,
      rows: [
        everlittleRow(
          "A dated archive of photos, stories, voice recordings, video, milestones and sealed letters that continues past the first year, with a view for the child.",
          "A web app; no printed book.",
        ),
        {
          method: "The Short Years",
          bestFor: "A ring-bound printed baby book of the first year, with pages mailed as you go.",
          check: "App free to download; the book is the purchase. Add-on continues to age five.",
        },
        {
          method: "Baby Notebook",
          bestFor: "A hardbound first-year book, laid out for you from weekly prompts.",
          check: "First three chapters free. Plus billed monthly, Premium yearly.",
        },
        {
          method: "Qeepsake",
          bestFor: "A written journal built from text-message prompts, printable as a book.",
          check: "Essential $4.99 a month, Premium $9.99 a month. 7-day free trial.",
        },
        {
          method: "Tinybeans",
          bestFor: "A private photo journal relatives follow in the app or by email.",
          check:
            "Free with 20 uploads a month and 5 GB. Tinybeans+ $7.99 a month or $74.99 a year.",
        },
        {
          method: "FamilyAlbum",
          bestFor: "Every photo and short video, sorted by month and shared with family.",
          check: "Free with unlimited storage. Videos up to 2 minutes unless you pay.",
        },
      ],
    },
    sectionTitles: [
      "What to look for in a baby book app",
      "1. Everlittle",
      "2. The Short Years",
      "3. Baby Notebook",
      "4. Qeepsake",
      "5. Tinybeans",
      "6. FamilyAlbum",
      "Often recommended, but really trackers",
      "How to pick, and how to start",
    ],
    paragraphs: [
      [
        "“Baby book app” covers three different things. Some apps produce a printed book of the first year. Some keep a journal or a photo stream. And some are trackers for feeds and sleep that happen to have a notes field.",
        "Before you choose, ask what you want to exist in ten years and who will be looking at it. If the answer is your child, look for an app that keeps going after the first birthday, holds voices as well as pictures and lets the rest of the family add what they remember.",
        `We make Everlittle, so it comes first here and gets the most room. For the other apps, we read each company’s own website and App Store listing on ${CHECKED} and noted what it says the app does, what it costs and where it stops. We also read a Reddit thread in r/NewParents where a parent asked for a baby book in app form. We have not used each one with a baby for a year.`,
      ],
      [
        "Everlittle keeps photos, short stories, voice recordings, video, milestones and letters on one dated timeline, in a private archive your family joins by email invitation. The first steps can go in as a milestone with the date and the story of what happened just before, next to a video from that week and a recording of what they sounded like.",
        "It does not stop at twelve months. The same timeline takes the first day of school and the first lost tooth, and grandparents invited as Contributors add their own photos and stories as the years go by.",
        "Two things set it apart from the rest of this list. A letter can be sealed until a date you choose, such as an eighteenth birthday, and it stays unreadable until then, even to you. And your child can have their own view, opened with a family PIN and no email account, showing what you have shared with them.",
        "It is private and has no ads. Nothing is public unless you create a link to a single memory, which expires after 30 days. The free plan is 100 MB with no card and no end date, and the family plan is $6 a month or $60 a year for 25 GB, with any number of invited relatives.",
        "Everlittle does not print a book or send you prompts, and it is a web app you add to your home screen, with no App Store or Google Play app. If a printed book is what you want, one of the next two will suit you better.",
      ],
      [
        "The Short Years is the nearest thing to a traditional baby book that fills itself in. Once a week the app reminds you to upload a photo and answer a couple of questions about milestones and moments. It lays those out as pages, and once you have bought the book it prints and ships them each time you finish three chapters. You add them to a fabric-covered binder.",
        "The first year runs to 119 pages with room for more than 350 photos, and video can be included through QR codes. A Toddler Years add-on carries on to age five. The app is free to download on iPhone and Android; the price of the book was not on the pages we read.",
        "Choose it instead if you want an heirloom on a shelf and you like being told what to write. It stops when the book does.",
      ],
      [
        "Baby Notebook calls itself a modern baby book, and the selling point is that the design is done. Weekly notifications ask for a photo or a short answer at a time you set. You can hide pages, swap layouts and rename headings, which makes it friendlier to families a printed baby book’s fixed pages leave out.",
        "The pregnancy, family and home chapters are free without a card. After the birth it offers a monthly Plus plan and a yearly Premium plan, and the finished hardbound book is ordered after the first birthday. Its site says prices are comparable to a quality photo book and does not list them.",
        "Choose it for the same reason as The Short Years, if you prefer its look or its flexibility.",
      ],
      [
        "Qeepsake is a journal more than a book. It sends age-appropriate questions by text message, from pregnancy into the school years, and saves your replies. One parent in the Reddit thread said those texts were what finally got them writing things down. You can add photos and video in the app and order the journal as a hardcover or softcover book.",
        `Essential was $4.99 a month, with two questions a day and up to 50 photo uploads a month, on ${CHECKED}. Premium was $9.99 a month with four questions a day. Both begin with a seven-day free trial. Qeepsake is now published by the company behind Tinybeans.`,
        "Choose it instead if a daily text is what gets you writing.",
      ],
      [
        "Tinybeans is a private photo journal built for sharing. Relatives follow in the app or get email updates, and photo books can be made in the app. Choose it instead if the main reader of your baby book is a grandparent who prefers email.",
        "The free plan allows 20 uploads a month and 5 GB. Tinybeans+ is $7.99 a month or $74.99 a year for unlimited uploads, five-minute videos, 200 GB and no ads.",
      ],
      [
        "FamilyAlbum is a shared album and makes no claim to be a baby book, but many parents use it as one because it sorts everything by month and costs nothing. Storage is unlimited on the free plan; videos are capped at two minutes unless you subscribe. It sells photo books made from your album.",
        "A parent in a separate Reddit thread, asking for a baby photo app without a subscription, got FamilyAlbum as the top answer. Choose it instead if you want the pictures safe and seen, and are happy to do without written entries.",
      ],
      [
        "Three apps came up in the Reddit thread that are worth knowing about and are not baby books. Nara Baby is a tracker, free to download, for feeds, sleep and diapers that several caregivers can share; you can attach photos and notes to entries, and one parent in the thread called it excellent as a tracker and too bare to be a baby book.",
        "Glow Baby is also a tracker, with a timeline of what you have logged and a paid Premium tier. BabySparks is a program of development activities for children up to three, with milestone tracking, sold by subscription. All three are useful in the first months. None is designed to hand your child their story later.",
      ],
      [
        "Start from what you want to exist in ten years. A book on a shelf: The Short Years or Baby Notebook. A daily question by text: Qeepsake. Every photo in front of the family: FamilyAlbum or Tinybeans. An archive of photos, voices and letters that your child can open: Everlittle.",
        "Whichever you choose, keep your original photos somewhere of your own and find out how you would get your entries out.",
        "To try Everlittle, add one memory tonight: a photo, the date and two sentences. The checklist of baby firsts will give you plenty more to add.",
      ],
    ],
    sectionLinks: {
      "1": [
        START_FREE,
        { href: "/baby-memory-journal", label: "How a baby memory journal works in Everlittle" },
        SEE_PLANS,
      ],
      "4": [
        {
          href: "/qeepsake-alternatives",
          label: "Qeepsake alternatives, and Tinybeans vs Qeepsake",
        },
      ],
      "5": [{ href: "/tinybeans-alternatives", label: "Tinybeans alternatives compared" }],
      "6": [
        {
          href: "/familyalbum-vs-google-photos-vs-tinybeans",
          label: "FamilyAlbum vs Google Photos vs Tinybeans",
        },
      ],
      "8": [
        { href: "/sign-up", label: "Create your free archive and add the first memory" },
        { href: "/baby-firsts-checklist", label: "A checklist of 90 baby firsts to record" },
        { href: "/baby-book-alternatives", label: "Nine baby book alternatives that are not apps" },
      ],
    },
    sources: [
      REDDIT_NEWPARENTS,
      SHORT_YEARS_HOME,
      SHORT_YEARS_STORE,
      BABY_NOTEBOOK,
      {
        label: "App Store: Baby Notebook",
        href: "https://apps.apple.com/us/app/baby-notebook-photo-book/id1518127990",
      },
      QEEPSAKE_PRICING,
      QEEPSAKE_STORE,
      TINYBEANS_PRICE,
      TINYBEANS_STORE,
      FAMILYALBUM_HOME,
      FAMILYALBUM_FREE,
      {
        label: "Reddit, r/Mommit: “Are there any baby photo milestone apps that don’t require…”",
        href: "https://www.reddit.com/r/Mommit/comments/1f2xdua/are_there_any_baby_photo_milestone_apps_that_dont/",
      },
      EVERLITTLE_PRICING,
      {
        label: "App Store: Nara Baby & Pregnancy Tracker",
        href: "https://apps.apple.com/us/app/nara-baby-pregnancy-tracker/id1444639029",
      },
      {
        label: "App Store: Glow Baby Tracker & Growth App",
        href: "https://apps.apple.com/us/app/glow-baby-tracker-growth-app/id1077177456",
      },
      { label: "BabySparks", href: "https://babysparks.com/" },
    ],
    sectionSources: {
      "0": [0],
      "1": [12],
      "2": [1, 2],
      "3": [3, 4],
      "4": [5, 6, 0],
      "5": [7, 8],
      "6": [9, 10, 11],
      "7": [0, 13, 14, 15],
    },
  },
];

export const comparisonArticlePaths: Record<string, string> = {
  "tinybeans-alternatives": "/tinybeans-alternatives",
  "qeepsake-alternatives": "/qeepsake-alternatives",
  "storyworth-alternatives": "/storyworth-alternatives",
  "photo-sharing-apps": "/familyalbum-vs-google-photos-vs-tinybeans",
  "baby-book-apps": "/best-baby-book-apps",
};
