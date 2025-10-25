import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import SignIn from "../screens/Auth/View/SignIn"
import SignUp from "../screens/Auth/View/SignUp"
import Home from "../screens/Home/View/Home"
import NewNote from "../screens/NewNote/View/NewNote"


const MainAppStackNavigation = () => {

    const Stack = createStackNavigator()

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown : false
            }}>
                <Stack.Screen name="SignIn" component={SignIn}/>
                <Stack.Screen name="SignUp" component={SignUp}/>
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="NewNote" component={NewNote}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainAppStackNavigation