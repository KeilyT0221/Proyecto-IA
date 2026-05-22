import { CLAUDE_API_KEY } from "../constants/config";
import { fetchMovieByTitle } from "./tmdb";

export async function getAIRecommendations(ratings) {
  if (!ratings || ratings.length === 0) return [];

  const lines = ratings
    .map((m) => `- "${m.title}": ${m.stars}/5 estrellas`)
    .join("\n");

  const prompt = `Eres un experto recomendador de películas en español.
El usuario calificó estas películas:
${lines}

Basándote SOLO en las películas con 4 o 5 estrellas, recomienda exactamente 6 películas similares.
Responde ÚNICAMENTE con un array JSON válido, sin texto extra, sin backticks:
[{"title":"Movie Title in English","reason":"Razón breve en español de máximo 10 palabras"}]`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("API error:", err);
      throw new Error(err.error?.message || "Error en API");
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "[]";

    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const aiRecs = JSON.parse(clean);

    const enriched = await Promise.all(
      aiRecs.map(async (r) => {
        const tmdb = await fetchMovieByTitle(r.title).catch(() => null);
        return tmdb
          ? { ...tmdb, reason: r.reason }
          : { title: r.title, reason: r.reason, id: r.title };
      })
    );
    return enriched;
  } catch (error) {
    console.error("Error en getAIRecommendations:", error);
    throw error;
  }
}
