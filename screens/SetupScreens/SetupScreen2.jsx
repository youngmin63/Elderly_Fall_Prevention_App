import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import BackButton from "../BackButton"; // Assuming you have a BackButton component
export default function SetupScreen2({ navigation }) {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleNext = () => {
    if (selectedGender) {
      navigation.navigate("Setup3", { gender: selectedGender });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>성별을 선택해주세요</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, selectedGender === "남성" && styles.selectedOption]}
          onPress={() => setSelectedGender("남성")}
        >
          <Text
            style={[styles.optionText, selectedGender === "남성" && styles.selectedText]}
          >
            남성
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedGender === "여성" && styles.selectedOption]}
          onPress={() => setSelectedGender("여성")}
        >
          <Text
            style={[styles.optionText, selectedGender === "여성" && styles.selectedText]}
          >
            여성
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedGender && styles.disabledButton]}
          onPress={handleNext}
          disabled={!selectedGender}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#232222",
    lineHeight: 32,
    textAlign: "center",
    
  },
  optionsContainer: {
    marginTop: 40,
    gap: 16,
    
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedOption: {
    borderColor: "#3182F6",
    backgroundColor: "#EAF2FF",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  selectedText: {
    color: "#3182F6",
    fontWeight: "600",
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
