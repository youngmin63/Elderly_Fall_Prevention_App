import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets(); // ✅ safe area 적용

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || 8 }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const label =
          descriptors[route.key].options.tabBarLabel ??
          descriptors[route.key].options.title ??
          route.name;

        const iconMap = {
          Balance: "activity",
          Analyze: "bar-chart-2",
          Community: "users",
          Profile: "user",
        };

        const iconName = iconMap[route.name] || "circle"; // ✅ 이 부분이 핵심

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.tabItem}
          >
            <Feather
              name={iconName}
              size={22}
              color={isFocused ? "#3182F6" : "#999"}
            />
            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 8,
  },
  tabItem: {
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  labelFocused: {
    color: "#3182F6",
    fontWeight: "bold",
  },
});
