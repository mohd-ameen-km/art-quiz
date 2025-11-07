export const runtime = "edge";

let metIDs: number[] | null = null;
let clevelandIDs: number[] | null = null;

/* --------------------------------------------
   1) MET Museum — Use cached objectIDs list
-------------------------------------------- */
async function loadMET() {
  const res = await fetch(
    "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isPublicDomain=true&q=painting"
  ).then(r => r.json()).catch(() => null);

  metIDs = res?.objectIDs || [];
}

async function getMET() {
  if (!metIDs) await loadMET(); // Cache load once

  if (!metIDs?.length) return null;

  const id = metIDs[Math.floor(Math.random() * metIDs.length)];

  const d = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
  ).then(r => r.json()).catch(() => null);

  if (!d?.primaryImageSmall || !d?.artistDisplayName) return null;

  return {
    title: d.title || "Unknown Title",
    artist: d.artistDisplayName || "Unknown Artist",
    image: d.primaryImageSmall,
  };
}

/* --------------------------------------------
   2) Art Institute of Chicago — Random Page (1–1301)
-------------------------------------------- */
async function getAIC() {
  const randomPage = Math.floor(Math.random() * 1301) + 1;

  const res = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${randomPage}&limit=50&fields=id,title,artist_title,image_id,is_public_domain,classification_titles`
  ).then(r => r.json()).catch(() => null);

  if (!res?.data) return null;

  const paintings = res.data.filter((item: any) => {
    const classes = (item.classification_titles || []).map((c: string) => c.toLowerCase());
    return (
      item.is_public_domain &&
      item.image_id &&
      item.artist_title &&
      classes.some(c => c.includes("painting"))
    );
  });

  if (paintings.length === 0) return null;

  const p = paintings[Math.floor(Math.random() * paintings.length)];

  return {
    title: p.title || "Unknown Title",
    artist: p.artist_title || "Unknown Artist",
    image: `https://www.artic.edu/iiif/2/${p.image_id}/full/843,/0/default.jpg`,
  };
}

/* --------------------------------------------
   3) Cleveland Museum — Preload ID list once
-------------------------------------------- */
async function loadCleveland() {
  const res = await fetch(
    "https://openaccess-api.clevelandart.org/api/artworks/?type=Painting&has_image=1&limit=5000"
  ).then(r => r.json()).catch(() => null);

  clevelandIDs = res?.data?.map((d: any) => d.id) || [];
}

async function getCleveland() {
  if (!clevelandIDs) await loadCleveland(); // Cache once

  if (!clevelandIDs?.length) return null;

  const id = clevelandIDs[Math.floor(Math.random() * clevelandIDs.length)];

  const d = await fetch(
    `https://openaccess-api.clevelandart.org/api/artworks/${id}`
  ).then(r => r.json()).catch(() => null);

  const item = d?.data;
  const image = item?.images?.web?.url;
  const artist = item?.creators?.[0]?.description;

  if (!image || !artist) return null;

  return {
    title: item.title || "Unknown Title",
    artist,
    image,
  };
}

/* --------------------------------------------
   🎲 Fair Random Selector — Shuffle per Request
-------------------------------------------- */
function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  async function getRandomPainting() {
    // Shuffle the order once per call
    const shuffledSources = shuffle([getAIC, getCleveland, getMET]);
  
    // Try each museum once, no bias
    for (const fn of shuffledSources) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const p = await fn();
        if (p) return p;
      }
    }
  
    return { error: "No artwork available. Try again." };
  }
  

/* --------------------------------------------
   API Handler
-------------------------------------------- */
export async function GET() {
  const result = await getRandomPainting();
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
