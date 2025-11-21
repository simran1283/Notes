import { Text, StyleSheet, View, ActivityIndicator } from "react-native"
import AppTextInput from "../../../components/AppTextInput/View/AppTextInput"
import AppButton from "../../../components/AppButton/View/AppButton"
import { vs } from "react-native-size-matters"
import useSignIn from "../ViewModel/SignInViewModel"


const SignIn = () => {

    const { email, password, setEmail, setPassword, navigation, onLoginPress, isLoggingIn } = useSignIn()

    return (
        <View style={styles.container}>

            <View style={{ marginTop: vs(20) }}>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>LOG IN</Text>
                    <Text style={styles.subTitle}>Let's get to Work</Text>
                </View>

                <AppTextInput title="Email" value={email} keyboardType="default" onChangeText={setEmail} multiline={false}/>
                <AppTextInput title="Password" value={password} keyboardType="default" onChangeText={setPassword} secureTextEntry={true} multiline={false}/>

            </View>

            <View style={{ marginTop: vs(50) }}>

                <AppButton title={isLoggingIn ? <ActivityIndicator color="#ffffff" /> : "Login"}
                    onPress={onLoginPress}
                    style={{ width: "80%", marginBottom: vs(20) }}
                    disabled={isLoggingIn ? true : false} />

                <AppButton title="Create Account" onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "SignUp" }],
                    });
                }} style={{ width: "80%" }} />
                
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