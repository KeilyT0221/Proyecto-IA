import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from "react-native";
import { supabase } from "../services/supabase";
import { Colors } from "../constants/colors";

export default function LoginScreen() {
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSendOTP = async () => {
    if (!email.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: e } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (e) {
      setError("Error al enviar: " + e.message);
      return;
    }
    setInfo(`Código enviado a ${email}. Revisa tu bandeja de entrada.`);
    setStep("otp");
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 8) {
      setError("El código debe tener 8 dígitos.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: e } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (e) {
      setError("Código incorrecto o expirado. Intenta de nuevo.");
    }
    // Si es exitoso, el onAuthStateChange en App.js detecta la sesión automáticamente
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={{ fontSize: 36 }}>🎬</Text>
          </View>
          <Text style={styles.appName}>MovieAI</Text>
          <Text style={styles.appSub}>POWERED BY CLAUDE</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {step === "email" ? (
            <>
              <Text style={styles.cardTitle}>Iniciar sesión</Text>
              <Text style={styles.cardSub}>
                Te enviaremos un código a tu correo.{"\n"}Sin contraseñas.
              </Text>

              {error ? <View style={styles.alertError}><Text style={styles.alertErrorText}>{error}</Text></View> : null}

              <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@correo.com"
                placeholderTextColor={Colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnText}>📧 Enviar código de verificación</Text>
                }
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => { setStep("email"); setOtp(""); setError(""); }} style={{ marginBottom: 16 }}>
                <Text style={{ color: Colors.muted, fontSize: 13 }}>← Cambiar correo</Text>
              </TouchableOpacity>

              <Text style={styles.cardTitle}>Verifica tu correo</Text>

              {info ? <View style={styles.alertSuccess}><Text style={styles.alertSuccessText}>{info}</Text></View> : null}
              {error ? <View style={styles.alertError}><Text style={styles.alertErrorText}>{error}</Text></View> : null}

              <Text style={styles.cardSub}>
                Ingresa el código de 8 dígitos enviado a{" "}
                <Text style={{ color: Colors.text, fontWeight: "700" }}>{email}</Text>
              </Text>

              <Text style={styles.inputLabel}>CÓDIGO DE VERIFICACIÓN</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="12345678"
                placeholderTextColor={Colors.muted}
                value={otp}
                onChangeText={(v) => setOtp(v.replace(/\D/g, "").slice(0, 8))}
                keyboardType="number-pad"
                maxLength={8}
                autoFocus
              />

              <TouchableOpacity
                style={[styles.btn, (loading || otp.length !== 8) && styles.btnDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading || otp.length !== 8}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnText}>✅ Verificar y entrar</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSendOTP} style={{ marginTop: 16, alignItems: "center" }}>
                <Text style={{ color: Colors.muted, fontSize: 13 }}>¿No llegó el código? Reenviar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Text style={styles.footer}>Al continuar aceptas los términos de uso</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  logoContainer: { alignItems: "center", marginBottom: 36 },
  logoBox: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: "center", justifyContent: "center",
    marginBottom: 14,
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  appName: { fontSize: 32, fontWeight: "900", color: Colors.text, letterSpacing: -1 },
  appSub: { fontSize: 11, color: Colors.accent, letterSpacing: 3, marginTop: 4 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 24,
    borderWidth: 1, borderColor: Colors.border,
    padding: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4, shadowRadius: 32, elevation: 10,
  },
  cardTitle: { fontSize: 22, fontWeight: "800", color: Colors.text, marginBottom: 8 },
  cardSub: { fontSize: 13, color: Colors.muted, marginBottom: 20, lineHeight: 20 },
  inputLabel: { fontSize: 10, color: Colors.muted, letterSpacing: 1.5, marginBottom: 8 },
  input: {
    backgroundColor: Colors.card, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.border,
    padding: 14, color: Colors.text, fontSize: 15, marginBottom: 16,
  },
  otpInput: { textAlign: "center", fontSize: 24, fontWeight: "800", letterSpacing: 8 },
  btn: {
    backgroundColor: Colors.accent, borderRadius: 13,
    padding: 16, alignItems: "center",
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  btnDisabled: { backgroundColor: Colors.accentSoft, shadowOpacity: 0 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  alertError: {
    backgroundColor: "rgba(255,107,107,0.1)", borderRadius: 12,
    borderWidth: 1, borderColor: "rgba(255,107,107,0.3)",
    padding: 12, marginBottom: 14,
  },
  alertErrorText: { color: "#ffaaaa", fontSize: 13 },
  alertSuccess: {
    backgroundColor: "rgba(107,255,184,0.1)", borderRadius: 12,
    borderWidth: 1, borderColor: "rgba(107,255,184,0.3)",
    padding: 12, marginBottom: 14,
  },
  alertSuccessText: { color: "#aaffdd", fontSize: 13 },
  footer: { textAlign: "center", color: Colors.muted, fontSize: 11, marginTop: 20 },
});
