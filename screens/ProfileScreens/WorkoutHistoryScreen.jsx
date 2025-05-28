import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { apiClient } from "../../api/api";
import BackButton from "../BackButton";

export default function WorkoutHistoryScreen() {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchWorkoutDates = async () => {
      try {
        const res = await apiClient.get("/api/workout/records/all");
        const data = res.data || [];
        setWorkouts(data);

        // 🔥 운동한 날짜 표시
        const marks = {};
        data.forEach((w) => {
          marks[w.date] = {
            marked: true,
            dotColor: "#FF6B00",
            customStyles: {
              container: {
                backgroundColor: "#FFE9D7",
                borderRadius: 8,
              },
              text: {
                color: "black",
              },
            },
          };
        });
        setMarkedDates(marks);
      } catch (err) {
        console.error("📛 운동 기록 불러오기 실패", err);
      }
    };
    fetchWorkoutDates();
  }, []);

  const workoutsOnSelectedDate = workouts.filter(
    (w) => w.date === selectedDate
  );

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>내 운동 기록</Text>

      <Calendar
        style={styles.calendar}
        markingType={"custom"}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          backgroundColor: "#F2F3F6",
          calendarBackground: "#F2F3F6",
          todayTextColor: "#3182F6",
          arrowColor: "#3182F6",
          textSectionTitleColor: "#9CA3AF",
        }}
      />

      {selectedDate && (
        <View style={styles.recordList}>
          <Text style={styles.subTitle}>{selectedDate} 운동 기록</Text>
          {workoutsOnSelectedDate.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.exerciseName}>{item.exerciseName}</Text>
              <Text style={styles.detail}>
                {item.completedSets}세트 / {Math.round(item.duration / 60)}분
              </Text>
              <Text style={styles.feedback}>{item.feedback}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F6",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 60,
  },
  calendar: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recordList: {
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
  },
  detail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  feedback: {
    marginTop: 4,
    fontSize: 13,
    color: "#999",
  },
});
