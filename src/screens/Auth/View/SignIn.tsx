import { Alert, StyleSheet, View } from "react-native"
import AppTextInput from "../../../components/AppTextInput/View/AppTextInput"
import AppButton from "../../../components/AppButton/View/AppButton"
import { useNavigation } from "@react-navigation/native"
import { vs } from "react-native-size-matters"
import auth from "@react-native-firebase/auth"
import { showMessage } from "react-native-flash-message"
import { useState } from "react"
import useSignIn from "../ViewModel/SignInViewModel"


const SignIn = () => {

    const { email, password, setEmail, setPassword, navigation, onLoginPress } = useSignIn()

    return (
        <View style={styles.container}>
            <View style={{ marginTop: vs(20) }}>
                <AppTextInput title="Email" value={email} keyboardType="default" onChangeText={setEmail}/>
                <AppTextInput title="Password" value={password} keyboardType="default" secureTextEntry onChangeText={setPassword} />
            </View>
            <View style={{ marginTop: vs(50) }}>
                <AppButton title="Login" onPress={onLoginPress} style={{ width: "80%" }} />
                <AppButton title="Create Account" onPress={() => navigation.navigate("SignUp")} style={{ width: "80%" }} />
            </View>
        </View>
    )
}


export default SignIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: vs(10),
        padding: vs(5)
    }
})