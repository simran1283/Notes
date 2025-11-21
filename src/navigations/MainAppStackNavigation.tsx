import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import SignIn from "../screens/Auth/View/SignIn"
import SignUp from "../screens/Auth/View/SignUp"
import Home from "../screens/Home/View/Home"
import NewNote from "../screens/NewNote/View/NewNote"
import EditNote from "../screens/EditNote/View/EditNote"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { showMessage } from "react-native-flash-message"
import Calendar from "../components/Calendar/View/Calendar"
import { navigationRef } from "./navigationRef"
import { RootStackParamList } from "../types/NavigationType"



const MainAppStackNavigation = () => {

    const Stack = createStackNavigator<RootStackParamList>()

    const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null)

    const getUser = async () => {
        try {
            const user = await AsyncStorage.getItem('user')
            if (user) {
                setIsLoggedIn(!!user)
            } else {
                setIsLoggedIn(false)
            }
        } catch (error) {
            showMessage({
                type: "danger",
                message: "Error"
            })
        }

    }

    useEffect(() => {
        getUser()
    }, [])

    if (isLoggedIn === null) {
        // Wait until AsyncStorage has been checked
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    return (
        <NavigationContainer ref={navigationRef}
            onReady={() => {
                if (globalThis.PENDING_NAVIGATION) {
                    navigationRef.current?.navigate("Home", {
                        id: globalThis.PENDING_NAVIGATION,
                    });
                    globalThis.PENDING_NAVIGATION = null;
                }
            }}>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }} initialRouteName={isLoggedIn ? "Home" : "SignIn"}>
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="NewNote" component={NewNote} />
                <Stack.Screen name="EditNote" component={EditNote} />
            </Stack.Navigator>
            <Calendar />
        </NavigationContainer>
    )
}

export default MainAppStackNavigation