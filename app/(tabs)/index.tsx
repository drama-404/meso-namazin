import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#10b981", "#0d9488"]} // emerald-500 to teal-600
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center px-8">
        {/* Decorative geometric pattern overlay */}
        <View className="absolute inset-0 opacity-5">
          <View className="absolute top-20 left-10 w-32 h-32 border-2 border-white rotate-45" />
          <View className="absolute bottom-32 right-16 w-24 h-24 border-2 border-white rotate-45" />
          <View className="absolute top-1/2 left-1/4 w-16 h-16 border border-white rotate-45" />
        </View>

        {/* Main content */}
        <View className="items-center space-y-4">
          {/* Title with refined spacing */}
          <Text className="text-white text-5xl font-light tracking-wider text-center">
            Kohët e
          </Text>
          <Text className="text-white text-6xl font-bold tracking-wide text-center -mt-2">
            Namazit
          </Text>

          {/* Decorative divider */}
          <View className="flex-row items-center gap-3 mt-8">
            <View className="w-8 h-px bg-white/40" />
            <View className="w-2 h-2 rounded-full bg-white/60" />
            <View className="w-8 h-px bg-white/40" />
          </View>

          {/* Subtle subtitle */}
          <Text className="text-white/70 text-base font-light tracking-widest uppercase mt-4">
            Prayer Times
          </Text>
        </View>

        {/* Bottom decorative element */}
        <View className="absolute bottom-12 self-center">
          <View className="w-1 h-16 bg-white/20" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
