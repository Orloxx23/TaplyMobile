import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Button } from "@ui-kitten/components";
import theme from "./theme.json";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import PreGameScreen from "./src/screens/PreGameScreen";
import { MainProvider } from "./src/context/MainContext";
import SetupScreen from "./src/screens/SetupScreen";
import { IconRegistry } from "@ui-kitten/components/ui";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import InGameScreen from "./src/screens/InGameScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
          <MainProvider>
            <Stack.Navigator>
              <Stack.Screen name="Setup" options={{ headerShown: false }}>
                {(props) => <SetupScreen {...props} />}
              </Stack.Screen>

              <Stack.Screen name="Home" options={{ headerShown: false }}>
                {(props) => <HomeScreen {...props} />}
              </Stack.Screen>

              <Stack.Screen name="PreGame" options={{ headerShown: false }}>
                {(props) => <PreGameScreen {...props} />}
              </Stack.Screen>

              <Stack.Screen name="InGame" options={{ headerShown: false }}>
                {(props) => <InGameScreen {...props} />}
              </Stack.Screen>
            </Stack.Navigator>
          </MainProvider>
        </ApplicationProvider>
      </NavigationContainer>
    </>
  );
}
