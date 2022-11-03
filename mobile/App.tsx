import { NativeBaseProvider, StatusBar } from "native-base"
import { Loading } from "./src/components/Loading"
import { THEME } from "./src/styles/theme"
import React from "react";
import { Pools } from "./src/screens/Pools"
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto"
import { AuthContextProvider } from "./src/context/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  })

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {fontsLoaded ? <Pools /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  )
}