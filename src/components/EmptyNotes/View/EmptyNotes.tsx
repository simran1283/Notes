import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { vs } from "react-native-size-matters"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"

const EmptyNotes = () => {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <View style={{ alignSelf: "flex-end", margin: vs(10) }}>
                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.removeItem("user")
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "SignIn" }],
                    });
                }}>

                    <MaterialIcons name="logout" size={24} color="#df5d88ff" />
                </TouchableOpacity>
            </View>
            <View>
                <Ionicons name="document-text-outline" size={120} color="#a3a3a3ff" />
                <Text>No Notes Yet!</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("NewNote")}>
                <Ionicons name="add" color="#ffffff" size={24} />
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