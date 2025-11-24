import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/NavigationType";
import { StackNavigationProp } from "@react-navigation/stack";



const useEmptyNotes = () => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    const onPressLogout = async () => {
        await AsyncStorage.removeItem("user")
        navigation.reset({
            index: 0,
            routes: [{ name: "SignIn" }],
        });
    }

    const onPressAdd = () => navigation.navigate("NewNote")


    return {
        onPressLogout,
        onPressAdd
    }
}

export default useEmptyNotes