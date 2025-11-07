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

interface MainAppStackNavigationParamsList {
    Home: undefined,
    SignIn: undefined,
    SignUp: undefined,
    NewNote: undefined
}


const MainAppStackNavigation = () => {

    const Stack = createStackNavigator()

    const [isLoggedIn, setIsLoggedIn] = useState<String | null | boolean>(null)

    const getUser = async () => {
        try {
            const user = await AsyncStorage.getItem('user')
        if (user) {
            setIsLoggedIn(!!user)
        }else{
            setIsLoggedIn(false)
        }
        }catch(error){
            showMessage({
                type : "danger",
                message : "Error"
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
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }} initialRouteName={isLoggedIn ? "Home" : "SignIn"}>
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="NewNote" component={NewNote} />
                <Stack.Screen name="EditNote" component={EditNote} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainAppStackNavigation