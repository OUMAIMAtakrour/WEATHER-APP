import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import "../../global.css";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StatusBar } from "expo-status-bar";
import { debounce } from "lodash";
import * as Progress from "react-native-progress";
// import { TextInput } from "react-native-gesture-handler";
import {
  MapIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from "react-native-heroicons/solid";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useCallback, useState, useEffect } from "react";
import { fetchLocations, fetchWeatherForecast } from "@/api/weather";
import { weatherImages } from "@/constants/weatherFeatures";
import { storeData } from "@/utils/asyncStorage";
export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const handleLocation = (loc) => {
    console.log("location:", loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: 7,
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData('city',loc.name);
      console.log("git forecast:", data);
    });
  };
  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
    //console.log("value", value);//
  };
  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  const fetchMyWeatherData = async () => {
      let myCity=await getData('city')
      let cityName='Rabat';
      if (myCity)cityName=myCity;
    fetchWeatherForecast({
      cityName,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar style="light"></StatusBar>
      <Image
        blurRadius={70}
        source={require("../../assets/images/bg.png")}
        className="absolute h-full  w-full "
      ></Image>
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          <View style={{ height: "7%" }} className="mx-4 relative z-50">
            <View
              className="flex-row mt-12 justify-end items-center rounded-full"
              style={{
                backgroundColor: showSearch
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
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
            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 mt-14 top-16 rounded-3xl">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      className={
                        "flex-row items-center border-0 p-3 px-4 mb-1 " +
                        borderClass
                      }
                    >
                      <MapPinIcon size={20} color={"gray"}></MapPinIcon>
                      <Text className="text-black text-lg ml-2">
                        {loc?.name},{loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          <View className="mx-4 flex justify-around flex-1 mb-2 mt-6">
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name},
              <Text className="text-lg font-semibold text-gray-300">
                {"" + location?.country}
              </Text>
            </Text>
            <View className="flex-row justify-center">
              <Image
                className="w-52 h-52 mt-6"
                source={weatherImages[current?.condition?.text]}
                //source={require("../../assets/images/partlycloudy.png")}//
              ></Image>
            </View>
            <View className="space-y-2">
              <Text className="text-center font-bold text-white text-6xl ml-5">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-center text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between mx-10 mb-8">
            <View className="flex-row gap-3 items-center">
              <Image
                source={require("../../assets/icons/wind.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-base">
                {current?.wind_kph}
              </Text>
            </View>
            <View className="flex-row gap-3 items-center">
              <Image
                source={require("../../assets/icons/drop.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-base">
                {current?.humidity}%
              </Text>
            </View>
            <View className="flex-row gap-3 items-center">
              <Image
                source={require("../../assets/icons/sun.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-base">
                6:05 AM
              </Text>
            </View>
          </View>
          <View className="mb-4 space-y-3">
            <View className="flex-row items-center mx-5 gap-2 mb-3">
              <CalendarDaysIcon size="22" color="white" />
              <Text className="text-white text-base">Daily forecast </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-US", options);
                return (
                  <View
                    key={index}
                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <Image
                      className="h-11 w-11"
                      source={weatherImages[item?.day?.condition?.text]}
                    />
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-white text-xl font-semibold">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
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
