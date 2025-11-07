export async function getRandomPainting() {
  return fetch("/api/random").then(r => r.json()).catch(() => null);
}
