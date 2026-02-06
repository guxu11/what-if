// Language detection utility for auto-detecting user input language
// Uses character analysis and common patterns to identify language

const LANGUAGE_PATTERNS = {
  // Chinese (Simplified & Traditional)
  zh: {
    ranges: [
      [0x4e00, 0x9fff],
      [0x3400, 0x4dbf],
      [0x20000, 0x2a6df],
    ],
    commonChars:
      "的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其进此话常与活正感",
    minConfidence: 0.3,
  },
  // Japanese (mix of Hiragana, Katakana, Kanji)
  ja: {
    ranges: [
      [0x3040, 0x309f],
      [0x30a0, 0x30ff],
      [0x4e00, 0x9faf],
    ],
    commonChars:
      "のたではありますますでしたがしかしのでしてとをにあれこれそれ何時行見聞食飲言読書買来働会話思感答話題話題日本人人話",
    minConfidence: 0.25,
  },
  // German
  de: {
    commonWords: [
      "der",
      "die",
      "das",
      "ist",
      "und",
      "ich",
      "du",
      "er",
      "sie",
      "es",
      "wir",
      "ihr",
      "Sie",
      "haben",
      "sein",
      "werden",
      "machen",
      "gehen",
      "kommen",
      "sagen",
      "sehen",
      "wissen",
      "können",
      "müssen",
      "sollen",
      "wollen",
      "nicht",
      "auch",
      "nur",
      "oder",
      "aber",
      "weil",
      "dass",
      "wenn",
      "bis",
      "wie",
      "wo",
      "wohin",
      "woher",
      "von",
      "aus",
      "bei",
      "mit",
      "nach",
      "über",
      "für",
      "gegen",
      "ohne",
      "um",
    ],
    specialChars: "äöüßÄÖÜ",
    minConfidence: 0.2,
  },
  // French
  fr: {
    commonWords: [
      "le",
      "la",
      "les",
      "un",
      "une",
      "des",
      "de",
      "du",
      "à",
      "au",
      "aux",
      "en",
      "dans",
      "pour",
      "sur",
      "avec",
      "par",
      "sans",
      "sous",
      "vers",
      "chez",
      "contre",
      "entre",
      "pendant",
      "depuis",
      "jusqu",
      "pendant",
      "après",
      "avant",
      "maintenant",
      "alors",
      "donc",
      "mais",
      "ou",
      "et",
      "si",
      "quand",
      "comme",
      "où",
      "qui",
      "que",
      "quoi",
      "dont",
      "lequel",
      "auquel",
      "duquel",
    ],
    specialChars: "éèêëàâäùûüôöîïçÉÈÊËÀÂÄÙÛÜÔÖÎÏÇ",
    minConfidence: 0.2,
  },
  // Spanish
  es: {
    commonWords: [
      "el",
      "la",
      "los",
      "las",
      "un",
      "una",
      "unos",
      "unas",
      "de",
      "del",
      "a",
      "al",
      "en",
      "por",
      "para",
      "con",
      "sin",
      "sobre",
      "entre",
      "hasta",
      "desde",
      "hacia",
      "durante",
      "según",
      "mediante",
      "y",
      "o",
      "pero",
      "sino",
      "que",
      "quien",
      "quienes",
      "cual",
      "cuales",
      "donde",
      "cuando",
      "como",
      "cuanto",
      "cuanta",
      "cuantos",
      "cuantas",
      "este",
      "esta",
      "esto",
      "estos",
      "estas",
      "ese",
      "esa",
      "eso",
      "esos",
      "esas",
      "aquel",
      "aquella",
      "aquello",
      "aquellos",
      "aquellas",
      "mi",
      "mis",
      "tu",
      "tus",
      "su",
      "sus",
      "nuestro",
      "nuestra",
      "nuestros",
      "nuestras",
      "ser",
      "estar",
      "tener",
      "hacer",
      "ir",
      "ver",
      "poder",
      "saber",
      "querer",
      "deber",
      "haber",
      "decir",
      "venir",
      "pensar",
      "dar",
      "pasar",
    ],
    specialChars: "áéíóúñÁÉÍÓÚÑ¿¡",
    minConfidence: 0.2,
  },
  // Portuguese
  pt: {
    commonWords: [
      "o",
      "a",
      "os",
      "as",
      "um",
      "uma",
      "uns",
      "umas",
      "de",
      "do",
      "da",
      "dos",
      "das",
      "em",
      "no",
      "na",
      "nos",
      "nas",
      "por",
      "para",
      "com",
      "sem",
      "sobre",
      "entre",
      "até",
      "desde",
      "durante",
      "e",
      "mas",
      "ou",
      "porque",
      "que",
      "quem",
      "qual",
      "quais",
      "onde",
      "quando",
      "como",
      "quanto",
      "quanta",
      "quantos",
      "quantas",
      "este",
      "esta",
      "isto",
      "estes",
      "estas",
      "esse",
      "essa",
      "isso",
      "esses",
      "essas",
      "aquele",
      "aquela",
      "aquilo",
      "aqueles",
      "aquelas",
      "meu",
      "minha",
      "meus",
      "minhas",
      "teu",
      "tua",
      "teus",
      "tuas",
      "seu",
      "sua",
      "seus",
      "suas",
      "nosso",
      "nossa",
      "nossos",
      "nossas",
      "ser",
      "estar",
      "ter",
      "fazer",
      "ir",
      "ver",
      "poder",
      "saber",
      "querer",
      "dever",
      "haver",
      "dizer",
      "vir",
      "pensar",
      "dar",
      "passar",
    ],
    specialChars: "áéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ",
    minConfidence: 0.2,
  },
  // English (fallback)
  en: {
    commonWords: [
      "the",
      "be",
      "to",
      "of",
      "and",
      "a",
      "in",
      "that",
      "have",
      "I",
      "it",
      "for",
      "not",
      "on",
      "with",
      "he",
      "as",
      "you",
      "do",
      "at",
      "this",
      "but",
      "his",
      "by",
      "from",
      "they",
      "we",
      "say",
      "her",
      "she",
      "or",
      "an",
      "will",
      "my",
      "one",
      "all",
      "would",
      "there",
      "their",
      "what",
      "so",
      "up",
      "out",
      "if",
      "about",
      "who",
      "get",
      "which",
      "go",
      "me",
      "when",
      "make",
      "can",
      "like",
      "time",
      "no",
      "just",
      "him",
      "know",
      "take",
      "people",
      "into",
      "year",
      "your",
      "good",
      "some",
      "could",
      "them",
      "see",
      "other",
      "than",
      "then",
      "now",
      "look",
      "only",
      "come",
      "its",
      "over",
      "think",
      "also",
      "back",
      "after",
      "use",
      "two",
      "how",
      "our",
      "work",
      "first",
      "well",
      "way",
      "even",
      "new",
      "want",
      "because",
      "any",
      "these",
      "give",
      "day",
      "most",
      "us",
    ],
    minConfidence: 0.15,
  },
};

