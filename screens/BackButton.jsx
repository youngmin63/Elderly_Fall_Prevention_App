// components/BackButton.jsx

import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BackButton({ color = "#232222", size = 24, style }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[{ paddingHorizontal: 2 },{marginTop:50}, style]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 터치 영역 확장
    >
      <Ionicons name="chevron-back" size={size} color={color} />
    </TouchableOpacity>
  );
}
