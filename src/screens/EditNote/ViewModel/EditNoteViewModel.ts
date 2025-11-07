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
    const [loading, setLoading] = useState(false)

    const onSavePress = async () => {

        try {
            setLoading(true)
            const state = await NetInfo.fetch()
            const isOnline = state.isConnected
            const db = await initDB()

            let firestoreId = item.id
            if (!firestoreId) {
                const res = await db?.executeSql(
                    `SELECT fireStoreId FROM notes WHERE id = ?`,
                    [item.localId]
                )
                const rows = res?.[0]?.rows
                if (rows?.length > 0 && rows?.item(0).fireStoreId) {
                    firestoreId = rows?.item(0).fireStoreId
                }
            }

            if (isOnline && firestoreId) {
                // update in firebase

                const user = auth().currentUser

                await firestore().collection('users')
                    .doc(user?.uid)
                    .collection('notes')
                    .doc(firestoreId)
                    .update({
                        note: editNote,
                        lastUpdated: Date.now(),
                        sync: 1
                    })

                await db?.executeSql(
                    `UPDATE notes 
           SET text = ?, lastUpdated = ?, sync = 1
           WHERE firestoreId = ?`,
                    [editNote, Date.now(), firestoreId]
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
                        [editNote, Date.now(), firestoreId]
                    )
                }
                else {

                    await db?.executeSql(
                        `UPDATE notes 
                        SET text = ? , lastUpdated = ? , sync = 0
                        WHERE id = ? `,
                        [editNote, Date.now(), item.localId]
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
        finally {
            setLoading(false)
            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });
        }
    }

    return {
        editNote,
        setEditNote,
        onSavePress,
        loading
    }
}

export default useEditNote