import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

const useSignUp = () => {

    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation()

    const onSignUpPress = async () => {

        try {
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
                navigation.navigate("SignIn")
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

    }

    return {
        userName,
        email,
        password,
        setUserName,
        setPassword,
        setEmail,
        navigation,
        onSignUpPress
    }
}

export default useSignUp