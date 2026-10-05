import type { JournalArticle } from "./journal-articles";

// Search-led guides: examples, templates and checklists people look for by name.
export const guideArticles: JournalArticle[] = [
  {
    id: "capsule-letter-examples",
    category: "Letters for later",
    kind: "Letter",
    title: "Time capsule letter to your child: examples and a template",
    intro:
      "Six short example letters from parents and grandparents, a fill-in template and prompts for writing a time capsule letter your child will want to keep.",
    minutes: 7,
    published: "2026-10-05",
    lede: "A good time capsule letter describes one real day. Say who your child is right now, what your life together looks like and what you hope they know when they open it. Half a page is plenty.",
    quote: "Write what a photograph could not show them.",
    relatedIds: ["first-birthday-capsule", "time-capsule"],
    sectionTitles: [
      "What to put in a time capsule letter",
      "A fill-in template",
      "Example letter from a parent to a baby",
      "Example letter for a kindergarten time capsule",
      "Example letter to an older child",
      "Example letters from a grandparent",
      "A short example for a card or guest book",
      "Prompts if you are stuck",
      "Where to keep the letter until it opens",
    ],
    paragraphs: [
      [
        "Your child will open this letter knowing how the story turned out. What they will not know is what an ordinary Tuesday felt like when they were small. That is the part worth writing down.",
        "Most letters that land well have four ingredients: the date and where you are writing, a few specific details about your child right now, something about your own life at this moment, and a wish that does not depend on who they turn out to be.",
      ],
      [
        "Copy this and replace the brackets. Delete any line that does not sound like you.",
        "“Dear [name], I am writing this on [date] at [place]. You are [age] and right now you [habit or favorite thing]. Your favorite [food, song, book or toy] is [detail]. The thing you say that makes us laugh is ‘[phrase]’. A normal day for us looks like [two sentences]. Something I am learning as your [mom, dad, grandparent] is [one sentence]. I do not know what your life looks like as you read this, but I hope you know [wish]. Whatever has happened between this page and today, [reassurance]. Love, [name].”",
      ],
      [
        "“Dear Maya, You are eleven months old and you are asleep on my chest while I type this with one hand. You have four teeth and you use all of them on the corner of your board books. You wave at the ceiling fan every morning as if it is an old friend.",
        "We live in the apartment on Calder Street with the radiator that knocks. Your dad sings the same made-up song at every diaper change. I am tired in a way I did not know was possible, and I have never laughed so much. I hope you are reading this somewhere you feel at home. You already made one for us. Love, Mom.”",
      ],
      [
        "Teachers often ask families to write a letter that is sealed until the end of the school year or until graduation. Keep it concrete and kind.",
        "“Dear Theo, Today is your first week of kindergarten. You picked the dinosaur backpack and you told me you were ‘only a little bit nervous in my tummy.’ You can write your name, count to forty and explain exactly why sharks are not mammals. You wanted to walk the last block by yourself, so I stood at the corner and watched you do it. By the time you read this you will have learned a thousand things I cannot imagine yet. I hope you are still asking why. I am so proud of you, today and on the day you open this. Love, Dad.”",
      ],
      [
        "“Dear Sam, You are nine and you have just beaten me at chess for the first time. You tried not to smile about it and failed. This year you learned to ride without holding the handlebars, started reading under the covers with a flashlight and decided you do not like being hugged in front of school.",
        "I am writing this because one day you will be taller than me and I want you to know that I noticed the small things. If you are reading this at eighteen: you do not have to have anything figured out. Call me anyway. Love, Mom.”",
      ],
      [
        "From a grandmother: “Dear Lucía, I am your abuela and today you are two. You came to my house and went straight to the drawer where I keep the wooden spoons, as you always do. When I was your age I lived in a house with a lemon tree and no telephone. I want you to know where you come from, so I have written the names of my mother and her mother on the back of this page. You have her eyebrows. With all my love, Abuela.”",
        "From a grandfather to a newborn: “Dear Owen, I held you for the first time on Saturday. You weigh less than my toolbox. I have been a carpenter for forty years and I have never been so careful with anything. I do not know how many of your birthdays I will see, so I am putting this in writing: I was here at the very beginning, and I was glad. Grandpa.”",
      ],
      [
        "Party guests are often handed a small card and thirty seconds. Three sentences are enough: one memory, one detail about today and one wish.",
        "“Dear Noah, Today you turned one and put both hands in the cake. I have known your mom since we were twelve, and you have her laugh. I hope you always dive in like that. Love, Aunt Priya.”",
      ],
      ["Answer any three of these and you have a letter."],
      [
        "A paper letter in a labelled envelope works well if someone will remember where it is in fifteen years. Tell a second adult where it is kept and write the opening date on the outside.",
        "A digital copy protects against a lost box or a house move. In Everlittle you can save a letter as a future capsule with an opening date, and add a voice recording or photographs from the same day beside it. Whichever you choose, keep a second copy of anything you could not rewrite.",
      ],
    ],
    lists: {
      "0": [
        "The date, your child’s exact age and where you are sitting",
        "Two or three things they do or say right now",
        "What a normal day looks like for your family",
        "Something you are finding hard or funny as a parent",
        "Prices, songs or news that will feel dated later",
        "A wish that will still be true whoever they become",
      ],
      "7": [
        "What is the first thing you do together every morning?",
        "What word do they mispronounce that you hope they never fix?",
        "What do they ask for at bedtime?",
        "Who do they light up for?",
        "What surprised you most about them this year?",
        "What did today cost: a coffee, a loaf of bread, a tank of fuel?",
        "What do you hope they forgive you for?",
        "What do you want them to remember about their grandparents?",
        "What would you tell them on a hard day?",
        "What are you doing right now, as you write?",
      ],
    },
    sectionLinks: {
      "8": [
        {
          href: "/digital-time-capsule-for-kids",
          label: "How to make a digital time capsule for your child",
        },
        { href: "/tools/time-capsule-letter-prompts", label: "Get a set of letter prompts by age" },
      ],
    },
  },
  {
    id: "first-birthday-capsule",
    category: "Letters for later",
    kind: "Keepsake",
    title: "First birthday time capsule: letters to open at 18",
    intro:
      "How to run a first birthday time capsule, what to ask guests to write, wording for the invitation and example messages for letters your child opens at 18.",
    minutes: 6,
    published: "2026-10-05",
    lede: "Ask each guest for one short letter, give them a prompt so nobody stares at a blank card, and decide before the party who will keep the box. The letters matter far more than the objects.",
    quote: "At eighteen they will read the handwriting before they read the words.",
    relatedIds: ["capsule-letter-examples", "eighteen-letters"],
    sectionTitles: [
      "How a first birthday time capsule works",
      "Wording for the invitation",
      "Prompts to print on guest cards",
      "Example guest messages",
      "What to put in besides letters",
      "What to leave out",
      "Include the people who cannot be there",
      "Sealing it and keeping it safe for 17 years",
    ],
    paragraphs: [
      [
        "Guests write a note to the birthday child during the party or bring one with them. The notes go into a box with a few items from the year, and the box is sealed until an agreed date. Eighteenth birthdays are the most common choice; some families open at sixteen, at graduation or at ten and then reseal.",
        "Tell people in advance. A guest who knows about the capsule a week ahead writes a better letter than one handed a pen next to the cake.",
      ],
      [
        "Add two or three lines to the invitation so nobody is surprised.",
        "“We are making a time capsule for Ava to open on her 18th birthday. Please bring a short note for her: a memory, a wish or a piece of advice. Cards will be at the party if you would rather write there.”",
        "For relatives far away: “If you cannot join us, send your letter by post or record a short message and we will add it to the capsule for you.”",
      ],
      [
        "A prompt on each card gets you specific letters instead of twenty versions of “Happy birthday, we love you.” Print one per card and let guests choose.",
      ],
      [
        "From a godparent: “Dear Ava, You are one today and you spent the party trying to eat the wrapping paper. I promised your parents I would be the adult you can call when you do not want to call them. That offer has no expiry date. Love, Jo.”",
        "From a grandparent: “My dear Ava, I rocked your mother in the same chair you fell asleep in this afternoon. By the time you read this I will be very old or a story. Either way: you were adored from the first minute. Nana.”",
        "From a cousin, aged seven: “Dear Ava, you are a baby. I am teaching you to high five. When you are 18 I will be 24. From Leo.”",
      ],
      ["Choose flat, dry, durable things that say something about this particular year."],
      [
        "Skip anything that degrades or leaks: food, balloons, batteries, rubber bands, newspaper touching photographs. Do not rely on a USB stick or a phone as the only copy of a video. Storage formats change, and a drive that sits untouched for eighteen years may not be readable.",
      ],
      [
        "Many first birthdays now have more loved ones watching on a screen than standing in the room. Give distant grandparents, aunts and friends the same prompt and a deadline a few days before the party.",
        "A voice recording is worth asking for. A grandparent reading their own letter aloud keeps the accent, the pauses and the laugh. In Everlittle, an invited relative can add a letter, a photograph or a voice note to the family archive from their own browser, and you can keep those contributions in a capsule with an opening date.",
      ],
      [
        "Write the opening date and the child’s full name on the outside. Store the box somewhere dry and stable in temperature, such as a wardrobe shelf. Lofts, garages and basements are hard on paper.",
        "Photograph or scan every letter before sealing. It takes ten minutes and it is the difference between a keepsake and a single point of failure. Tell one other adult where the box and the copies are kept.",
      ],
    ],
    lists: {
      "2": [
        "My first memory of you is…",
        "Today you were wearing… and you spent the party…",
        "Something your parents do not know I noticed about them this year…",
        "The thing I hope you inherit from your family is…",
        "By the time you read this, I hope you have…",
        "One piece of advice I wish I had been given at 18…",
        "A song, film or book from this year you should look up…",
        "If you ever need me, here is what I want you to know…",
      ],
      "4": [
        "A photograph of everyone who came, with names written on the back",
        "The invitation and a party napkin or hat",
        "A handprint or footprint",
        "A list of first words, favorite foods and nicknames",
        "The outfit they wore, in a sealed bag",
        "A receipt or price list from this week",
        "The front page of a newspaper, kept in its own sleeve",
        "A letter from each parent, written separately",
      ],
    },
    sectionLinks: {
      "3": [
        {
          href: "/time-capsule-letter-to-child-examples",
          label: "More time capsule letter examples and a template",
        },
      ],
      "7": [
        {
          href: "/tools/how-old-will-i-be",
          label: "See how old everyone will be on the day it opens",
        },
      ],
    },
  },
  {
    id: "birthday-interview",
    category: "Everyday memories",
    kind: "Voice",
    title: "Birthday interview questions for kids, by age",
    intro:
      "Questions to ask your child every year on their birthday, sorted by age from 2 to the teens, with tips for recording the answers so you can compare them later.",
    minutes: 6,
    published: "2026-10-05",
    lede: "Ask the same core questions every birthday and record the answers. Ten questions are enough. The value is in the comparison: the year the favorite color changed, the year the voice dropped.",
    quote: "The questions stay the same. The person answering does not.",
    relatedIds: ["baby-firsts", "small-firsts"],
    sectionTitles: [
      "How a birthday interview works",
      "The 12 questions to repeat every year",
      "Questions for ages 2 and 3",
      "Questions for ages 4 to 6",
      "Questions for ages 7 to 10",
      "Questions for tweens and teens",
      "How to record the answers",
      "Keeping the interviews together",
    ],
    paragraphs: [
      [
        "Once a year, on or near their birthday, you ask your child a short set of questions and keep the answers. Some families write them in a notebook. A recording is better, because a four-year-old’s voice is gone by the time they are six.",
        "Keep it short and do it when they are fed and rested. If they refuse, try again at the weekend. The date on the recording matters less than the habit.",
      ],
      [
        "Use these every year without changing the wording. They work from about age three to eighteen.",
      ],
      [
        "Two- and three-year-olds answer with whatever is in front of them, which is the charm. Ask five questions at most and accept every answer.",
      ],
      [
        "This is the golden age for interviews: old enough to answer, young enough to say something wonderful by accident.",
      ],
      [
        "Older children enjoy being asked for opinions. Add questions that let them explain something to you.",
      ],
      [
        "Teenagers may prefer to write answers or record them alone. Offer both. Ask for less and listen for longer.",
      ],
      [
        "Use your phone’s voice memo or video camera and hold it low so they are talking to you and not to a lens. Say the date and their age at the start. Do not correct their answers or prompt the “right” one; the wrong ones are what you will replay.",
        "Type the answers afterwards as well. A transcript is quicker to compare year to year, and it survives if the audio file does not.",
      ],
      [
        "Recordings scattered across phones are difficult to find after ten years. Name each file with the child’s name and age, and keep them in one place with a backup.",
        "In Everlittle, you can add each year’s interview as a voice or video memory with the written answers alongside it, so the whole set sits on your child’s timeline in order. Grandparents you have invited can listen too.",
      ],
    ],
    lists: {
      "1": [
        "How old are you today?",
        "What is your favorite color?",
        "What is your favorite food?",
        "Who is your best friend?",
        "What is your favorite thing to do?",
        "What is your favorite book or show?",
        "What makes you laugh?",
        "What are you really good at?",
        "What do you want to be when you grow up?",
        "What is your favorite thing about our family?",
        "What was the best day of this year?",
        "What do you want to do before your next birthday?",
      ],
      "2": [
        "What is your name?",
        "What does a dog say?",
        "What do you like to eat?",
        "Who do you love?",
        "What is your favorite toy?",
        "Can you sing me a song?",
        "What do you want for your birthday?",
      ],
      "3": [
        "How old is Mommy or Daddy?",
        "What do grown-ups do all day?",
        "What is the best thing about being your age?",
        "What are you scared of?",
        "If you had one hundred dollars, what would you buy?",
        "What is the yuckiest food?",
        "Where would you like to go on holiday?",
        "What is your favorite thing to do with Grandma or Grandpa?",
        "What do you dream about?",
      ],
      "4": [
        "What is something you learned this year that was hard?",
        "What is the best book you read?",
        "Who do you sit with at lunch?",
        "What is one rule you would change at home?",
        "What do you think you will be like at 18?",
        "What is something kind someone did for you?",
        "What do you wish adults understood about kids?",
        "What are you proud of?",
      ],
      "5": [
        "What three words describe you right now?",
        "What song have you played most this year?",
        "What do you and your friends talk about?",
        "What is something you changed your mind about?",
        "What are you looking forward to?",
        "What worries you?",
        "What would you tell yourself at this age last year?",
        "What do you want me to remember about you at this age?",
      ],
    },
    sectionLinks: {
      "1": [
        {
          href: "/tools/birthday-interview-questions",
          label: "Build a printable question sheet for your child’s age",
        },
      ],
    },
  },
  {
    id: "first-birthday-letter",
    category: "Letters for later",
    kind: "Letter",
    title: "A letter to my baby on their first birthday: examples to borrow",
    searchTitle: "Letter to My Daughter or Son on Their First Birthday: Examples",
    intro:
      "Example first birthday letters to a daughter and a son, from mom and from dad, with a short version and a simple structure for writing your own.",
    minutes: 5,
    published: "2026-10-05",
    lede: "Write it this week while the details are still sharp. Describe your baby as they are at twelve months, tell them one story from the year and say one thing you learned. It does not need to be long or polished.",
    quote: "You will not remember this year. That is why I am writing it down.",
    relatedIds: ["capsule-letter-examples", "future-letter"],
    sectionTitles: [
      "A simple structure",
      "Letter to my daughter on her first birthday",
      "Letter to my son on his first birthday",
      "A first birthday letter from dad",
      "A short version",
      "A letter to a second or third child",
      "Details worth including",
      "Make it a yearly letter",
    ],
    paragraphs: [
      [
        "Four paragraphs will carry the whole letter: who they are right now, a story from the year, what the year was like for you, and a wish. Start with “Today you are one” and keep going.",
      ],
      [
        "“Dear Nora, Today you are one. You have six teeth, a laugh that comes from your stomach and strong opinions about bananas. You crawl with one leg tucked under you, like a little boat with a broken oar.",
        "The night you were born it snowed, and the nurse opened the blind so I could see. I think of that every time it snows now. This year you taught me that I can function on four hours of sleep and that I am braver than I thought.",
        "I do not know who you will be when you read this. I know that at one, you reach for people. I hope you keep doing that. All my love, Mama.”",
      ],
      [
        "“Dear Eli, Happy first birthday. You are standing at the coffee table as I write, banging a wooden spoon on it and looking very pleased. You say ‘dada’ to everyone, including the dog.",
        "In March you had a fever and I sat up with you all night in the blue chair. Around four in the morning you put your hand on my face and fell asleep. I have never felt so needed or so sure of anything.",
        "Whatever kind of boy and man you become, you do not have to be tough for me. You only have to be kind. I love you, Mom.”",
      ],
      [
        "“Dear Hazel, I am not much of a letter writer, so this will be short. A year ago I was afraid to pick you up. Now you ride on my shoulders and steer with my ears.",
        "I learned your cries. I learned the song that works in the car. I learned that I would rather be at home with you than anywhere else, which nobody who knew me before would believe. Thank you for making me a dad. Love, Dad.”",
      ],
      [
        "For a card, a caption or a baby book page: “You are one today. You love the bath, the cat and being upside down. This year was the hardest and best of my life. I would do every minute again.”",
      ],
      [
        "Later children sometimes get shorter baby books. A letter evens that out. Tell them what was different about their arrival.",
        "“Dear Jude, You are our third, which means you have never had a quiet nap in your life. You were carried to school drop-off at five days old. Your brother reads to you and your sister dresses you like a doll. You came into a loud, full house, and you made it more itself. Love, Mom and Dad.”",
      ],
      ["These are the facts that fade quickest."],
      [
        "A first birthday letter is a good start to a tradition: one letter every birthday, opened together at eighteen. It takes twenty minutes a year.",
        "If you would like the letters kept in one place with the photographs from each year, you can write them in Everlittle and set them to open on a date you choose. A dated note on your phone or a folder of paper letters works too, as long as someone else knows where to find it.",
      ],
    ],
    lists: {
      "6": [
        "Weight, height and number of teeth",
        "First word, or the sound they use for everything",
        "How they move: rolling, crawling, cruising, walking",
        "What makes them laugh every time",
        "The song, book or toy on repeat",
        "Who they light up for",
        "Where you live and what their room looks like",
        "What you call them when nobody else is listening",
      ],
    },
    sectionLinks: {
      "7": [
        { href: "/letters-to-your-future-child", label: "Writing letters to your future child" },
        {
          href: "/18-letters-for-18th-birthday",
          label: "How to collect 18 letters for an 18th birthday",
        },
      ],
    },
  },
  {
    id: "grandchild-letter",
    category: "Family stories",
    kind: "Letter",
    title: "What to write in a letter to your grandchild, with examples",
    searchTitle: "Letter to My Grandchild: What to Write, with Examples",
    intro:
      "Example letters from grandparents to a newborn, a first grandchild and a grandchild turning one, with prompts for the family stories only you can tell.",
    minutes: 6,
    published: "2026-10-05",
    lede: "Tell them who you are, tell them one story about their parent as a child and tell them what you felt when they arrived. You are the only person who can write all three.",
    quote: "You are the only one who remembers their parent at that age.",
    relatedIds: ["grandparents", "long-distance-grandparenting"],
    sectionTitles: [
      "Why a grandparent’s letter is different",
      "What to write to your first grandchild",
      "Letter to a newborn granddaughter or grandson",
      "Letter to my grandson on his first birthday",
      "Letter to my granddaughter on her first birthday",
      "A letter when you live far away",
      "Stories to put on paper",
      "Add your voice",
    ],
    paragraphs: [
      [
        "Parents write about the baby. Grandparents can write about the family: where it came from, what it survived and what it laughs about. You hold a longer piece of the story than anyone else in the room.",
        "You also know the baby’s mother or father as a child. One story about that, told kindly, will be read aloud for years.",
      ],
      [
        "Start with the moment you found out. Say where you were and what you did next. Then introduce yourself as you would to someone who may only know you as old.",
        "“Dear little one, Your father telephoned at six in the morning and could not get the words out, so I knew. I am your grandmother. I was a nurse for thirty years, I grow tomatoes badly and I cry at weddings. I have waited a long time to meet you. Welcome to this family. We are noisy and we show up.”",
      ],
      [
        "“Dear Clara, You are four days old. You have your mother’s chin, which she got from my mother, who got it from a woman in a photograph I will show you one day.",
        "When your mother was small she refused to wear shoes and once walked to the corner shop in the rain in her socks. I am telling you this so you have something to say when she tells you to put your shoes on. I will love you through every age you are going to be. Grandma.”",
      ],
      [
        "“Dear Henry, Happy first birthday. This year I watched you learn to sit, then crawl, then pull every book off my bottom shelf. I left them on the floor for a week because I liked seeing them there.",
        "I was not always a patient father. Being your grandfather is my second chance to slow down, and I am taking it. When you are older I will teach you to fish and you will be bored, and that is fine. Love, Pop.”",
      ],
      [
        "“My darling Zoe, One year old. You clap when I come through the door, and I would cross the country for that alone.",
        "I want you to have something of mine in writing. I grew up with very little and I was happy. I was the first girl in my family to finish school. I married your grandfather after knowing him for eleven weeks, and I was right. Be brave about the things that matter, my love. Your Nan.”",
      ],
      [
        "Distance changes what a letter is for. It becomes the visit you could not make.",
        "“Dear Mateo, I am writing from the kitchen in Guadalajara where your father ate breakfast every day until he was nineteen. There are 2,000 kilometers between this table and your crib. I see you on the telephone every Sunday and you try to touch my face on the screen. I am saving the stories for when you are old enough, and in case I am not there to tell them I am writing them down. Con todo mi cariño, tu abuelo.”",
      ],
      ["Choose two or three. Short and specific is better than complete."],
      [
        "Read your letter aloud and record it, even on a telephone. Your grandchild will want to hear how you said their name.",
        "If their parents keep a family archive in Everlittle, they can invite you as a contributor so your letters, photographs and recordings sit beside their own, and you can add to them from your own browser whenever a story comes back to you.",
      ],
    ],
    lists: {
      "6": [
        "Where you were born and what the house was like",
        "What your own grandparents were called and one thing you remember about them",
        "How you met their grandmother or grandfather",
        "What their parent was like at two, at ten and at sixteen",
        "The work you did and what you were proud of",
        "A hard year and how the family got through it",
        "A recipe, a saying or a song that belongs to your family",
        "What you believe now that you did not believe at thirty",
      ],
    },
    sectionLinks: {
      "5": [
        {
          href: "/long-distance-grandparenting-ideas",
          label: "Ideas for staying close to grandchildren who live far away",
        },
      ],
      "7": [
        {
          href: "/grandparents-memory-project",
          label: "Questions for recording grandparents’ stories",
        },
      ],
    },
  },
  {
    id: "eighteen-letters",
    category: "Letters for later",
    kind: "Keepsake",
    title: "18 letters for an 18th birthday: how to collect them",
    intro:
      "Who to ask, what to tell them to write, a message you can send and how to gather 18 letters for an 18th birthday, whether you have six weeks or seventeen years.",
    minutes: 5,
    published: "2026-10-05",
    lede: "Ask eighteen people who have known your child at different ages for one letter each. Give them a prompt, a length and a deadline three weeks before the birthday. Expect to chase half of them.",
    quote: "Eighteen people, each holding a different year of the same life.",
    relatedIds: ["first-birthday-capsule", "capsule-letter-examples"],
    sectionTitles: [
      "Two ways to do it",
      "Who to ask",
      "What to tell each writer",
      "A message you can send",
      "Example openings",
      "Collecting and chasing",
      "How to present them",
    ],
    paragraphs: [
      [
        "The quick version: in the weeks before the birthday, you ask eighteen people for one letter each and present them together. The slow version: one letter is written every year from birth, by you or by a different person each time, and all eighteen are opened on the day.",
        "The slow version is lovelier and easy to start at any age. If your child is already seven, write this year’s letter and ask relatives to fill in the earlier years from memory.",
      ],
      [
        "Aim for a spread of ages and relationships, so the letters cover the whole life and not only the recent years.",
      ],
      [
        "People write better with boundaries. Give them one page, one prompt and a date.",
        "Ask for a memory only they have, something they admire in the birthday child and one thing they wish they had known at eighteen. Tell them it is fine to be funny. Tell them handwriting is welcome and so is a typed page.",
      ],
      [
        "“Hi Sarah, Daniel turns 18 on 14 June. I am collecting 18 letters from people who have mattered to him, and I would love one from you. One page is plenty: a memory of him, something you admire about him and any advice for the years ahead. Could you send it to me by 20 May? Post or email are both fine. Please keep it a surprise.”",
      ],
      [
        "From a teacher: “You will not remember this, but in Year 4 you stayed in at break to help another boy finish his model volcano. I have told that story to every class since.”",
        "From an older cousin: “I taught you to swear and to parallel park. Only one of those was on purpose.”",
        "From a grandparent: “I have known you for 6,570 days and I have the photographs to prove it.”",
      ],
      [
        "Keep a simple list of who has replied. Send one reminder a week before the deadline and a second on the day. Some people will send a voice message or a video instead of writing; accept it gladly.",
        "If you are collecting over many years, the hard part is not losing anything. A shared family archive helps here: in Everlittle each invited relative can add their own letter or recording, and you can hold them in a capsule that opens on the eighteenth birthday. Keep the paper originals as well.",
      ],
      [
        "Number the envelopes one to eighteen, in order of how long each writer has known them. A box, a ribbon or a simple binder all work. Add a photograph of the writer with the birthday child to each envelope if you can find one.",
        "Give them time alone with the letters. Most eighteen-year-olds will read them properly later that night.",
      ],
    ],
    lists: {
      "1": [
        "Both parents, separately",
        "Each living grandparent",
        "Siblings, including the small ones (dictated letters are the best ones)",
        "A godparent or family friend who was there in the first year",
        "An aunt, uncle or cousin they are close to",
        "A teacher or coach who saw them grow",
        "A childhood best friend, and that friend’s parent",
        "A neighbor, babysitter or childminder from the early years",
        "Someone who knew a grandparent who has died, writing about them",
      ],
    },
    sectionLinks: {
      "0": [
        {
          href: "/letter-to-my-baby-on-first-birthday",
          label: "Example letters for the first birthday",
        },
      ],
      "5": [
        {
          href: "/tools/time-with-your-kids",
          label: "Count the birthdays and weekends left before 18",
        },
      ],
    },
  },
  {
    id: "baby-firsts",
    category: "Everyday memories",
    kind: "Milestone",
    title: "Baby firsts checklist: 90 firsts worth recording",
    intro:
      "A list of baby firsts to record in the first two years, from the first smile to the first joke, including the small ones a standard baby book leaves out.",
    minutes: 6,
    published: "2026-10-05",
    lede: "Record the date, one sentence about what happened and who was there. Do not wait for a photograph. The firsts on this list are grouped by stage so you can skim for the ones you are living through now.",
    quote: "The date is useful. The sentence beside it is the memory.",
    relatedIds: ["small-firsts", "birthday-interview"],
    sectionTitles: [
      "How to use this list",
      "The first weeks",
      "Months 2 to 6",
      "Months 6 to 12",
      "The second year",
      "Firsts with people",
      "Firsts that are easy to miss",
      "Your firsts as a parent",
      "Where to keep them",
    ],
    paragraphs: [
      [
        "This is a memory list, not a developmental chart. Babies reach these moments in their own order and at very different ages, and some will not apply to your family. If you have questions about your child’s development, ask your pediatrician or health visitor.",
        "You will miss some firsts. Write down the first time you saw it and move on.",
      ],
      [],
      [],
      [],
      [],
      ["The firsts that involve other people are the ones relatives ask about for decades."],
      [
        "No baby book has a page for these, and they are the ones parents say they wish they had written down.",
      ],
      ["Your child will be curious about you as well."],
      [
        "A notes app with dates works. So does a paper calendar with a pen tied to it. What matters is that the note is made within a day or two, while you still remember what was funny about it.",
        "In Everlittle each first can be saved as a milestone on your child’s timeline with a photograph, a sentence and the date, and the grandparents you invite can see it or add their own.",
      ],
    ],
    lists: {
      "1": [
        "First cry and first breath of outside air",
        "First time each parent held them",
        "First feed",
        "First car journey and first night at home",
        "First bath",
        "First walk outdoors",
        "First visitor",
        "First time they gripped your finger",
        "First night you slept more than three hours",
        "First photograph of the whole family",
      ],
      "2": [
        "First real smile",
        "First laugh, and what caused it",
        "First coo or “conversation”",
        "First time they found their hands",
        "First time they rolled over",
        "First time they recognized a voice on a call",
        "First toy they reached for",
        "First time they slept through the night",
        "First illness and the first night you sat up",
        "First trip away from home",
        "First swim or splash",
        "First time they were looked after by someone else",
      ],
      "3": [
        "First solid food and the face they made",
        "First tooth",
        "First time sitting unaided",
        "First crawl, shuffle or roll across a room",
        "First wave and first clap",
        "First word, and the first word that was not a name",
        "First time they pulled up to stand",
        "First steps holding on",
        "First game of peekaboo they started themselves",
        "First food they refused",
        "First haircut",
        "First birthday and what they did with the cake",
      ],
      "4": [
        "First independent steps",
        "First run",
        "First pair of proper shoes",
        "First two-word sentence",
        "First “no”",
        "First time they said their own name",
        "First song they sang",
        "First drawing they explained",
        "First joke or deliberate silliness",
        "First tantrum in public",
        "First friend they asked for by name",
        "First day at nursery or with a childminder",
        "First night in a bed",
        "First time they said “I love you” without being asked",
      ],
      "5": [
        "First meeting with each grandparent",
        "First video call they noticed",
        "First time they reached for someone who was not a parent",
        "First meeting with a sibling or cousin",
        "First meeting with a pet",
        "First holiday with extended family",
        "First nickname someone gave them",
        "First thing a grandparent taught them",
        "First time they recognized themselves in a photograph",
        "First time they said a relative’s name",
      ],
      "6": [
        "First time they fell asleep on your chest",
        "First time they noticed rain, snow or the sea",
        "First favorite book, requested again and again",
        "First mispronounced word you started using yourselves",
        "First time they danced",
        "First time they comforted someone",
        "First time they hid something",
        "First imaginary game",
        "First question that began with “why”",
        "First thing they were afraid of",
        "First thing they were proud of",
        "First time they made a stranger laugh",
      ],
      "7": [
        "First time you went out without them",
        "First time you felt you knew what you were doing",
        "First time you laughed until you cried",
        "First thing you did differently from your own parents",
        "First time you saw your partner as a parent",
        "First time your own parent felt like a grandparent",
        "First advice you ignored and were right to",
        "First day back at work",
        "First family tradition you started",
        "First time they looked for you in a room",
      ],
    },
    sectionLinks: {
      "8": [
        { href: "/baby-memory-journal", label: "A baby memory journal for real life" },
        { href: "/baby-book-alternatives", label: "Alternatives to a traditional baby book" },
        {
          href: "/tools/baby-milestone-dates",
          label: "Find your baby’s 100-day and 1,000-day dates",
        },
      ],
    },
  },
  {
    id: "baby-book-alternatives",
    category: "Everyday memories",
    kind: "Story",
    title: "Baby book alternatives for parents who never fill them in",
    searchTitle: "9 Baby Book Alternatives for Busy Parents",
    intro:
      "Nine alternatives to a traditional baby book, from a one-line journal to a voice memo habit, with what each is good at and where it usually breaks down.",
    minutes: 6,
    published: "2026-10-05",
    lede: "Choose the method that matches how you already behave. If you text photographs to your mother every day, build on that. If you like paper, keep paper. The best record is the one that takes under a minute.",
    quote: "A half-kept record in your own words beats a perfect book left blank.",
    relatedIds: ["baby-firsts", "little-journal"],
    sectionTitles: [
      "Why baby books go unfinished",
      "1. A one-line-a-day journal",
      "2. A calendar on the wall",
      "3. A notes app with dates",
      "4. Voice memos",
      "5. An email address for your baby",
      "6. A shared photo album",
      "7. One photo book a year",
      "8. A memory box",
      "9. A private family archive",
      "How to choose",
    ],
    paragraphs: [
      [
        "A traditional baby book asks for the wrong things at the wrong time. It wants a lock of hair, a hospital bracelet and neat handwriting from someone who has not slept. It has fixed pages for milestones your child may reach late, early or not at all, and no page for the afternoon they laughed at a sneeze for ten minutes.",
        "The alternatives below ask for less and capture more. Several of them work well together.",
      ],
      [
        "A small dated diary with room for a sentence a day. It is quick, it lives by the bed, and rereading the same date a year later is a pleasure. It breaks down when you miss a fortnight and feel you have failed. You have not; skip the gap and carry on.",
      ],
      [
        "A paper calendar with a pen attached, in the kitchen. Everyone in the house can add to it, including visiting grandparents. At the end of the year, keep the whole calendar. It holds little detail, and it will not hold photographs, but it is the method most likely to survive a second child.",
      ],
      [
        "One running note per child on your phone, newest entry at the top, each starting with the date. It is always with you and it is searchable. The risks are that it stays on one parent’s phone, that nobody else can add to it and that it depends on an account you might lose access to. Export it once a year.",
      ],
      [
        "Thirty seconds of you describing the day, or of your baby babbling in the background. Sound brings back a period of life in a way text cannot. Files pile up unnamed, so say the date at the start of each recording and move them somewhere safe every few months.",
      ],
      [
        "Some parents create an email account and write to it over the years, then hand over the password at eighteen. It is simple and needs no new app. It also has real pitfalls: providers can delete accounts that sit unused, age rules apply to accounts held in a child’s name, and a forgotten password can lock away everything.",
      ],
      [
        "A shared album on the phones you already use gives relatives a steady stream of pictures. It is good at volume and poor at meaning: hundreds of near-identical photographs, no stories, and everyone has to be on a compatible system. Add captions to the few that matter.",
      ],
      [
        "Each birthday, choose thirty to fifty photographs and print a book with a line of text under each. It takes an evening and gives your child something to hold. It does not keep video or sound, and it depends on you doing the choosing every year.",
      ],
      [
        "A box per child for objects: the hospital band, a first shoe, a drawing, a party invitation. Label everything with a date, because nobody remembers why they kept a particular sock. Photograph the contents once a year in case of damp or a house move.",
      ],
      [
        "A private space built for this job, where photographs, short stories, voice notes, video and letters sit on one dated timeline and the relatives you invite can add their own. This is what Everlittle is. It keeps the story with the photograph, lets grandparents contribute from a browser and can hold letters until a date you choose.",
        "A digital service also asks you to trust it with your memories. Everlittle starts with 100 MB free, with no card or expiry. Its 25 GB family plan is $6 a month or $60 a year. As with every method here, keep your own copies of anything irreplaceable.",
      ],
      [
        "Ask three questions. Will I do this when I am tired? Can someone else add to it? Will my child be able to open it in twenty years? Paper wins the last question and digital wins the second, which is why many families pair one of each: a calendar on the wall and an archive for voices and video, or a notes app and a printed book each birthday.",
      ],
    ],
    sectionLinks: {
      "5": [
        {
          href: "/email-address-for-baby",
          label: "Read this before creating an email address for your baby",
        },
      ],
      "9": [
        { href: "/family-memory-app", label: "What to look for in a family memory app" },
        { href: "/pricing", label: "See Everlittle’s plans" },
      ],
      "10": [{ href: "/baby-firsts-checklist", label: "A checklist of 90 baby firsts to record" }],
    },
  },
  {
    id: "email-for-baby",
    category: "Letters for later",
    kind: "Letter",
    title: "Creating an email address for your baby: how it works and what can go wrong",
    searchTitle: "Email Address for Your Baby: How to Set It Up, and the Pitfalls",
    intro:
      "How parents use an email account as a diary for their baby, the age and inactivity rules to check first, and safer ways to keep letters for your child.",
    minutes: 5,
    published: "2026-10-05",
    lede: "Writing emails to your baby is a lovely habit and a fragile archive. Before you rely on it, check the provider’s age rules and inactive-account policy, keep the account active and keep a second copy of everything you send.",
    quote: "The habit is the valuable part. The inbox is only one place to keep it.",
    relatedIds: ["future-letter", "baby-book-alternatives"],
    sectionTitles: [
      "The idea",
      "Check the age rules first",
      "Inactive accounts can be deleted",
      "Other ways it goes wrong",
      "If you do it, do it this way",
      "What to write",
      "Alternatives that keep the habit",
    ],
    paragraphs: [
      [
        "You create an email address for your child, share it with close family and send it messages over the years: a photograph from the first day of school, a note after a hard night, a story from a grandparent. On their eighteenth birthday you hand over the password to an inbox full of their childhood.",
        "It appeals because email is free, familiar and available on every device. Relatives do not need to install anything.",
      ],
      [
        "Email providers set a minimum age for holding an account on your own. For Google it is 13 in most countries and higher in some. Google does let a parent create a supervised account for a younger child through Family Link, which is managed from the parent’s account.",
        "Do not enter a false date of birth to get around the limit. An account that breaks a provider’s terms can be suspended, and you would lose the letters with it. Read the current rules for the provider you choose, because they differ and they change.",
      ],
      [
        "This is the pitfall most parents have not heard of. Google’s inactive account policy allows it to delete a personal account, and everything in it, once the account has gone two years without being used. Receiving mail does not count as activity; someone has to sign in or take an action in the account.",
        "An inbox you only write to, and never open, is exactly the kind of account that policy is aimed at. Other providers have their own inactivity rules. Whichever you use, sign in to the baby’s account at least a couple of times a year.",
      ],
      [
        "Eighteen years is a long time for one password. Recovery phone numbers change, a parent’s own email is closed, two-step codes go to a device that no longer exists.",
        "The address also receives spam, and anyone who learns it can write to it. Attachments count against a storage limit, so years of video will not fit. And an inbox is a flat list: no timeline, no way to see every letter from Grandma together unless you build the filters yourself.",
      ],
      ["The habit is worth keeping. These steps make it safer."],
      [
        "Short and dated beats long and rare. Put the occasion in the subject line so the inbox reads like a table of contents: “The day you learned to whistle”, “Your first day at Oakfield”, “Things you said this week”.",
      ],
      [
        "If the appeal is writing to your child’s future self, you have other options. A dated document or a paper notebook is under your control and has no inactivity rule. A printed copy of each year’s letters, kept with the family papers, will still open in 2044.",
        "A private family archive is built for the same habit. In Everlittle you can write letters with an opening date, attach photographs, video and voice, and invite grandparents to add their own. The account belongs to you as the parent, so there is no age rule to work around. Start with 100 MB free and upgrade when you need more space. The same advice applies: keep your own copy of the words that matter most.",
      ],
    ],
    lists: {
      "4": [
        "Use a supervised child account or an address under your own account, set up within the provider’s rules",
        "Add two recovery methods that belong to different adults",
        "Store the password where your partner or another trusted adult can find it",
        "Set a reminder to sign in every six months",
        "Send photographs as a few chosen attachments, not whole albums",
        "Once a year, export or print the year’s messages",
        "Tell relatives the address privately, never on social media",
      ],
    },
    sectionLinks: {
      "6": [
        { href: "/letters-to-your-future-child", label: "Writing letters to your future child" },
        {
          href: "/time-capsule-letter-to-child-examples",
          label: "Time capsule letter examples and a template",
        },
      ],
    },
    sources: [
      {
        label: "Google Account Help: Inactive Google Account Policy",
        href: "https://support.google.com/accounts/answer/12418290",
      },
      {
        label: "Google Account Help: Age requirements on Google Accounts",
        href: "https://support.google.com/accounts/answer/1350409",
      },
      {
        label: "Google For Families Help: Create a Google Account for your child",
        href: "https://support.google.com/families/answer/7103338",
      },
    ],
  },
  {
    id: "family-distance-stats",
    category: "Family stories",
    kind: "Photo",
    title: "Long-distance family statistics: how far apart families live",
    searchTitle: "Long-Distance Family Statistics (2026): How Far Apart Families Live",
    intro:
      "Sourced statistics on how far people live from parents and grandchildren, how families are changing, migration, video calls and what children remember.",
    minutes: 9,
    published: "2026-10-05",
    lede: "Most families still live close together, and a large minority do not. More than half of American grandparents have a grandchild over 200 miles away, 304 million people live outside the country they were born in, and the tools families use to stay in touch have changed within a decade. Every figure below links to its source.",
    quote:
      "Distance is common. Losing the everyday details is the part families can do something about.",
    relatedIds: ["long-distance-grandparenting", "grandparent-sharing"],
    sectionTitles: [
      "Key statistics at a glance",
      "How far people live from family",
      "Grandparents and grandchildren",
      "Families are smaller and start later",
      "Families across borders",
      "How families stay in touch",
      "Time together changes with age",
      "Photos, privacy and children",
      "What children remember",
      "Claims we could not verify",
      "About these numbers",
    ],
    paragraphs: [
      [
        "These are the figures most often needed by journalists, students and families trying to describe their own situation. Details and caveats follow in each section.",
      ],
      [
        "Closeness is still the norm in the United States. In a Pew Research Center survey, 55% of adults said they live within an hour’s drive of at least some extended family, including 28% who live near all or most of them. One in five, 20%, live within an hour of none.",
        "An analysis of the Health and Retirement Study by The New York Times found that the typical American adult lives 18 miles from their mother, and only about 20% live more than a couple of hours’ drive from their parents. A study using the Panel Study of Income Dynamics found that 74.8% of adults with a living parent or adult child have their nearest one within 30 miles, while 6.8% have their nearest more than 500 miles away.",
        "Education changes the picture. In the Pew survey, 42% of adults with a postgraduate degree lived within an hour of extended family, compared with 63% of those with a high school education or less. People who move for study and work are the ones most likely to raise children far from grandparents.",
        "Americans also move less than they used to. The Census Bureau recorded a mover rate of 8.7% in 2022, close to the lowest on record, compared with roughly 20% a year from the late 1940s through the 1960s. Among those who did move, 26.5% gave family-related reasons.",
      ],
      [
        "AARP’s 2018 Grandparents Today survey found that over half of grandparents have at least one grandchild living more than 200 miles away. The average age of becoming a grandparent for the first time was 50.",
        "AARP’s 2026 study estimates about 65 million grandparents in the United States: one in three adults aged 35 and over, and half of adults aged 50 and over. They have 4.9 grandchildren on average. The care they give is equivalent to 12.5 weeks of full-time work a year, and 11% currently live with a grandchild.",
        "According to the Census Bureau, 8.0% of American children under 18 lived in a grandparent’s home in 2017 to 2021.",
      ],
      [
        "The average American household had 2.50 people in 2025, down from 3.33 in 1960. One-person households made up 29% of all households in 2025, compared with 20% in 1975. About 70% of children lived with two parents in 2025, compared with about 88% in 1960.",
        "Parents are older. The mean age of American mothers at first birth reached a record 27.5 in 2023. In the European Union it was 29.9 in 2024, with a total fertility rate of 1.34. Later parenthood means older grandparents: a child born to a 30-year-old whose own mother gave birth at 30 has a 60-year-old grandmother on day one.",
        "One trend runs the other way. Pew found that 59.7 million people in the United States, 18% of the population, lived in multigenerational households in 2021, up from 7% in 1971. Among foreign-born Americans the share was 26%.",
      ],
      [
        "The United Nations counted 304 million international migrants in 2024, nearly double the 154 million of 1990. That is 3.7% of the world’s population. Some of these people maintain close family ties across borders; this total does not measure how many families are separated.",
        "In the United States, about one in four children, close to 20 million, had at least one immigrant parent in 2024. In the European Union, 14.1 million people were citizens of a different EU country from the one they lived in on 1 January 2025.",
        "Money is the measurable trace of those ties. The World Bank estimated remittances to low- and middle-income countries at $685 billion in 2024, more than foreign direct investment and official development aid combined. India and Mexico received the most.",
      ],
      [
        "The telephone call is giving way to messages and video. In AARP’s 2018 survey, 46% of grandparents reached grandchildren by phone, down from 70% in 2011. In the 2026 study, 76% of grandparents said technology such as texting, video calls and photo apps is a primary way they stay connected, and half of grandparents aged 80 and over text with their grandchildren.",
        "The devices are there. Pew reports that 78% of Americans aged 65 and over own a smartphone. In an earlier Pew survey, 81% of Americans had used video calls since the start of the pandemic.",
        "Screens are not a full substitute. A study of more than 11,000 adults aged 50 and over found that those who saw family and friends in person at least three times a week had a 6.5% rate of depressive symptoms two years later, compared with 11.5% for those who met every few months or less. Phone and email contact did not make the same difference. The study shows an association, not proof of cause.",
      ],
      [
        "American Time Use Survey data compiled by Our World in Data shows how sharply family time falls at adulthood. At 15, Americans spend about 4.3 hours a day in the company of family. By 25 it is about 1.6 hours, and from the mid-30s on it is about an hour. Across respondents, time with children peaks at around 4.3 hours a day near age 39 and falls below one hour by 65.",
        "The Bureau of Labor Statistics reports that adults in households with a child under 6 spent 2.3 hours a day on childcare as their main activity in 2025. Where the youngest child was 6 to 17, it was 47 minutes.",
        "These are snapshots of different people at different ages, counted when they are physically together. They do not follow one family over time, and calls do not count.",
      ],
      [
        "Among American parents who use social media, 82% have posted photos, videos or information about their children, according to Pew. The main reason is family: 76% of those parents said sharing easily with relatives and friends is a major reason they post.",
        "Parents are also uneasy. In the C.S. Mott Children’s Hospital National Poll in 2023, 30% of parents of children aged 0 to 4 said they avoid posting photos or videos of their child, and 63% said other parents share information that could reveal a child’s location.",
        "Children have views too. In a Microsoft study across 25 countries, 42% of teenagers said they have a problem with their parents posting about them online.",
      ],
      [
        "Adults’ earliest memories date, on average, to about two and a half years old, according to a 2021 review of ten studies. This is an average across the studies, not a fixed boundary for every person.",
        "Early memories also fade during childhood. In one study, children aged 5 to 7 could recall 63% to 72% of events they had talked about at age 3. By ages 8 and 9, they recalled about 35%. The years a parent remembers most vividly are the years a child will mostly know from photographs and stories.",
      ],
      [
        "Two statistics circulate widely: that 75% of the time parents will ever spend with their children is over by age 12, and 90% by 18. We could not find a primary source for either. The time-use data above measures something different and does not support them.",
        "A related figure, that 93% of in-person time with parents is used up by the end of high school, comes from a 2015 essay by Tim Urban and is his own illustration based on his own family. We have left these out.",
      ],
      [
        "Most figures here describe the United States, which is the focus of the family-distance surveys collected here. Surveys from different years and organisations use different definitions, so compare them with care. Where a number is an estimate or projection, we say so.",
        "You are welcome to quote this page. Please link to the original source for any figure you use, and to this page if the collection was useful. Compiled by Everlittle in October 2026.",
      ],
    ],
    lists: {
      "0": [
        "55% of US adults live within an hour’s drive of at least some extended family; 20% live near none (Pew Research Center, 2022)",
        "The typical American adult lives 18 miles from their mother (The New York Times, 2015)",
        "Over half of US grandparents have at least one grandchild living more than 200 miles away (AARP, 2018)",
        "There are about 65 million grandparents in the United States (AARP, 2026)",
        "304 million people live outside their country of birth, nearly double the number in 1990 (United Nations, 2024)",
        "About 1 in 4 US children has an immigrant parent (KFF, 2024)",
        "76% of grandparents say technology is a primary way they stay connected with grandchildren (AARP, 2026)",
        "The average US household has 2.50 people, down from 3.33 in 1960 (US Census Bureau, 2025)",
        "82% of US parents who use social media have posted about their children (Pew Research Center, 2020)",
        "Adults’ earliest memories date to about age two and a half (Peterson, 2021)",
      ],
    },
    sectionLinks: {
      "2": [
        {
          href: "/long-distance-grandparenting-ideas",
          label: "Ideas for staying close to grandchildren who live far away",
        },
      ],
      "6": [
        {
          href: "/tools/time-with-your-kids",
          label: "Count the weekends until your child turns 18",
        },
      ],
      "7": [
        { href: "/private-family-photo-sharing", label: "A guide to private family photo sharing" },
      ],
    },
    sectionSources: {
      1: [0, 1, 2, 3, 4],
      2: [5, 6, 7],
      3: [8, 9, 10, 11],
      4: [12, 13, 14, 15],
      5: [5, 6, 16, 17, 18],
      6: [19, 20],
      7: [21, 22, 23],
      8: [24, 25],
    },
    sources: [
      {
        label:
          "Pew Research Center (2022). More than half of Americans live within an hour of extended family.",
        href: "https://www.pewresearch.org/short-reads/2022/05/18/more-than-half-of-americans-live-within-an-hour-of-extended-family/",
      },
      {
        label:
          "Bui & Miller, The New York Times (2015). The Typical American Lives Only 18 Miles From Mom.",
        href: "https://www.nytimes.com/interactive/2015/12/24/upshot/24up-family.html",
      },
      {
        label:
          "Choi, Schoeni, Wiemers, Hotz & Seltzer (2020). Spatial Distance Between Parents and Adult Children in the United States. Journal of Marriage and Family.",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7537569/",
      },
      {
        label: "US Census Bureau (2023). Why people move.",
        href: "https://www.census.gov/library/stories/2023/09/why-people-move.html",
      },
      {
        label:
          "Brookings Institution (2023). Americans’ local migration reached a historic low in 2022.",
        href: "https://www.brookings.edu/articles/americans-local-migration-reached-a-historic-low-in-2022-but-long-distance-moves-picked-up/",
      },
      {
        label: "AARP (2019). 2018 Grandparents Today National Survey.",
        href: "https://www.aarp.org/pri/topics/social-leisure/relationships/aarp-grandparenting-study/",
      },
      {
        label:
          "AARP (2026). Powering Families: The Essential Role of Grandparents in Care, Connection and Support.",
        href: "https://www.aarp.org/pri/topics/social-leisure/relationships/the-essential-role-of-grandparents/",
      },
      {
        label: "US Census Bureau (2024). Grandparents and Their Coresident Grandchildren: 2021.",
        href: "https://census.gov/newsroom/press-releases/2024/grandparents-coresident-grandchildren.html",
      },
      {
        label:
          "US Census Bureau (2025). Families and Living Arrangements, historical tables and release.",
        href: "https://www.census.gov/newsroom/press-releases/2025/families-and-living-arrangements.html",
      },
      {
        label: "CDC National Center for Health Statistics (2025). Births: Final Data for 2023.",
        href: "https://www.cdc.gov/nchs/data/nvsr/nvsr74/nvsr74-1.pdf",
      },
      {
        label: "Eurostat (2026). Fertility statistics.",
        href: "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Fertility_statistics",
      },
      {
        label: "Pew Research Center (2022). The Demographics of Multigenerational Households.",
        href: "https://www.pewresearch.org/social-trends/2022/03/24/the-demographics-of-multigenerational-households/",
      },
      {
        label: "UN DESA (2025). International Migrant Stock 2024: Key facts and figures.",
        href: "https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/undesa_pd_2025_intlmigstock_2024_key_facts_and_figures_advance-unedited.pdf",
      },
      {
        label: "KFF (2025). Children of Immigrants: Key Facts on Health Coverage and Care.",
        href: "https://www.kff.org/racial-equity-and-health-policy/children-of-immigrants-key-facts-on-health-coverage-and-care/",
      },
      {
        label: "Eurostat (2025). EU population diversity by citizenship and country of birth.",
        href: "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=EU_population_diversity_by_citizenship_and_country_of_birth",
      },
      {
        label: "World Bank (2024). Remittance flows to low- and middle-income countries in 2024.",
        href: "https://blogs.worldbank.org/en/peoplemove/in-2024--remittance-flows-to-low--and-middle-income-countries-ar",
      },
      {
        label:
          "Pew Research Center (2026). Internet use, smartphone ownership and digital divides in the US.",
        href: "https://www.pewresearch.org/short-reads/2026/01/08/internet-use-smartphone-ownership-digital-divides-in-u-s/",
      },
      {
        label: "Pew Research Center (2021). The Internet and the Pandemic.",
        href: "https://www.pewresearch.org/internet/2021/09/01/the-internet-and-the-pandemic/",
      },
      {
        label:
          "Teo et al. (2015), Journal of the American Geriatrics Society, summarised by Oregon Health & Science University.",
        href: "https://news.ohsu.edu/2015/10/04/research:-face-to-face-socializing-more-powerful-than-phone-calls-emails-in-guarding-against-depression-in-older-adults",
      },
      {
        label:
          "Our World in Data. Who Americans spend their time with, by age (American Time Use Survey).",
        href: "https://ourworldindata.org/time-with-others-lifetime",
      },
      {
        label: "US Bureau of Labor Statistics. American Time Use Survey summary.",
        href: "https://www.bls.gov/news.release/atus.nr0.htm",
      },
      {
        label: "Pew Research Center (2020). Parenting Children in the Age of Screens.",
        href: "https://www.pewresearch.org/internet/wp-content/uploads/sites/9/2020/07/PI_2020.07.28_kids-and-screens_FINAL.pdf",
      },
      {
        label:
          "C.S. Mott Children’s Hospital National Poll on Children’s Health (2023). Sharenting.",
        href: "https://mottpoll.org/sites/default/files/documents/112023_Sharenting.pdf",
      },
      {
        label: "Microsoft (2019). Teens say parents share too much about them online.",
        href: "https://blogs.microsoft.com/on-the-issues/2019/10/09/teens-say-parents-share-too-much-about-them-online-microsoft-study/",
      },
      {
        label:
          "Peterson (2021), Memory, summarised by ScienceDaily. What is your earliest memory? It depends.",
        href: "https://www.sciencedaily.com/releases/2021/06/210614110824.htm",
      },
      {
        label: "Bauer & Larkina (2014), Memory, summarised by ScienceDaily.",
        href: "https://www.sciencedaily.com/releases/2014/01/140124135705.htm",
      },
    ],
  },
  {
    id: "long-distance-grandparenting",
    category: "Family stories",
    kind: "Voice",
    title: "Long-distance grandparenting: 25 ideas for staying close",
    intro:
      "Practical ideas for grandparents and grandchildren who live far apart, sorted by the child’s age, with ways to make video calls easier and visits last longer.",
    minutes: 6,
    published: "2026-10-05",
    lede: "Small and regular beats big and rare. A two-minute voice message every Sunday does more for a three-year-old than a long call once a month. Choose two or three ideas that suit the child’s age and repeat them until they become yours.",
    quote: "A child does not measure the distance. They notice who keeps turning up.",
    relatedIds: ["grandchild-letter", "family-distance-stats"],
    sectionTitles: [
      "You are in good company",
      "With babies and toddlers",
      "With children aged 4 to 8",
      "With older children and teenagers",
      "Making video calls work",
      "What parents can do to help",
      "Making visits last",
      "Keep it somewhere you can both return to",
    ],
    paragraphs: [
      [
        "In AARP’s 2018 survey, more than half of American grandparents had at least one grandchild living over 200 miles away. In its 2026 study, three-quarters said technology is a primary way they stay connected. Long-distance grandparenting is an ordinary way to be a family now.",
      ],
      [
        "Under about three, a child knows you through repetition: the same face, the same voice, the same song. Keep contact short and frequent.",
      ],
      [
        "This is the age for shared projects and running jokes. Children like having something that is only theirs and yours.",
      ],
      [
        "Older children respond to being treated as interesting. Ask for their opinion and their help, and meet them where they already are.",
      ],
      [
        "A small child cannot hold a conversation with a screen, and that is nobody’s failure. Do something together instead of talking: read a picture book, eat breakfast at the same time, watch them build. Keep calls to ten minutes and end before anyone is bored.",
        "Call at the same time each week so it becomes part of the routine. Let the child carry the phone and show you things. If time zones make live calls hard, swap recorded messages instead; a video that can be replayed at bedtime is often better.",
      ],
      [
        "Parents are the bridge. Put a photograph of the grandparents at the child’s eye level and use their names in everyday talk. Send short, unedited clips of normal life, such as breakfast, the walk to school or a tantrum about socks. Those tell a grandparent more than a posed picture.",
        "Tell grandparents what the child is into this month so they have something to ask about. Pass on the small quotes. And say plainly what kind of contact works for your household, so nobody is guessing.",
      ],
      [
        "Before you leave, record yourself reading two or three of the child’s books. Take one photograph of the two of you doing something ordinary, and leave a printed copy behind. Start something that continues by post or message: a shared drawing, a jar of questions, a plant they are in charge of.",
      ],
      [
        "Messages scroll away and telephones are replaced. If the recordings and letters matter, put them in one place the family can find in ten years.",
        "With Everlittle, parents can invite grandparents into a private family archive that opens in a web browser, with nothing to install. A grandparent with contributor access can add a voice note, a photograph or a letter of their own, and it sits on the child’s timeline beside what the parents have saved.",
      ],
    ],
    lists: {
      "1": [
        "Record yourself singing one lullaby and ask the parents to play it at bedtime",
        "Send a board book and read the same copy on video",
        "Play peekaboo with the camera",
        "Send a short voice message every week that starts with the same greeting",
        "Post a photograph of yourself for the nursery wall",
        "Ask for a ten-second clip of whatever is new this week",
      ],
      "2": [
        "Read a chapter book in instalments, one chapter per call",
        "Write real letters with a question at the end, and include a stamped envelope for the reply",
        "Grow the same plant in both houses and compare",
        "Send one half of a drawing for them to finish and send back",
        "Keep a shared list of jokes",
        "Cook the same recipe on the same day and compare the results",
        "Tell a “when your dad was little” story every time you speak",
      ],
      "3": [
        "Play an online game they choose, and let them teach you",
        "Send an article, a song or a photograph with “this made me think of you”",
        "Ask them to interview you for a school project, and record it",
        "Teach a family recipe over video",
        "Read the same book or watch the same series, then compare notes",
        "Text without expecting a quick reply",
        "Write them a letter to open at 18",
      ],
      "6": [
        "Agree the date of the next visit before this one ends",
        "Leave a hidden note to be found after you have gone",
        "Take home a drawing and send a photograph of where you hung it",
        "Give them one job that is theirs on every visit",
        "Record five minutes of the two of you talking about nothing in particular",
      ],
    },
    sectionLinks: {
      "0": [
        {
          href: "/long-distance-family-statistics",
          label: "More statistics on how far apart families live",
        },
      ],
      "3": [
        { href: "/letter-to-my-grandchild", label: "What to write in a letter to your grandchild" },
      ],
      "7": [
        {
          href: "/sharing-photos-with-grandparents",
          label: "How to share photos with grandparents privately",
        },
      ],
    },
    sources: [
      {
        label: "AARP (2019). 2018 Grandparents Today National Survey.",
        href: "https://www.aarp.org/pri/topics/social-leisure/relationships/aarp-grandparenting-study/",
      },
      {
        label:
          "AARP (2026). Powering Families: The Essential Role of Grandparents in Care, Connection and Support.",
        href: "https://www.aarp.org/pri/topics/social-leisure/relationships/the-essential-role-of-grandparents/",
      },
    ],
  },
];

export const guideArticlePaths: Record<string, string> = {
  "capsule-letter-examples": "/time-capsule-letter-to-child-examples",
  "first-birthday-capsule": "/first-birthday-time-capsule-letters",
  "birthday-interview": "/birthday-interview-questions-for-kids",
  "first-birthday-letter": "/letter-to-my-baby-on-first-birthday",
  "grandchild-letter": "/letter-to-my-grandchild",
  "eighteen-letters": "/18-letters-for-18th-birthday",
  "baby-firsts": "/baby-firsts-checklist",
  "baby-book-alternatives": "/baby-book-alternatives",
  "email-for-baby": "/email-address-for-baby",
  "family-distance-stats": "/long-distance-family-statistics",
  "long-distance-grandparenting": "/long-distance-grandparenting-ideas",
};
