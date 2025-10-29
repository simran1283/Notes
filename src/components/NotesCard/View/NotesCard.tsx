import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { vs } from "react-native-size-matters"
import useNotesCard from "../ViewModel/NotesCardViewModel";
import { NotesCardProps } from "../Model/NotesCardProps";
import { FC } from "react";
import Ionicons from "react-native-vector-icons/Ionicons"

const NotesCard: FC<NotesCardProps> = ({ item, setReload }) => {

    const { deleteNote, onPressEdit } = useNotesCard(setReload)

    const formattedDate = new Date(item.lastUpdated).toLocaleString();

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{item.note}</Text>
                </View>
                <View style={styles.innerContainer}>
                <View>
                    <Text style = {styles.date}>{formattedDate}</Text>
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
    outerContainer : {
        flex : 1
    },
    container: {
        height: "auto",
        width: vs(275),
        marginVertical: vs(6),
        borderRadius: vs(10),
        backgroundColor: "#ffffff",
        elevation: 1,
        shadowOffset: { width: vs(10), height: vs(10) },
        shadowOpacity: .5,
        padding: vs(6)
    },
    titleContainer: {
        width: "100%",
        marginBottom : vs(10)
    },
    title : {
        fontSize : vs(12),
        fontWeight :"400"
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
    innerContainer : {
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between"
    },
    date : {
        fontWeight : "200"
    }
})