import { showMessage } from "react-native-flash-message";
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { FC } from "react";
import { Note} from "../Model/NotesCardProps";
  
  
  const useNotesCard = () => {

    
  const deleteNote = async (item : Note) => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      await firestore()
        .collection("users")
        .doc(user.uid)
        .collection("notes")
        .doc(item.id)
        .delete();

      showMessage({
        type: "success",
        message: "Note deleted successfully!",
      });
    } catch (error) {
      console.log("Error deleting note:", error);
      showMessage({
        type: "danger",
        message: "Failed to delete note",
      });
    }
  };

  return {
    deleteNote
  }

  }

  export default useNotesCard
  
  