import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { TMDB_IMG } from "../constants/config";
import StarRating from "./StarRating";

export default function MovieCard({ movie, rating, onRate, compact = false }) {
  const poster = movie.poster_path ? `${TMDB_IMG}${movie.poster_path}` : null;

  if (compact) {
    return (
      <View style={styles.compactCard}>
        {poster ? (
          <Image source={{ uri: poster }} style={styles.compactPoster} />
        ) : (
          <View style={[styles.compactPoster, styles.noPoster]}>
            <Text style={{ fontSize: 28 }}>🎬</Text>
          </View>
        )}
        <View style={styles.compactInfo}>
          <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
          {movie.reason && (
            <Text style={styles.reason} numberOfLines={2}>{movie.reason}</Text>
          )}
          {onRate && (
            <>
              <Text style={styles.label}>{rating ? "Tu calificación" : "Calificar"}</Text>
              <StarRating value={rating || 0} onChange={onRate} size={18} />
            </>
          )}
          {!onRate && rating > 0 && <StarRating value={rating} size={16} />}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {poster ? (
        <Image source={{ uri: poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={{ fontSize: 44 }}>🎬</Text>
        </View>
      )}
      {movie.vote_average > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⭐ {movie.vote_average?.toFixed(1)}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.overview} numberOfLines={2}>
          {movie.overview || "Sin descripción disponible."}
        </Text>
        {onRate && (
          <>
            <Text style={styles.label}>{rating ? "Tu calificación" : "Calificar"}</Text>
            <StarRating value={rating || 0} onChange={onRate} size={22} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
  },
  poster: {
    width: "100%",
    height: 210,
    resizeMode: "cover",
  },
  compactPoster: {
    width: 72,
    height: 104,
    resizeMode: "cover",
  },
  noPoster: {
    backgroundColor: "#1a0f3a",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.gold,
  },
  info: {
    padding: 14,
  },
  compactInfo: {
    padding: 12,
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 20,
  },
  overview: {
    color: Colors.muted,
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 16,
  },
  reason: {
    color: "#7878aa",
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 16,
  },
  label: {
    color: Colors.muted,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
});
