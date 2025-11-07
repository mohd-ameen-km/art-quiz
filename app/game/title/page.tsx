"use client";
import { useEffect, useState } from "react";
import { getRandomPainting } from "@/lib/getRandomPainting";
import PaintingCard from "@/components/PaintingCard";
import { checkTitle } from "@/lib/checkAnswers";

export default function TitleGame() {
  const [painting, setPainting] = useState<any>(null);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setRevealed(false);
      setGuess("");

      const p = await getRandomPainting();

      if (!p) {
        throw new Error("No painting data received");
      }

      setPainting(p);
    } catch (err) {
      console.error("Error loading painting:", err);
      setError("Failed to load painting. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function submit() {
    if (!guess.trim()) {
      alert("Please enter a guess!");
      return;
    }

    setRevealed(true);
    const correct = checkTitle(guess, painting.title);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !revealed) {
      submit();
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <main className="p-6 max-w-xl mx-auto text-center">
        <div className="mt-20">
          <p className="text-lg">Loading painting...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 max-w-xl mx-auto text-center">
        <div className="mt-20">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-black text-white rounded"
            onClick={load}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!painting) {
    return (
      <main className="p-6 max-w-xl mx-auto text-center">
        <p>No painting available</p>
      </main>
    );
  }

  const isCorrect = checkTitle(guess, painting.title);

  return (
    <main className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Guess the Painting Title</h1>
      <h2 className="mb-6 text-lg font-medium">
        Score: {score} | Streak: {streak}
      </h2>

      <PaintingCard image={painting.image} />

      <p className="mb-2 text-gray-600">What is the title of this painting?</p>

      <input
        className="border p-2 rounded w-full mb-3"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type painting title"
        disabled={revealed}
      />

      {!revealed ? (
        <button
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          onClick={submit}
        >
          Submit
        </button>
      ) : (
        <div className="mt-4">
          <p
            className={`text-lg font-semibold mb-2 ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </p>

          <p className="mb-4">
            The title is: <b>{painting.title || "Unknown"}</b>
          </p>

          {painting.artist && (
            <p className="text-sm text-gray-600 mb-4">
              Artist: <i>{painting.artist}</i>
            </p>
          )}

          <button
            className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors hover:text-black"
            onClick={load}
          >
            Next Painting →
          </button>
        </div>
      )}
    </main>
  );
}
