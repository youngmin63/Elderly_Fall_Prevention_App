import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../BackButton";
import { apiClient } from "../../api/api"; // baseURL 포함 axios 인스턴스

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("입력 오류", "아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      // ✅ 로그인 요청 (POST /api/auth/login)
      const response = await apiClient.post("/api/auth/login", {
        username,
        password,
      });

      const data = response.data;
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("username", username);
      console.log("token", data.token);

      // ✅ 프로필 정보 요청 (GET /api/user/me)
      const profileRes = await apiClient.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${data.token}`, // 보안상 apiClient interceptor로 처리 가능하지만 여기선 직접 포함
        },
      });

      const profileData = profileRes.data;

// ✅ 여기에 추가
await AsyncStorage.setItem("email", profileData.email);
await AsyncStorage.setItem("phoneNumber", profileData.phoneNumber);

      if (profileData.isProfileSetupCompleted) {
        navigation.navigate("Main");
      } else {
        navigation.navigate("Setup1");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      if (error.response && error.response.status === 401) {
        Alert.alert("로그인 실패", "아이디 또는 비밀번호를 확인해주세요.");
      } else {
        Alert.alert("에러", "서버와 연결할 수 없습니다.");
      }
    }
  };

  return (
    
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.title}>로그인</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <View style={styles.linkRow}>
          <Text style={styles.linkText}>
            <Text onPress={() => navigation.navigate("ForgotPw")}>
              비밀번호 찾기
            </Text>
            <Text style={styles.dot}> · </Text>
            <Text onPress={() => navigation.navigate("Signup")}>회원가입</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#232222",
    marginBottom: 40,
  },
  form: {
    width: "85%",
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  loginButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",

    marginTop: 24,
  },
  linkText: {
    fontSize: 13,
    color: "#3182F6",
    fontWeight: "500",
  },
});
