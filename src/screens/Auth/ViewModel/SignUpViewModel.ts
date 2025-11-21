import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/NavigationType";

const useSignUp = () => {

    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false)

    const navigation = useNavigation<StackNavigationProp<RootStackParamList,"SignUp">>()

    const onSignUpPress = async () => {

        if (isSigningUp) return

        try {
            setIsSigningUp(true)
            const userCredential = await auth().createUserWithEmailAndPassword(email, password)
            if (userCredential.user) {
                const { user } = userCredential;

                await firestore().collection("users").doc(user.uid).set({
                    userName,
                    email
                });

                showMessage({
                    type: "success",
                    message: "Account created successfully!",
                });
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                });
            }
            else {
                console.log("Failed to create Account")
            }

        } catch (err: any) {

            let errorMessage = ""

            if (err.code === "auth/invalid-credential") {
                errorMessage = "Invalid email or Password"
            } else if (err.code === "auth/user-not-found") {
                errorMessage = "User Not Found"
            } else {
                errorMessage = "An error occurred during sign-in"
                console.log(err)
            }

            //flash message
            showMessage({
                type: "danger",
                message: errorMessage
            })
        }
        finally {
            setIsSigningUp(false)
        }

    }

    return {
        userName,
        email,
        password,
        setUserName,
        setPassword,
        setEmail,
        navigation,
        onSignUpPress,
        isSigningUp
    }
}

export default useSignUp