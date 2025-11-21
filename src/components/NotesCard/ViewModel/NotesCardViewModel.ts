import { showMessage } from "react-native-flash-message";
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import NetInfo from "@react-native-community/netinfo"
import { Note } from "../Model/NotesCardProps";
import { initDB } from "../../../database/databse";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/NavigationType";


const useNotesCard = ( setReload: React.Dispatch<React.SetStateAction<boolean>> | null | undefined) => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList,"EditNote">>()

  const [remind, setRemind] = useState(false)


  const onToggleCheck = () => {
    setRemind((prev) => !prev)
  }

  const onPressEdit = (item: Note) => {
    navigation.navigate("EditNote", {
      item: item
    })
  }

  const deleteNote = async (item: Note) => {
    console.log(item)
    try {

      const db = await initDB()
      const user = auth().currentUser
      if (!user) return

      const state = await NetInfo.fetch()
      const isOnline = state.isConnected

      let firestoreId = item.id
      if (!firestoreId) {
        const res = await db?.executeSql(
          `SELECT fireStoreId FROM notes WHERE id = ?`,
          [item.localId]
        )
        const rows = res?.[0]?.rows
        if(!rows) return ;
        if (rows?.length > 0 && rows?.item(0).fireStoreId) {
          firestoreId = rows?.item(0).fireStoreId
        }
      }

      if (isOnline) {
        // Delete from Firestore first
        if (firestoreId) {
          await firestore()
            .collection("users")
            .doc(user.uid)
            .collection("notes")
            .doc(firestoreId)
            .delete()
        }

        // delete from SQLite
        await db?.executeSql(
          `DELETE FROM notes WHERE fireStoreId = ? AND userId = ?`,
          [firestoreId, user.uid]
        )


        showMessage({
          type: "success",
          message: "Note deleted successfully!",
        })
      }
      else {
        // delete locally and add to new table
        console.log("item in deletion", item)
        if (firestoreId) {
          await db?.executeSql(
            `INSERT OR IGNORE INTO deleted_notes (fireStoreId) VALUES (?)`,
            [firestoreId]
          )

          await db?.executeSql(
            `DELETE FROM notes WHERE fireStoreId = ? AND userId = ?`,
            [firestoreId, user.uid]
          )
        } else {

          await db?.executeSql(
            `DELETE FROM notes WHERE id = ? AND userId = ?`,
            [item.localId, user.uid]
          )
        }

        showMessage({
          type: "info",
          message: "Note deleted locally. It will sync when back online.",
        })
      }
    }
    catch (error) {
      console.log("Error deleting note:", error)
      showMessage({
        type: "danger",
        message: "Failed to delete note!",
      })
    }

    setReload?.((prev) => !prev)
  }

  return {
    deleteNote,
    onPressEdit,
    remind,
    setRemind,
    onToggleCheck
  }
}


export default useNotesCard