import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../../api/api";
import BackButton from "../BackButton";

export default function SetupScreen7({ navigation, route }) {
  const [nickname, setNickname] = useState("");

  const { gender, age, weight, height, fitnessLevel } = route.params;

  const handleComplete = async () => {
    if (!nickname) return;

    try {
      console.log("🔍 nickname payload", {
        nickname,
        gender,
        age,
        weight,
        height,
        fitnessLevel,
      });

      const res = await apiClient.post("/api/user/profile/me", {
        nickname,

        gender,
        age,
        weight,
        height,
        fitnessLevel,
      });

      if (res.status === 200) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        Alert.alert("실패", "서버 응답 오류가 발생했습니다.");
      }
    } catch (error) {
      Alert.alert(
        "오류",
        error.response?.data?.message || "프로필 등록에 실패했습니다."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>사용할 이름을 입력해주세요</Text>

        <TextInput
          style={styles.input}
          placeholder="예: 영민"
          placeholderTextColor="#aaa"
          value={nickname}
          onChangeText={setNickname}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, !nickname && styles.disabledButton]}
            onPress={handleComplete}
            disabled={!nickname}
          >
            <Text style={styles.nextButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#232222",
    lineHeight: 32,
    marginBottom: 30,
    textAlign: "center", // Center align the title
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonContainer: {
    marginTop: 40,
  },
  nextButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#AFCBFA",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
