import { FC } from "react"
import { StyleSheet, TextInput } from "react-native"
import { vs } from "react-native-size-matters"
import { AppTextInputProps } from "../Model/AppTextInput"


const AppTextInput : FC<AppTextInputProps> = ({title, value, onChangeText, style, secureTextEntry, keyboardType, multiline}) => {
    return (
        <TextInput placeholder={title} placeholderTextColor={"#8e8c8cff"} value={value} onChangeText={onChangeText} style={[styles.textInput, style]}  
        secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            multiline = {multiline}/>
    )
}

export default AppTextInput

const styles = StyleSheet.create({
    textInput : {
        height : "auto",
        width : "100%",
        borderRadius : vs(10),
        fontSize : vs(12),
        shadowOffset : {width : vs(3), height : vs(3)},
        elevation : .5,
        shadowOpacity : .3,
        backgroundColor : "#ffffff",
        padding : vs(10),
        marginBottom : vs(10),
        color : "#000000"
    }
})