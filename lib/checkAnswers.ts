// lib/checkAnswers.ts

// --- helpers ---
function stripParens(s: string): string {
    // remove all parenthetical segments
    return s.replace(/\s*\([^)]*\)/g, "");
  }
  
  function normalizeName(s: string): string {
    // lowercase, remove diacritics, keep letters, spaces, apostrophes & hyphens
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z'\-\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  
  function toTokens(s: string): string[] {
    const clean = normalizeName(stripParens(s));
    return clean.split(" ").filter(Boolean);
  }
  
  function isEastAsian(rawArtist: string): boolean {
    // look into the parenthetical meta for nationality hints
    const meta = (rawArtist.match(/\(([^)]*)\)/)?.[1] || "").toLowerCase();
    return /(chinese|japanese|korean)/.test(meta);
  }
  
  function surnameFromTokens(tokens: string[], eastAsian: boolean): string {
    if (tokens.length === 0) return "";
    if (tokens.length === 1) return tokens[0];
    return eastAsian ? tokens[0] : tokens[tokens.length - 1];
  }
  
  // --- painter check ---
  // Scoring rules:
  // 1) Full exact name match → true
  // 2) Single-token guess equals surname → true
  // 3) Multi-token guess with surname matched but first name wrong → false
  // 4) For East Asian names, accept both orders when all tokens match (e.g., "Xia Kui" or "Kui Xia")
  export function checkPainter(guessRaw: string, artistRaw: string): boolean {
    const eastAsian = isEastAsian(artistRaw);
  
    const artistTokens = toTokens(artistRaw);
    if (artistTokens.length === 0) return false;
  
    const artistSurname = surnameFromTokens(artistTokens, eastAsian);
    const artistFull = artistTokens.join(" ");
  
    const guessTokens = toTokens(guessRaw);
    if (guessTokens.length === 0) return false;
  
    const guessFull = guessTokens.join(" ");
  
    // 1) Full exact match
    if (guessFull === artistFull) return true;
  
    // 1b) For East Asian names with two tokens, also accept reversed order full match
    if (
      eastAsian &&
      artistTokens.length === 2 &&
      guessTokens.length === 2 &&
      guessTokens[0] === artistTokens[1] &&
      guessTokens[1] === artistTokens[0]
    ) {
      return true;
    }
  
    // 2) Single-token "surname only" allowed
    if (guessTokens.length === 1) {
      return guessTokens[0] === artistSurname;
    }
  
    // 3) Multi-token but not full exact match → do NOT award
    // (prevents "Adam Pollock" from matching "Jackson Pollock")
    return false;
  }
  
  // --- title check (unchanged, but included for completeness) ---
  function normalizeTitle(s: string): string {
    // remove leading articles for comparison
    return normalizeName(s).replace(/^(the|a|an)\s+/, "");
  }
  
  export function checkTitle(guess: string, correct: string): boolean {
    return normalizeTitle(guess) === normalizeTitle(correct);
  }
  