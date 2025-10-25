import { Alert, StyleSheet, View } from "react-native"
import AppTextInput from "../../../components/AppTextInput/View/AppTextInput"
import AppButton from "../../../components/AppButton/View/AppButton"
import { vs } from "react-native-size-matters"
import useSignUp from "../ViewModel/SignUpViewModel"

const SignUp = () => {

    const { userName, email, password, setUserName, setEmail, setPassword, navigation, onSignUpPress } = useSignUp()

    return (
        <View style={styles.container}>
            <View style={{ marginTop: vs(20) }}>
                <AppTextInput title="UserName" value={userName} keyboardType="default" onChangeText={setUserName} />
                <AppTextInput title="Email" value={email} keyboardType="default" onChangeText={setEmail} />
                <AppTextInput title="Password" value={password} keyboardType="default" secureTextEntry onChangeText={setPassword} />
            </View>
            <View style={{ marginTop: vs(50) }}>
                <AppButton title="Sign Up" onPress={onSignUpPress} style={{ width: "80%" }} />
                <AppButton title="Go To Login" onPress={() => navigation.navigate("SignIn")} style={{ width: "80%" }} />
            </View>
        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: vs(10),
        padding: vs(5)
    }
})