import { StyleSheet, View } from "react-native"
import { AppSafeViewProps } from "../Model/AppSafeView"
import { FC } from "react"
import { SafeAreaView } from "react-native-safe-area-context"


const AppSafeView: FC<AppSafeViewProps> = ({ children, style }) => {
    return (
        <SafeAreaView style={styles.safeView}>
            <View style={[styles.container, style]}>
                {children}
            </View>
        </SafeAreaView>
    )
}

export default AppSafeView

const styles = StyleSheet.create({
    safeView: {
        flex: 1
    },
    container: {
        flex: 1
    }
})