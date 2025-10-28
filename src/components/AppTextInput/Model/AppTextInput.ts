import { StyleProp, ViewStyle } from "react-native";


export interface AppTextInputProps {
    title? : string,
    value : string,
    onChangeText : (text : string) => void,
    secureTextEntry? : boolean,
    keyboardType : "default" | "numeric" | "email-address",
    style? : StyleProp<ViewStyle>
}