import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function QiblaScreen() {
  return (
    <LinearGradient
      colors={["#3b82f6", "#06b6d4"]} // blue-500 to cyan-500
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center px-8">
        {/* Compass-inspired circular pattern */}
        <View className="absolute inset-0 justify-center items-center opacity-10">
          <View className="w-80 h-80 rounded-full border-2 border-white" />
          <View className="w-64 h-64 rounded-full border border-white absolute" />
          <View className="w-48 h-48 rounded-full border border-white/50 absolute" />

          {/* Cardinal direction markers */}
          <View className="absolute top-1/4 w-px h-8 bg-white" />
          <View className="absolute bottom-1/4 w-px h-8 bg-white" />
          <View className="absolute left-1/4 h-px w-8 bg-white" />
          <View className="absolute right-1/4 h-px w-8 bg-white" />
        </View>

        {/* Main content */}
        <View className="items-center z-10">
          {/* Icon placeholder - geometric star */}
          <View className="mb-8">
            <View className="w-20 h-20 rotate-0">
              <View className="absolute inset-0 rotate-0 border-4 border-white/80" style={{ borderRadius: 10 }} />
              <View className="absolute inset-0 rotate-45 border-4 border-white/60" style={{ borderRadius: 10 }} />
            </View>
          </View>

          <Text className="text-white text-6xl font-bold tracking-wider text-center mb-2">
            Kibla
          </Text>

          {/* Decorative divider */}
          <View className="flex-row items-center gap-2 my-6">
            <View className="w-12 h-px bg-white/50" />
            <View className="w-3 h-3 rotate-45 border-2 border-white/70" />
            <View className="w-12 h-px bg-white/50" />
          </View>

          <Text className="text-white/80 text-sm font-light tracking-[0.3em] uppercase">
            Qibla Direction
          </Text>
        </View>

        {/* Degree marker visual */}
        <View className="absolute bottom-20 flex-row items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              className="w-1 bg-white/30"
              style={{ height: i === 2 ? 20 : 12 }}
            />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
