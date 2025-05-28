import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BackButton from "../BackButton"; // Assuming you have a BackButton component

export default function SetupScreen5({ navigation, route }) {
  const [height, setHeight] = useState("");
  const { gender, age, weight } = route.params;

  const handleNext = () => {
    if (height && !isNaN(height)) {
      navigation.navigate("Setup6", {
        gender,
        age,
        weight,
        height: Number(height),
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>키를 입력해주세요</Text>

        <TextInput
          style={styles.input}
          placeholder="예: 165"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          value={height}
          onChangeText={setHeight}
          maxLength={3}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, !height && styles.disabledButton]}
            onPress={handleNext}
            disabled={!height || isNaN(height)}
          >
            <Text style={styles.nextButtonText}>다음</Text>
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
