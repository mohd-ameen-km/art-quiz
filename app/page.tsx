import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-10 text-center">
      <h1 className="text-3xl font-semibold">🎨 Art Guessing Game</h1>

      <p className="text-gray-600">Choose your challenge:</p>

      <div className="flex gap-4">
        <Link href="/game/painter">
          <button className="px-6 py-3 bg-black text-white rounded hover:opacity-85">
            Guess the Painter
          </button>
        </Link>
        <Link href="/game/title">
          <button className="px-6 py-3 border border-black rounded hover:bg-gray-100">
            Guess the Painting Title
          </button>
        </Link>
      </div>
    </main>
  );
}
