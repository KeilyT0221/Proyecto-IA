import { supabase } from "../services/supabase";

// Guardar o actualizar calificación en Supabase
export async function saveRating(userId, movie, stars) {
  const { error } = await supabase
    .from("ratings")
    .upsert({
      user_id: userId,
      movie_id: movie.id.toString(),
      movie_title: movie.title,
      movie_poster: movie.poster_path || null,
      movie_overview: movie.overview || null,
      movie_vote: movie.vote_average || 0,
      stars: stars,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,movie_id",
    });

  if (error) console.error("Error guardando calificación:", error);
  return !error;
}

// Cargar todas las calificaciones del usuario
export async function loadRatings(userId) {
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error cargando calificaciones:", error);
    return {};
  }

  // Convertir array a objeto indexado por movie_id
  const ratingsMap = {};
  data.forEach((r) => {
    ratingsMap[r.movie_id] = {
      id: r.movie_id,
      title: r.movie_title,
      poster_path: r.movie_poster,
      overview: r.movie_overview,
      vote_average: r.movie_vote,
      stars: r.stars,
    };
  });

  return ratingsMap;
}

// Eliminar calificación
export async function deleteRating(userId, movieId) {
  const { error } = await supabase
    .from("ratings")
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", movieId.toString());

  if (error) console.error("Error eliminando calificación:", error);
  return !error;
}
