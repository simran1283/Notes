import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { vs } from "react-native-size-matters"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import useEmptyNotes from "../ViewModel/EmptyNotesViewModel"

const EmptyNotes = () => {

    const { onPressLogout, onPressAdd } = useEmptyNotes()
    const LOGOUT_ICON_COLOR = "#df5d88ff"
    const EMPTYNOTE_ICON_COLOR = "#a3a3a3ff"
    const ADD_ICON_COLOR = "#ffffff"

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <TouchableOpacity onPress={onPressLogout}>

                    <MaterialIcons name="logout" size={24} color={LOGOUT_ICON_COLOR} />
                </TouchableOpacity>
            </View>
            <View>
                <Ionicons name="document-text-outline" size={120} color={EMPTYNOTE_ICON_COLOR} />
                <Text>No Notes Yet!</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={onPressAdd}>
                <Ionicons name="add" color={ADD_ICON_COLOR} size={24} />
            </TouchableOpacity>
        </View>
    )
}

export default EmptyNotes

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    innerContainer: {
        alignSelf: "flex-end",
        margin: vs(10)
    },
    button: {
        backgroundColor: "#df5d88ff",
        padding: vs(5),
        borderRadius: vs(5),
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
        marginHorizontal: vs(20),
        marginVertical: vs(10)
    }
})