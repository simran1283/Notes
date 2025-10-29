import NetInfo from "@react-native-community/netinfo"
import firestore from "@react-native-firebase/firestore"
import { useState } from "react";
import auth from "@react-native-firebase/auth"
import { initDB } from "../../../database/databse";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";

const useHome = () => {

  const navigation = useNavigation()

  const [allNotes, setAllNotes] = useState([])

  const fetchNotes = async (setAllNotes) => {

    const userId = auth().currentUser?.uid
    const db = await initDB()

    const state = await NetInfo.fetch();
    const isOnline = state.isConnected;

    if (isOnline) {
      // Online: fetch from Firestore
      try {
        const snapshot = await firestore()
          .collection('users')
          .doc(userId)
          .collection('notes')
          .get();

        const fetchedNotes = snapshot.docs.map(doc => ({
          fireStoreId: doc.id,
          text: doc.data().note,
          lastUpdated: doc.data().lastUpdated
        }));

        setAllNotes(fetchedNotes.map(d => ({
          id: d.fireStoreId,
          note: d.text,
          lastUpdated : d.lastUpdated
        })));

        // Upsert into SQLite
        db?.transaction(tx => {
          fetchedNotes.forEach(n => {
            tx.executeSql(
              `INSERT OR REPLACE INTO notes (id,userId, fireStoreId, text, lastUpdated, sync) VALUES (?, ?, ?, ?, ?, ?)`,
              [null, userId, n.fireStoreId, n.text, n.lastUpdated, 1]
            );
          });
        });
      } catch (err) {
        console.log('Firestore fetch error:', err);
      }
    } else {
      // Offline: fetch from SQLite

      if (!userId) {
        showMessage({
          type: "danger",
          message: "User NOt logged in"
        })
        return
      }
      db?.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM notes WHERE userId = ?`,
          [userId],
          (tx, results) => {
            const rows = results.rows
            let notes = []
            for (let i = 0; i < rows.length; i++) {
              notes.push(rows.item(i))
            }
            setAllNotes(notes.map(n => ({ id: n.fireStoreId, note: n.text, localId : n.id, lastUpdated : n.lastUpdated })));
          }
        );
      });
    }
  };

  return {
    allNotes,
    setAllNotes,
    navigation,
    fetchNotes
  }

}

export default useHome

