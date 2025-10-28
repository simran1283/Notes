import { showMessage } from "react-native-flash-message";
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import NetInfo from "@react-native-community/netinfo"
import { Note } from "../Model/NotesCardProps";
import { initDB } from "../../../database/databse";
import { useNavigation } from "@react-navigation/native";


const useNotesCard = (setReload) => {

  const navigation = useNavigation()

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

      if (isOnline) {
        // Delete from Firestore first
        if (item.id) {
          await firestore()
            .collection("users")
            .doc(user.uid)
            .collection("notes")
            .doc(item.id)
            .delete()
        }

        // delete from SQLite
        await db?.executeSql(
          `DELETE FROM notes WHERE fireStoreId = ? AND userId = ?`,
          [item.id, user.uid]
        )


        showMessage({
          type: "success",
          message: "Note deleted successfully!",
        })
      }
      else {
        // delete locally and add to new table
        console.log("item in deletion", item)
        if (item.id) {
          await db?.executeSql(
            `INSERT OR IGNORE INTO deleted_notes (fireStoreId) VALUES (?)`,
            [item.id]
          )

          await db?.executeSql(
            `DELETE FROM notes WHERE fireStoreId = ? AND userId = ?`,
            [item.id, user.uid]
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

    setReload((prev) => !prev)
  }

  return {
    deleteNote,
    onPressEdit
  }
}


export default useNotesCard