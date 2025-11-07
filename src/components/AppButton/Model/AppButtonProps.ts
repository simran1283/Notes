import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface AppButtonProps {
    title : string | ReactNode,
    style? : StyleProp<ViewStyle>,
    onPress : () => void,
    disabled? : boolean
}