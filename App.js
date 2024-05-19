import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Ionicons from "react-native-vector-icons/Ionicons";
import Loading from "./src/screens/Loading";
import Login from "./src/screens/Login";
import Start from "./src/screens/Start";
import Register from "./src/screens/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NavigationFrame from "./src/screens/NavigationFrame";
import Profile from "./src/screens/Profile";
import { Color } from "./GlobalStyles";
import Dashboard from "./src/screens/Dashboard";
import TypesOfDanger from "./src/screens/TypesOfDanger";

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

  const [fontsLoaded, error] = useFonts({
    "Acme-Regular": require("./assets/fonts/Acme-Regular.ttf"),
    "Almarai-Bold": require("./assets/fonts/Almarai-Bold.ttf"),
    "Almarai-ExtraBold": require("./assets/fonts/Almarai-ExtraBold.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "BalooThambi2-Regular": require("./assets/fonts/BalooThambi2-Regular.ttf"),
    "BalooThambi2-Medium": require("./assets/fonts/BalooThambi2-Medium.ttf"),
    "BalooThambi2-ExtraBold": require("./assets/fonts/BalooThambi2-ExtraBold.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  function AuthStackScreen() {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Loading" component={Loading} />
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="Start" component={Start} />
        <AuthStack.Screen name="Register" component={Register} />
        <AuthStack.Screen name="Danger" component={TypesOfDanger} />
      </AuthStack.Navigator>
    );
  }

  function MainTabScreen() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "NavigationFrame") {
              iconName = focused ? "location" : "location-outline";
            } else if (route.name === "Dashboard") {
              iconName = focused ? "stats-chart" : "stats-chart-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Color.colorMediumaquamarine,
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontFamily: "BalooThambi2-Regular", // Set the font family for the tab labels
            fontSize: 12, // Adjust the font size if needed
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ tabBarLabel: "Dashboard" }}
        />
        <Tab.Screen
          name="NavigationFrame"
          component={NavigationFrame}
          options={{ tabBarLabel: "Location" }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ tabBarLabel: "Profile" }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {hideSplashScreen ? (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
          <MainStack.Screen name="Auth" component={AuthStackScreen} />
          <MainStack.Screen name="Main" component={MainTabScreen} />
        </MainStack.Navigator>
      ) : null}
    </NavigationContainer>
  );
};

export default App;
