import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import BackButton from "../BackButton"; // Assuming you have a BackButton component

export default function ResetPwScreen({ navigation }) {
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleReset = () => {
    if (!pw || !confirmPw) {
      Alert.alert("입력 오류", "모든 항목을 입력해주세요.");
      return;
    }
    if (pw !== confirmPw) {
      Alert.alert("비밀번호 불일치", "비밀번호가 일치하지 않습니다.");
      return;
    }
    Alert.alert("완료", "비밀번호가 성공적으로 재설정되었습니다.");
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>비밀번호 재설정</Text>
        </View>

        <Text style={styles.description}>
          새로운 비밀번호를 입력하고 확인해주세요.
        </Text>

        <Text style={styles.label}>새 비밀번호</Text>
        <TextInput
          placeholder="********"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={pw}
          onChangeText={setPw}
        />

        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          placeholder="********"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={confirmPw}
          onChangeText={setConfirmPw}
        />

        <TouchableOpacity
          style={[styles.resetButton, (!pw || !confirmPw) && styles.disabled]}
          onPress={handleReset}
          disabled={!pw || !confirmPw}
        >
          <Text style={styles.resetButtonText}>비밀번호 재설정</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  backText: {
    fontSize: 20,
    color: "#232222",
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#232222",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#232222",
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  resetButton: {
    backgroundColor: "#3182F6",
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabled: {
    backgroundColor: "#AFCBFA",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
