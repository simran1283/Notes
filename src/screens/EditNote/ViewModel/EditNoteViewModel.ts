import { useState } from "react"
import { Note } from "../../../components/NotesCard/Model/NotesCardProps"
import { useNavigation } from "@react-navigation/native"
import NetInfo from "@react-native-community/netinfo"
import { showMessage } from "react-native-flash-message"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import { initDB } from "../../../database/databse"

const useEditNote = (item: Note) => {

    const navigation = useNavigation()

    const [editNote, setEditNote] = useState(item.note)

    const onSavePress = async () => {

        try {

            const state = await NetInfo.fetch()
            const isOnline = state.isConnected
            const db = await initDB()

            if (isOnline) {
                // update in firebase

                const user = auth().currentUser

                await firestore().collection('users')
                    .doc(user?.uid)
                    .collection('notes')
                    .doc(item.id)
                    .update({
                        note: editNote
                    })

                await db?.executeSql(
                    `UPDATE notes 
           SET text = ?, lastUpdated = ?, sync = 1
           WHERE firestoreId = ?`,
                    [editNote, Date.now(), item.id]
                );

                showMessage({
                    type: "success",
                    message: "Note updated successfully (online)",
                });
            }
            else {
                if (item.id) {
                    await db?.executeSql(
                        `UPDATE notes 
                    SET text = ? , lastUpdated = ? , sync = 0
                    WHERE fireStoreId = ?`,
                        [editNote, Date.now(), item.id]
                    )
                }
                else {

                    const localId = await db?.executeSql(
                        `SELECT id FROM notes WHERE userId = ? AND text = ?`
                    )
                    await db?.executeSql(
                        `UPDATE notes 
                        SET text = ? , lastUpdated = ? , sync = 0
                        WHERE `
                    )
                }



                showMessage({
                    type: "warning",
                    message: "Updated locally (will sync when online)",
                });
            }
        }

        catch (error) {
            showMessage({
                type: "danger",
                message: "Error updating Note"
            })
        }
        navigation.navigate("Home")
    }

    return {
        editNote,
        setEditNote,
        onSavePress
    }
}

export default useEditNote