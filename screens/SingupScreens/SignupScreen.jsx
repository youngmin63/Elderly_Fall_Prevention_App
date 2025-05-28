import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../../api/api"; // baseURL 포함 axios 인스턴스

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("비밀번호 오류", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await apiClient.post("/api/auth/signup", {
        username,
        password,
        email,
        gender: "male",
        phoneNumber: phone,
        age: 0,
        fitnessLevel: "none",
        height: 0,

        nickname: "",
        weight: 0,
      });

      Alert.alert("회원가입 성공", "로그인 화면으로 이동합니다.");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "회원가입 실패",
        error.response?.data?.message || "서버 오류가 발생했습니다."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>계정 생성</Text>
        </View>

        <Text style={styles.title}>
          회원가입하고{"\n"}나만의 운동을 시작하세요
        </Text>

        <TextInput
          placeholder="이메일"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="유저 이름(아이디)"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="핸드폰 번호"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />
        <TextInput
          placeholder="비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TextInput
          placeholder="비밀번호 확인"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>가입하기</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.grayText}>이미 계정이 있으신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>로그인하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F3F6" },
  scrollContainer: { paddingHorizontal: 24, paddingVertical: 40 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    color: "#666",
    paddingRight: 12,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#232222",
    marginVertical: 30,
    lineHeight: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  signupButton: {
    backgroundColor: "#3182F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  grayText: {
    color: "#888",
    fontSize: 13,
  },
  linkText: {
    color: "#3182F6",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 6,
  },
});
