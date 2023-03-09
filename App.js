import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Button } from "@ui-kitten/components";
import theme from "./theme.json";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import PreGameScreen from "./src/screens/PreGameScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
          <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => <HomeScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="PreGame" options={{ headerShown: false }}>
              {(props) => <PreGameScreen {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
        </ApplicationProvider>
      </NavigationContainer>
    </>
  );
}
