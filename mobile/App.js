import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const defaultApiUrl = "http://localhost:8080/api";

async function apiFetch(apiUrl, path, token, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.message || "Erro ao chamar API");
  }
  return data;
}

export default function App() {
  const [apiUrl, setApiUrl] = useState(defaultApiUrl);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [storedApiUrl, storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem("apiUrl"),
        AsyncStorage.getItem("token"),
        AsyncStorage.getItem("user")
      ]);
      setApiUrl(storedApiUrl || defaultApiUrl);
      setToken(storedToken || "");
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setLoading(false);
    }
    load();
  }, []);

  async function saveSession(session, nextApiUrl) {
    await AsyncStorage.multiSet([
      ["apiUrl", nextApiUrl],
      ["token", session.token],
      ["user", JSON.stringify(session.user)]
    ]);
    setApiUrl(nextApiUrl);
    setToken(session.token);
    setUser(session.user);
  }

  async function logout() {
    await AsyncStorage.multiRemove(["token", "user"]);
    setToken("");
    setUser(null);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {user ? (
        <Home apiUrl={apiUrl} token={token} user={user} logout={logout} />
      ) : (
        <Login apiUrl={apiUrl} saveSession={saveSession} />
      )}
    </SafeAreaView>
  );
}

function LoadingScreen() {
  return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}

function Login({ apiUrl, saveSession }) {
  const [email, setEmail] = useState("aluno@songschool.com");
  const [password, setPassword] = useState("123456");
  const [apiUrlValue, setApiUrlValue] = useState(apiUrl);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const session = await apiFetch(apiUrlValue, "/auth/login", "", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      await saveSession(session, apiUrlValue);
    } catch (err) {
      Alert.alert("Login", err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Absence Manager</Text>
        <Text style={styles.subtitle}>SongSchool</Text>
      </View>
      <TextInput style={styles.input} value={apiUrlValue} onChangeText={setApiUrlValue} autoCapitalize="none" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Pressable style={styles.primaryButton} onPress={submit} disabled={busy}>
        <Text style={styles.primaryButtonText}>{busy ? "Entrando..." : "Entrar"}</Text>
      </Pressable>
    </View>
  );
}

function Home({ apiUrl, token, user, logout }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);

  async function loadHistory() {
    if (user.role !== "ALUNO") {
      return;
    }
    try {
      setHistory(await apiFetch(apiUrl, "/attendance/me", token));
    } catch (err) {
      Alert.alert("Historico", err.message);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleBarcode({ data }) {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      const attendance = await apiFetch(apiUrl, "/attendance/check-in", token, {
        method: "POST",
        body: JSON.stringify({ qrToken: data })
      });
      setScanning(false);
      Alert.alert("Presenca confirmada", `${attendance.lessonTitle}\n${attendance.classGroupName}`);
      await loadHistory();
    } catch (err) {
      Alert.alert("Check-in", err.message);
    } finally {
      setBusy(false);
    }
  }

  async function openScanner() {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Camera", "Permissao de camera e obrigatoria para ler o QR Code.");
        return;
      }
    }
    setScanning(true);
  }

  if (scanning) {
    return (
      <View style={styles.scannerPage}>
        <CameraView style={styles.camera} barcodeScannerSettings={{ barcodeTypes: ["qr"] }} onBarcodeScanned={handleBarcode} />
        <Pressable style={styles.secondaryButton} onPress={() => setScanning(false)}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Ola, {user.name}</Text>
          <Text style={styles.subtitle}>{user.role}</Text>
        </View>
        <Pressable style={styles.smallButton} onPress={logout}>
          <Text style={styles.smallButtonText}>Sair</Text>
        </Pressable>
      </View>

      {user.role === "ALUNO" ? (
        <>
          <Pressable style={styles.primaryButton} onPress={openScanner}>
            <Text style={styles.primaryButtonText}>Ler QR Code</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={loadHistory}>
            <Text style={styles.secondaryButtonText}>Atualizar historico</Text>
          </Pressable>
          <Text style={styles.sectionTitle}>Minhas presencas</Text>
          <FlatList
            data={history}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.historyTitle}>{item.lessonTitle}</Text>
                <Text style={styles.historyText}>{item.classGroupName}</Text>
                <Text style={styles.historyText}>{new Date(item.checkedInAt).toLocaleString()}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Nenhuma presenca registrada ainda.</Text>}
          />
        </>
      ) : (
        <Text style={styles.empty}>Use o painel web para gerar QR Code e consultar relatorios.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f4f7f9"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    gap: 14,
    padding: 20
  },
  header: {
    gap: 4,
    marginBottom: 12
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  title: {
    color: "#1f2937",
    fontSize: 26,
    fontWeight: "800"
  },
  subtitle: {
    color: "#64748b",
    fontSize: 15
  },
  input: {
    backgroundColor: "white",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 12
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#155e75",
    borderRadius: 8,
    minHeight: 50,
    justifyContent: "center"
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800"
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: "center"
  },
  secondaryButtonText: {
    color: "#155e75",
    fontSize: 16,
    fontWeight: "800"
  },
  smallButton: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  smallButtonText: {
    color: "#334155",
    fontWeight: "800"
  },
  sectionTitle: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10
  },
  historyItem: {
    backgroundColor: "white",
    borderColor: "#d8e1e8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    marginBottom: 10,
    padding: 14
  },
  historyTitle: {
    color: "#1f2937",
    fontSize: 16,
    fontWeight: "800"
  },
  historyText: {
    color: "#64748b"
  },
  empty: {
    color: "#64748b",
    lineHeight: 22
  },
  scannerPage: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16
  },
  camera: {
    borderRadius: 8,
    flex: 1,
    overflow: "hidden"
  }
});

