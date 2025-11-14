import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { vs } from "react-native-size-matters"
import useNotesCard from "../ViewModel/NotesCardViewModel";
import { NotesCardProps } from "../Model/NotesCardProps";
import { FC } from "react";
import Ionicons from "react-native-vector-icons/Ionicons"

const NotesCard: FC<NotesCardProps> = ({ item, setReload }) => {

    const { deleteNote, onPressEdit } = useNotesCard(setReload)

    const formattedDate = new Date(item.lastUpdated).toLocaleString();

    console.log(item)

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <View style={styles.statusContainer}>
                    <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={3}>{item.note}</Text>
                </View>
                <View>
                    {item.sync == 0
                        ? <Ionicons name="cloud-offline-outline" size={24} color="grey" />
                        : <Ionicons name="cloud-done-outline" size={24} color="green" />}
                </View>
                </View>
                <View style={styles.innerContainer}>
                    <View>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => onPressEdit(item)}>
                            <Ionicons name="create-outline" size={18} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => deleteNote(item)}>
                            <Ionicons name="trash-outline" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default NotesCard

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        height: "auto",
        width: "100%",
        marginVertical: vs(6),
        borderRadius: vs(10),
        backgroundColor: "#ffffff",
        elevation: 1,
        shadowOffset: { width: vs(2), height: vs(2) },
        shadowOpacity: .5,
        padding: vs(6)
    },
    titleContainer: {
        width: "80%",
        marginBottom: vs(10)
    },
    title: {
        fontSize: vs(12),
        fontWeight: "400"
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: vs(10)
    },
    button: {
        backgroundColor: "#df5d88ff",
        padding: vs(5),
        borderRadius: vs(5),
        alignItems: "center",
        justifyContent: "center"
    },
    innerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    date: {
        fontWeight: "200"
    },
    statusContainer : {
        width : "100%",
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between"
    }
})