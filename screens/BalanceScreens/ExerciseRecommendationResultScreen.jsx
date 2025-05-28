import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import BackButton from "../BackButton";

export default function ExerciseRecommendationResultScreen({ route, navigation }) {
  const { recommendations } = route.params;
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedExercise(null);
  };

  const getFocusIcon = (area) => {
    switch (area) {
      case "하체":
        return "🦵";
      case "코어":
        return "🧘";
      case "유연성":
        return "🤸";
      case "상체":
        return "💪";
      default:
        return "🏋️";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>🏋️‍♀️ 이번 주 추천 운동</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {recommendations.map((exercise, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => openModal(exercise)}
          >
            <Text style={styles.cardTitle}>{exercise.name}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {exercise.reason}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ✅ 운동 상세 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedExercise?.name || "운동 상세"}
              </Text>
              <Pressable onPress={closeModal}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            {selectedExercise?.focusArea && (
              <Text style={styles.focusArea}>
                {getFocusIcon(selectedExercise.focusArea)}{" "}
                {selectedExercise.focusArea}
              </Text>
            )}

            <Text style={styles.modalText}>{selectedExercise?.reason}</Text>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                closeModal();
                navigation.navigate("ExerciseDetail", {
                  exercise: selectedExercise,
                });
              }}
            >
              <Text style={styles.startButtonText}>운동 시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#232222",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3182F6",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#232222",
  },
  modalClose: {
    fontSize: 20,
    color: "#888",
    padding: 4,
  },
  focusArea: {
    fontSize: 15,
    color: "#3182F6",
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: "#3182F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
