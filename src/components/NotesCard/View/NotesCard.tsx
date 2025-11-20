import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { vs } from "react-native-size-matters";
import useNotesCard from "../ViewModel/NotesCardViewModel";
import { NotesCardProps } from "../Model/NotesCardProps";
import { FC, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import useCalendar from "../../../context/CalendarContext";
import { removeReminder } from "../../../database/databse";
import { CancelNotification } from "../../../notifications/cancelNotification";

const NotesCard: FC<NotesCardProps> = ({ item, setReload, highlightId }) => {
    const { deleteNote, onPressEdit, remind } = useNotesCard(setReload);
    const { setOpen, setCancelAction, setSelectedNote, setSetReload } = useCalendar();


    const formattedDate = new Date(item.lastUpdated).toLocaleString();

    useEffect(() => {
        setSetReload(() => setReload);
    }, []);

    return (
        <View style={styles.outerContainer}>
            <View style={[styles.container,   item.id === highlightId && { borderWidth: 2, borderColor: "#df5d88ff" }]}>

                {/* Title + Sync Status */}
                <View style={styles.statusContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={3}>{item.note}</Text>
                    </View>

                    {item.sync == 0
                        ? <Ionicons name="cloud-offline-outline" size={24} color="grey" />
                        : <Ionicons name="cloud-done-outline" size={24} color="green" />}
                </View>

                {/* Date + Edit/Delete */}
                <View style={styles.innerContainer}>
                    <Text style={styles.date}>{formattedDate}</Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => onPressEdit(item)}>
                            <Ionicons name="create-outline" size={18} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => deleteNote(item)}>
                            <Ionicons name="trash-outline" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Reminder Checkbox */}
                <View style={styles.checkBoxContainer}>
                    <TouchableOpacity
                        onPress={async () => {
                            // If reminder exists remove it
                            if (remind || item.reminder) {
                                await removeReminder(item.localId, item.id);
                                await CancelNotification(item.localId, item.id)
                                setReload(prev => !prev);
                                return;
                            }

                            // Otherwise open datepicker modal to add reminder
                            setSelectedNote(item);
                            setCancelAction(() => () =>{});
                            setOpen(true);
                        }}
                        hitSlop={5}
                    >
                        {(remind || item.reminder)
                            ? <MaterialIcons name="check-box" size={24} color="#df5d88ff" />
                            : <MaterialIcons name="check-box-outline-blank" size={24} color="#df5d88ff" />
                        }
                    </TouchableOpacity>

                    <Text style={{ fontWeight: "bold", color: "#df5d88ff" }}>Set Reminder</Text>
                </View>

            </View>
        </View>
    );
};

export default NotesCard;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        width: "100%",
        marginVertical: vs(6),
        borderRadius: vs(10),
        backgroundColor: "#ffffff",
        elevation: 1,
        shadowOffset: { width: vs(10), height: vs(10) },
        shadowOpacity: 0.5,
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
    statusContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    checkBoxContainer: {
        flexDirection: "row",
        gap: vs(5),
        alignItems: "center"
    }
});
