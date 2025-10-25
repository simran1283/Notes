import { FC } from "react"
import { StyleSheet, TextInput } from "react-native"
import { vs } from "react-native-size-matters"
import { AppTextInputProps } from "../Model/AppTextInput"


const AppTextInput : FC<AppTextInputProps> = ({title, value, onChangeText, style, secureTextEntry, keyboardType}) => {
    return (
        <TextInput placeholder={title} value={value} onChangeText={onChangeText} style={[styles.textInput, style]}  
        secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}/>
    )
}

export default AppTextInput

const styles = StyleSheet.create({
    textInput : {
        height : vs(40),
        width : "100%",
        borderRadius : vs(10),
        fontSize : vs(15),
        shadowOffset : {width : vs(20), height : vs(20)},
        elevation : .5,
        shadowOpacity : .5,
        backgroundColor : "#ffffff",
        padding : vs(10),
        marginBottom : vs(10),
    }
})