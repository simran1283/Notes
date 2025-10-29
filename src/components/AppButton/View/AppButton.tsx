import { FC } from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { vs } from "react-native-size-matters"
import { AppButtonProps } from "../Model/AppButtonProps"


const AppButton: FC<AppButtonProps> = ({ title, style, onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.appButton, style, disabled ? styles.disabledButton : {}]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={[styles.title, disabled ? styles.disabledText : {}]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default AppButton

const styles = StyleSheet.create({
    appButton: {
        width: "100%",
        height: vs(30),
        backgroundColor: "#df5d88ff",
        color: "white",
        borderRadius: vs(10),
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: vs(10)
    },
    title: {
        fontSize: vs(14),
        fontWeight: "bold",
        color: "white"
    },
    disabledButton: {
        backgroundColor: "#e5a9bb",
        opacity: 0.6,
    },
    disabledText: {
        color: "#f8f8f8",
    }
})