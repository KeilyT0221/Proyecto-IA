import { TMDB_BASE, TMDB_API_KEY } from "../constants/config";

export async function fetchPopular() {
  const r = await fetch(
    `${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}&language=es-MX&page=1`
  );
  const d = await r.json();
  return d.results || [];
}

export async function searchMovies(query) {
  const r = await fetch(
    `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&language=es-MX&query=${encodeURIComponent(query)}`
  );
  const d = await r.json();
  return d.results || [];
}

export async function fetchMovieByTitle(title) {
  const r = await fetch(
    `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&language=es-MX&query=${encodeURIComponent(title)}`
  );
  const d = await r.json();
  return d.results?.[0] || null;
}
