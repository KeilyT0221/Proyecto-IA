import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
} from "react-native";
import { fetchPopular } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import { Colors } from "../constants/colors";

export default function HomeScreen({ ratings, onRate }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopular()
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Cargando películas...</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <View style={[styles.cardWrap, index % 2 === 0 ? { marginRight: 6 } : { marginLeft: 6 }]}>
      <MovieCard
        movie={item}
        rating={ratings[item.id]?.stars}
        onRate={(s) => onRate(item, s)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Populares</Text>
      <Text style={styles.subtitle}>Califica para recibir recomendaciones</Text>
      <FlatList
        data={movies.slice(0, 18)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.bg },
  loadingText: { color: Colors.muted, marginTop: 12, fontSize: 14 },
  title: { fontSize: 24, fontWeight: "800", color: Colors.text, marginTop: 16, marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.muted, marginBottom: 16 },
  list: { paddingBottom: 100 },
  cardWrap: { flex: 1, marginBottom: 12 },
});
