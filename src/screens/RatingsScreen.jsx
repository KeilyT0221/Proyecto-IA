import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import MovieCard from "../components/MovieCard";
import { Colors } from "../constants/colors";

export default function RatingsScreen({ ratings, onRate }) {
  const list = Object.values(ratings).sort((a, b) => b.stars - a.stars);

  if (list.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={{ fontSize: 60, marginBottom: 16 }}>⭐</Text>
        <Text style={styles.emptyTitle}>Aún no calificaste ninguna película</Text>
        <Text style={styles.emptySub}>Ve a Inicio o Buscar para empezar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Mis Calificaciones</Text>
      <Text style={styles.subtitle}>{list.length} película{list.length !== 1 ? "s" : ""} calificada{list.length !== 1 ? "s" : ""}</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <MovieCard
              movie={item}
              rating={item.stars}
              onRate={(s) => onRate(item, s)}
              compact
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: "800", color: Colors.text, marginTop: 16, marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.muted, marginBottom: 16 },
  cardWrap: { marginBottom: 10 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.bg },
  emptyTitle: { color: Colors.muted, fontSize: 16, fontWeight: "700", marginBottom: 6 },
  emptySub: { color: "#3a3a5a", fontSize: 13 },
});
