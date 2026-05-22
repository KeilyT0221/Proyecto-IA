import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, FlatList,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { searchMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import { Colors } from "../constants/colors";

export default function SearchScreen({ ratings, onRate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const handleChange = (v) => {
    setQuery(v);
    clearTimeout(timer.current);
    if (!v.trim()) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      const r = await searchMovies(v).catch(() => []);
      setResults(r);
      setLoading(false);
    }, 500);
  };

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
      <Text style={styles.title}>🔍 Buscar</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la película..."
          placeholderTextColor={Colors.muted}
          value={query}
          onChangeText={handleChange}
          autoCorrect={false}
        />
      </View>

      {loading && <ActivityIndicator color={Colors.accent} style={{ marginTop: 24 }} />}

      {!loading && query !== "" && results.length === 0 && (
        <Text style={styles.empty}>Sin resultados para "{query}"</Text>
      )}

      <FlatList
        data={results}
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
  title: { fontSize: 24, fontWeight: "800", color: Colors.text, marginTop: 16, marginBottom: 14 },
  inputWrap: { marginBottom: 16 },
  input: {
    backgroundColor: Colors.card, borderRadius: 13,
    borderWidth: 1, borderColor: Colors.border,
    padding: 14, color: Colors.text, fontSize: 15,
  },
  empty: { color: Colors.muted, textAlign: "center", marginTop: 40, fontSize: 14 },
  list: { paddingBottom: 100 },
  cardWrap: { flex: 1, marginBottom: 12 },
});
