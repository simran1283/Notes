import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface AppSafeViewProps {
    children : ReactNode,
    style? : StyleProp<ViewStyle>
}