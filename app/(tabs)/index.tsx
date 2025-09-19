import HomeBackground from "@/components/home-background";
import SearchForm from "@/components/search-form";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      <HomeBackground />
      <View className="flex-1">
        <Image
          source={{
            uri: "https://via.placeholder.com/400x180.png?text=GoBusly",
          }}
          className="w-full h-44 mb-6"
          resizeMode="cover"
        />

        <SearchForm />
      </View>
    </SafeAreaView>
  );
}
