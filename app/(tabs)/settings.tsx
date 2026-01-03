import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen() {
  return (
    <LinearGradient
      colors={["#374151", "#111827"]} // gray-700 to gray-900
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center px-8">
        {/* Grid pattern overlay */}
        <View className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, row) => (
            <View key={row} className="flex-row justify-around" style={{ marginTop: row * 120 }}>
              {[...Array(4)].map((_, col) => (
                <View key={col} className="w-16 h-16 border border-white/30" />
              ))}
            </View>
          ))}
        </View>

        {/* Main content */}
        <View className="items-center z-10">
          {/* Settings icon representation */}
          <View className="mb-10 relative">
            <View className="w-24 h-24 rounded-full border-4 border-white/70 items-center justify-center">
              <View className="w-12 h-12 rounded-full bg-white/20" />
            </View>
            {/* Gear teeth suggestion */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <View
                key={deg}
                className="absolute w-4 h-8 bg-white/70"
                style={{
                  transform: [
                    { translateX: 50 },
                    { translateY: 50 },
                    { rotate: `${deg}deg` },
                    { translateY: -50 },
                  ],
                }}
              />
            ))}
          </View>

          <Text className="text-white text-5xl font-light tracking-wider text-center mb-3">
            Cilësimet
          </Text>

          {/* Decorative divider with modern touch */}
          <View className="flex-row items-center gap-4 my-8">
            <View className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <View className="flex-row gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <View className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <View className="w-1.5 h-1.5 rounded-full bg-white/60" />
            </View>
            <View className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </View>

          <Text className="text-white/70 text-sm font-light tracking-[0.4em] uppercase">
            Settings
          </Text>
        </View>

        {/* Bottom accent bars */}
        <View className="absolute bottom-16 self-center flex-row gap-2">
          <View className="w-12 h-1 bg-white/20 rounded-full" />
          <View className="w-8 h-1 bg-white/30 rounded-full" />
          <View className="w-12 h-1 bg-white/20 rounded-full" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
