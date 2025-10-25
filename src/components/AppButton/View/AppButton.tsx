import { FC } from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { vs } from "react-native-size-matters"
import { AppButtonProps } from "../Model/AppButtonProps"


const AppButton : FC<AppButtonProps> = ({title, style, onPress}) => {
    return(
        <TouchableOpacity style={[styles.appButton, style]} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}

export default AppButton 

const styles = StyleSheet.create({
    appButton  : {
        width : "100%",
        height : vs(30),
        backgroundColor : "#9c36b1ff",
        color : "white",
        borderRadius : vs(10),
        alignItems : "center",
        justifyContent : "center",
        alignSelf : "center",
        marginBottom : vs(10)
    },
    title : {
        fontSize : vs(14),
        fontWeight : "bold",
        color : "white"
    }
})