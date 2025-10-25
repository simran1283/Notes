import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { initDB } from "../../../database/databse";
import NetInfo from "@react-native-community/netinfo"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

const useNewNote = () => {

    const [note, setNote] = useState("")

    const navigation = useNavigation()

    // local DB and Firestore
    const AddNotes = async () => {
        if (!note) {
            showMessage({
                type: "warning",
                message: "Please enter a note",
            });
            return;
        }

        try {

            const db = await initDB()
            const timestamp = Date.now()

            const state = await NetInfo.fetch()
            const isOnline = state.isConnected

            const userId = auth().currentUser?.uid

            if (isOnline) {

                const docRef = await firestore()
                    .collection('users')
                    .doc(userId)
                    .collection('notes')
                    .add({
                        note: note,
                        lastUpdated: timestamp,
                        userId: userId,
                    });

                await db?.executeSql(`
                               INSERT OR REPLACE INTO notes (id,userId,fireStoreId,text,lastUpdated,sync) VALUES (?, ?, ?, ?, ?, ?)`,
                    [null, userId, docRef.id, note, timestamp, 1])
            }

            else {
                await db?.executeSql(`
                               INSERT OR REPLACE INTO notes (id,userId,fireStoreId,text,lastUpdated,sync) VALUES (?, ?, ?, ?, ?, ?)`,
                    [null, userId, null, note, timestamp, 0])
            }

            showMessage({
                type: "success",
                message: "Note added successfully!",
            });

            navigation.navigate("Home")
        }
        catch (error) {
            console.log(error)

            showMessage({
                type: "danger",
                message: "Error Adding Notes"
            })
        }
    }

    return {
        note,
        setNote,
        AddNotes
    }
}

export default useNewNote