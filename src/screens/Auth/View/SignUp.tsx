import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native"
import AppTextInput from "../../../components/AppTextInput/View/AppTextInput"
import AppButton from "../../../components/AppButton/View/AppButton"
import { vs } from "react-native-size-matters"
import useSignUp from "../ViewModel/SignUpViewModel"
import Ionicons from 'react-native-vector-icons/Ionicons'

const SignUp = () => {

    const { userName, email, password, setUserName, setEmail, setPassword, navigation, onSignUpPress, isSigningUp } = useSignUp()

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#df5d88ff" />
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: vs(20) }}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>SIGN UP</Text>
                    <Text style={styles.subTitle}>Create an account to start doing more</Text>
                </View>
                <AppTextInput title="UserName" value={userName} keyboardType="default" onChangeText={setUserName} />
                <AppTextInput title="Email" value={email} keyboardType="default" onChangeText={setEmail} />
                <AppTextInput title="Password" value={password} keyboardType="default" secureTextEntry onChangeText={setPassword} />
            </View>
            <View style={{ marginTop: vs(30) }}>
                <AppButton title={isSigningUp ? <ActivityIndicator color="#ffffff" /> : "Sign Up"}
                    onPress={onSignUpPress}
                    style={{ width: "80%", marginBottom: vs(20) }}
                    disabled={isSigningUp ? true : false} />
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
    },
    title: {
        color: "#df5d88ff",
        fontSize: vs(16),
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: vs(6)
    },
    subTitle: {
        fontSize: vs(12),
        fontWeight: "500",
        textAlign: "center",
        color: "grey"
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: vs(40)
    }
})