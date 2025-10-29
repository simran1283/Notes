import { StyleProp, ViewStyle } from "react-native";

export interface AppButtonProps {
    title : string,
    style? : StyleProp<ViewStyle>,
    onPress : () => void,
    disabled? : boolean
}