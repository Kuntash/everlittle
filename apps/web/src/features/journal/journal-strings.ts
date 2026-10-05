import type { ContentLocale } from "@/lib/locales";

export type JournalStrings = {
  dateLocale: string;
  home: string;
  journal: string;
  journalPath: string;
  start: string;
  byline: string;
  minRead: string;
  onThisPage: string;
  contentsLabel: string;
  defaultLede: string;
  defaultQuote: string;
  heroLineOne: string;
  heroLineTwo: string;
  promptTitle: string;
  promptBody: string;
  sources: string;
  readNext: string;
  readStory: string;
  tagline: string;
  create: string;
  // Shown on localized guides because the product interface itself is still English-only.
  languageNote?: string;
  hubEyebrow: string;
  hubTitle: string;
  hubIntro: string;
  hubMetaTitle: string;
};

export const journalStrings: Record<ContentLocale, JournalStrings> = {
  en: {
    dateLocale: "en-US",
    home: "Home",
    journal: "Journal",
    journalPath: "/journal",
    start: "Start your archive",
    byline: "By the Everlittle journal",
    minRead: "min read",
    onThisPage: "On this page",
    contentsLabel: "Article contents",
    defaultLede: "Choose one idea below and try it with a memory you already have.",
    defaultQuote: "A little detail, kept today, can bring a whole season back.",
    heroLineOne: "Their story,",
    heroLineTwo: "in your words.",
    promptTitle: "Keep one detail from today.",
    promptBody: "Start with a sentence, a photo or a familiar voice.",
    sources: "Sources",
    readNext: "Read next",
    readStory: "Read story",
    tagline: "A home for your family’s memories.",
    create: "Create your archive",
    hubEyebrow: "The Everlittle journal",
    hubTitle: "Ideas for the memories you want to keep.",
    hubIntro: "Practical ways to keep childhood memories. From first entries to letters for later.",
    hubMetaTitle: "Everlittle Journal — Ideas for the memories you want to keep",
  },
  es: {
    dateLocale: "es",
    home: "Inicio",
    journal: "Guías",
    journalPath: "/es",
    start: "Crea tu archivo",
    byline: "Por el equipo de Everlittle",
    minRead: "min de lectura",
    onThisPage: "En esta página",
    contentsLabel: "Contenido del artículo",
    defaultLede: "Elige una idea y pruébala con un recuerdo que ya tengas.",
    defaultQuote: "Un pequeño detalle, guardado hoy, puede devolverte toda una época.",
    heroLineOne: "Su historia,",
    heroLineTwo: "con tus palabras.",
    promptTitle: "Guarda un detalle de hoy.",
    promptBody: "Empieza con una frase, una foto o una voz querida.",
    sources: "Fuentes",
    readNext: "Sigue leyendo",
    readStory: "Leer la guía",
    tagline: "Un hogar para los recuerdos de tu familia.",
    create: "Crea tu archivo",
    languageNote:
      "Estas guías están escritas en español. Por ahora, la aplicación de Everlittle está disponible en inglés.",
    hubEyebrow: "Guías de Everlittle",
    hubTitle: "Ideas para los recuerdos que quieres conservar.",
    hubIntro: "Cartas, preguntas y pequeñas costumbres para guardar la infancia en familia.",
    hubMetaTitle: "Guías de Everlittle — Ideas para conservar los recuerdos de tu familia",
  },
  "pt-br": {
    dateLocale: "pt-BR",
    home: "Início",
    journal: "Guias",
    journalPath: "/pt-br",
    start: "Crie seu arquivo",
    byline: "Pela equipe da Everlittle",
    minRead: "min de leitura",
    onThisPage: "Nesta página",
    contentsLabel: "Conteúdo do artigo",
    defaultLede: "Escolha uma ideia e experimente com uma lembrança que você já tem.",
    defaultQuote: "Um pequeno detalhe, guardado hoje, pode trazer de volta uma fase inteira.",
    heroLineOne: "A história deles,",
    heroLineTwo: "nas suas palavras.",
    promptTitle: "Guarde um detalhe de hoje.",
    promptBody: "Comece com uma frase, uma foto ou uma voz querida.",
    sources: "Fontes",
    readNext: "Leia também",
    readStory: "Ler o guia",
    tagline: "Um lar para as memórias da sua família.",
    create: "Crie seu arquivo",
    languageNote:
      "Estes guias foram escritos em português. Por enquanto, o aplicativo da Everlittle está disponível em inglês.",
    hubEyebrow: "Guias da Everlittle",
    hubTitle: "Ideias para as memórias que você quer guardar.",
    hubIntro: "Cartas, perguntas e pequenos costumes para guardar a infância em família.",
    hubMetaTitle: "Guias da Everlittle — Ideias para guardar as memórias da sua família",
  },
};
