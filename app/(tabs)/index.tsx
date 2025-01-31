import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import "../../global.css";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StatusBar } from "expo-status-bar";
// import { TextInput } from "react-native-gesture-handler";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useState } from "react";
export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  return (
    <View className="flex-1 relative">
      <StatusBar style="light"></StatusBar>
      <Image
        blurRadius={80}
        source={require("../../assets/images/bg.png")}
        className="absolute h-full  w-full "
      ></Image>
      <SafeAreaView className="flex flex-1">
        <View style={{ height: "7%" }} className="mx-4 relative z-50">
          <View
            className="flex-row mt-8 justify-end items-center rounded-full"
            style={{
              backgroundColor: showSearch
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            {showSearch ? (
              <TextInput
                placeholder="Search city"
                placeholderTextColor={"lightgray"}
                className="pl-6 h-10 flex-1 text-base text-white"
              ></TextInput>
            ) : null}

            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              className="rounded-full p-3 m-1"
            >
              <MagnifyingGlassIcon size={"25"} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
