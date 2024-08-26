import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Workouts",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="StatsScreen"
        options={{
          title: "Stats",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="signal" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="DailySnapshot"
        options={{
          title: "Daily",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="terminal" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-secret" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="GymSearchScreen"
        options={{
          href: null, // Allows file to remain in (tabs) and be a route but not appear in the Tab Bar
        }}
      />
    </Tabs>
  );
}