/**
 * Detect the language of a given text
 * @param {string} text - The text to analyze
 * @returns {string} - Language code (e.g., 'en', 'zh', 'es')
 */
export function detectLanguage(text) {
  if (!text || text.trim().length === 0) {
    return "en"; // Default to English
  }

  const scores = {};

  // Check for CJK characters (Chinese/Japanese/Korean)
  for (const char of text) {
    const code = char.charCodeAt(0);

    // Chinese
    if (isInRanges(code, LANGUAGE_PATTERNS.zh.ranges)) {
      scores.zh = (scores.zh || 0) + 1;
    }
    // Japanese (Hiragana/Katakana)
    else if (code >= 0x3040 && code <= 0x30ff) {
      scores.ja = (scores.ja || 0) + 2; // Give more weight to Japanese scripts
    }
  }

  // Check for common words in each language
  const words = text.toLowerCase().split(/\s+/);

  for (const word of words) {
    for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
      if (pattern.commonWords && pattern.commonWords.includes(word)) {
        scores[lang] = (scores[lang] || 0) + 1;
      }
    }
  }

  // Check for special characters (accented letters)
  for (const char of text) {
    for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
      if (pattern.specialChars && pattern.specialChars.includes(char)) {
        scores[lang] = (scores[lang] || 0) + 0.5;
      }
    }
  }

  // Calculate confidence scores
  const totalChars = text.length;
  const confidenceScores = {};

  for (const [lang, score] of Object.entries(scores)) {
    const pattern = LANGUAGE_PATTERNS[lang];
    if (pattern) {
      confidenceScores[lang] = score / (totalChars * (pattern.minConfidence || 0.1));
    }
  }

  // Find the language with the highest confidence
  let detectedLang = "en";
  let maxConfidence = 0;

  for (const [lang, confidence] of Object.entries(confidenceScores)) {
    const pattern = LANGUAGE_PATTERNS[lang];
    const minConfidence = pattern?.minConfidence || 0.1;

    if (confidence >= minConfidence && confidence > maxConfidence) {
      maxConfidence = confidence;
      detectedLang = lang;
    }
  }

  return detectedLang;
}

/**
 * Helper function to check if a character code falls within any of the given ranges
 */
function isInRanges(code, ranges) {
  for (const [start, end] of ranges) {
    if (code >= start && code <= end) {
      return true;
    }
  }
  return false;
}

/**
 * Get a list of all supported language codes
 */
export function getSupportedLanguages() {
  return Object.keys(LANGUAGE_PATTERNS);
}

/**
 * Check if a language code is supported
 */
export function isLanguageSupported(lang) {
  return LANGUAGE_PATTERNS.hasOwnProperty(lang);
}

/**
 * Get the user's browser language preference
 */
export function getBrowserLanguage() {
  if (typeof navigator !== "undefined" && navigator.language) {
    const browserLang = navigator.language.split("-")[0];
    if (isLanguageSupported(browserLang)) {
      return browserLang;
    }
  }
  return "en"; // Default to English
}
