import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert } from "react-native";
import { showMessage } from "react-native-flash-message";
import auth from "@react-native-firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage";

const useSignIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const navigation = useNavigation()

    const onLoginPress = async () => {

        if (isLoggingIn) return

        try {
            setIsLoggingIn(true)
            const userCredential = await auth().signInWithEmailAndPassword(email, password)
            if (userCredential.user) {
                AsyncStorage.setItem('user', JSON.stringify(userCredential.user))
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                });
            } else {
                Alert.alert("Failed to Login")
            }

        } catch (err: any) {

            let errorMessage = ""

            //error handling
            if (err.code === "auth/invalid-credential") {
                errorMessage = "Invalid email or Password"
            } else if (err.code === "auth/user-not-found") {
                errorMessage = "User Not Found"
            } else {
                errorMessage = "An error occurred during sign-in"
            }

            //flash message
            showMessage({
                type: "danger",
                message: errorMessage
            })
        }
        finally {
            setIsLoggingIn(false)
        }
    };


    return {
        email,
        password,
        setEmail,
        setPassword,
        navigation,
        onLoginPress,
        isLoggingIn
    }
}

export default useSignIn