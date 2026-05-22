import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, SafeAreaView, StatusBar,
} from "react-native";
import { supabase } from "./src/services/supabase";
import { saveRating, loadRatings } from "./src/storage/ratingsStorage";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import RatingsScreen from "./src/screens/RatingsScreen";
import RecommendScreen from "./src/screens/RecommendScreen";
import { Colors } from "./src/constants/colors";

const TABS = [
  { id: "home",      icon: "🏠", label: "Inicio" },
  { id: "search",    icon: "🔍", label: "Buscar" },
  { id: "ratings",   icon: "⭐", label: "Mi Lista" },
  { id: "recommend", icon: "🤖", label: "IA" },
];

function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState("home");
  const [ratings, setRatings] = useState({});
  const [loadingRatings, setLoadingRatings] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadRatings(user.id)
        .then(setRatings)
        .catch(() => setRatings({}))
        .finally(() => setLoadingRatings(false));
    }
  }, [user]);

  const handleRate = async (movie, stars) => {
    setRatings((prev) => ({ ...prev, [movie.id]: { ...movie, stars } }));
    await saveRating(user.id, movie, stars);
  };

  if (loadingRatings) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={{ color: Colors.muted, marginTop: 12, fontSize: 14 }}>Cargando tu historial...</Text>
      </View>
    );
  }

  const screens = {
    home:      <HomeScreen ratings={ratings} onRate={handleRate} />,
    search:    <SearchScreen ratings={ratings} onRate={handleRate} />,
    ratings:   <RatingsScreen ratings={ratings} onRate={handleRate} />,
    recommend: <RecommendScreen ratings={ratings} />,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <View style={styles.header}>
        <View style={styles.logoMini}><Text style={{ fontSize: 18 }}>🎬</Text></View>
        <View>
          <Text style={styles.headerTitle}>MovieAI</Text>
          <Text style={styles.headerSub}>RECOMENDACIONES</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐{Object.keys(ratings).length}</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Text style={{ fontSize: 16 }}>⏻</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>{screens[tab]}</View>
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.id} style={styles.tabItem} onPress={() => setTab(t.id)}>
            {tab === t.id && <View style={styles.tabIndicator} />}
            <Text style={styles.tabIcon}>{t.icon}</Text>
            <Text style={[styles.tabLabel, tab === t.id && styles.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (checking) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return user ? <MainApp user={user} onLogout={handleLogout} /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  logoMini: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.accent, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "800", color: Colors.text },
  headerSub: { fontSize: 9, color: Colors.accent, letterSpacing: 2 },
  headerRight: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 8 },
  badge: { backgroundColor: Colors.accentSoft, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { fontSize: 11, color: "#a5a5ff" },
  logoutBtn: { backgroundColor: "rgba(124,107,255,0.15)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  content: { flex: 1 },
  tabBar: { flexDirection: "row", borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.bg, paddingBottom: 8 },
  tabItem: { flex: 1, alignItems: "center", paddingTop: 10, paddingBottom: 4, position: "relative" },
  tabIndicator: { position: "absolute", top: 0, width: 28, height: 2, borderRadius: 2, backgroundColor: Colors.accent },
  tabIcon: { fontSize: 20, marginBottom: 3 },
  tabLabel: { fontSize: 10, color: Colors.muted, letterSpacing: 0.5 },
  tabLabelActive: { color: "#a5a5ff", fontWeight: "700" },
});
