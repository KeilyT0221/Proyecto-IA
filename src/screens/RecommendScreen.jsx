import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { getAIRecommendations } from "../services/ai";
import MovieCard from "../components/MovieCard";
import { Colors } from "../constants/colors";

export default function RecommendScreen({ ratings }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const ratedList = Object.values(ratings);
  const avg = ratedList.length
    ? (ratedList.reduce((a, b) => a + b.stars, 0) / ratedList.length).toFixed(1)
    : "-";

  const handleRecommend = async () => {
    if (ratedList.length < 2) {
      setError("Califica al menos 2 películas primero.");
      return;
    }
    setError(""); setLoading(true); setDone(false); setRecs([]);
    try {
      const enriched = await getAIRecommendations(ratedList);
      setRecs(enriched);
      setDone(true);
    } catch {
      setError("Error al conectar con la IA. Verifica tu API Key.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Recomendaciones IA</Text>
      <Text style={styles.subtitle}>Analizando recomendaciones para ti...</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>CALIFICADAS</Text>
          <Text style={[styles.statValue, { color: Colors.accent }]}>{ratedList.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>PROMEDIO</Text>
          <Text style={[styles.statValue, { color: Colors.gold }]}>{avg} ★</Text>
        </View>
      </View>

      {error ? (
        <View style={styles.alertError}>
          <Text style={styles.alertText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleRecommend}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>✨ Obtener Recomendaciones</Text>
        }
      </TouchableOpacity>

      {loading && (
        <Text style={styles.loadingText}>Se están analizando tus gustos...</Text>
      )}

      {done && recs.length > 0 && (
        <FlatList
          data={recs}
          keyExtractor={(item, i) => (item.id || i).toString()}
          renderItem={({ item }) => (
            <View style={styles.recCard}>
              <MovieCard movie={item} compact />
            </View>
          )}
          ListHeaderComponent={
            <Text style={styles.recHeader}>Se recomienda para ti</Text>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: "800", color: Colors.text, marginTop: 16, marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.muted, marginBottom: 16 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  statLabel: { fontSize: 10, color: Colors.muted, letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: "800" },
  btn: {
    backgroundColor: Colors.accent, borderRadius: 13,
    padding: 16, alignItems: "center", marginBottom: 20,
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  btnDisabled: { backgroundColor: Colors.accentSoft, shadowOpacity: 0 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  loadingText: { color: Colors.muted, textAlign: "center", fontSize: 13, marginBottom: 16 },
  alertError: {
    backgroundColor: "rgba(255,107,107,0.1)", borderRadius: 12,
    borderWidth: 1, borderColor: "rgba(255,107,107,0.3)",
    padding: 12, marginBottom: 16,
  },
  alertText: { color: "#ffaaaa", fontSize: 13 },
  recHeader: { fontSize: 11, color: Colors.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 },
  recCard: { marginBottom: 10 },
});
