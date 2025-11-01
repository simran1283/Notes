import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { initDB } from "../../../database/databse";
import NetInfo from "@react-native-community/netinfo"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

const useNewNote = () => {

    const [note, setNote] = useState("")
    const [loading, setLoading] = useState(false)

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
            setLoading(true)

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
                        sync : 1
                    });

                const existing = await db?.executeSql(
                    `SELECT * FROM notes WHERE fireStoreId = ?`,
                    [docRef.id]
                )

                if (existing[0].rows.length === 0) {
                    await db?.executeSql(
                        `INSERT INTO notes (userId,fireStoreId,text,lastUpdated,sync)
     VALUES (?, ?, ?, ?, ?)`,
                        [userId, docRef.id, note, timestamp, 1]
                    )
                }

            }

            else {

                const existingOffline = await db?.executeSql(
                    `SELECT * FROM notes WHERE userId = ? AND text = ? AND sync = 0`,
                    [userId, note]
                )

                if (existingOffline[0].rows.length === 0) {
                    await db?.executeSql(
                        `INSERT INTO notes (userId, fireStoreId, text, lastUpdated, sync)
     VALUES (?, ?, ?, ?, ?)`,
                        [userId, null, note, timestamp, 0]
                    )
                } else {
                    console.log("Duplicate offline note skipped:", note)
                }
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
        finally {
            setLoading(false)
        }
    }

    return {
        note,
        setNote,
        AddNotes,
        navigation,
        loading
    }
}

export default useNewNote