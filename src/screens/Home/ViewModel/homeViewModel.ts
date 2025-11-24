import NetInfo from "@react-native-community/netinfo"
import firestore from "@react-native-firebase/firestore"
import { useRef, useState } from "react"
import auth from "@react-native-firebase/auth"
import { initDB, SyncDeletions, SyncOfflineNotes } from "../../../database/databse"
import { showMessage } from "react-native-flash-message"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Note {
  id?: number
  fireStoreId?: string
  note: string
  lastUpdated: number
  sync: number
  localId?: number
  reminder? : string
  notificationId? : string
}

const useHome = () => {
  const [allNotes, setAllNotes] = useState<Note[]>([])
  const [isSyncingIn, setSyncingIn] = useState(false)
  const isSyncing = useRef(false)

  // 🔹 FIXED fetchNotes function
  const fetchNotes = async (setAllNotes: React.Dispatch<React.SetStateAction<Note[]>>) => {
    const userId = auth().currentUser?.uid
    const db = await initDB()
    const state = await NetInfo.fetch()
    const isOnline = state.isConnected

    if (!userId) {
      showMessage({ type: "danger", message: "User not logged in" })
      return
    }
    if (isOnline) {
      try {
        const snapshot = await firestore()
          .collection('users')
          .doc(userId)
          .collection('notes')
          .orderBy("lastUpdated","desc")
          .get();

        const fetchedNotes = snapshot.docs.map(doc => ({
          fireStoreId: doc.id,
          text: doc.data().note,
          lastUpdated: doc.data().lastUpdated,
          reminder: doc.data().reminder ?? null,
          notificationId: doc.data().notificationId ?? null
        }));

        //  Fix duplication issue here
        db?.transaction(tx => {
          fetchedNotes.forEach(note => {
            tx.executeSql(
              `
          UPDATE notes
          SET fireStoreId = ?, text = ?, lastUpdated = ?, reminder = ?, notificationId = ?, sync = 1
          WHERE userId = ? AND text = ? AND fireStoreId IS NULL
          `,
              [note.fireStoreId, note.text, note.lastUpdated,note.reminder, note.notificationId, userId, note.text],
              (_, result) => {
                // If no local note was updated, insert as new
                if (result.rowsAffected === 0) {
                  // Check if note with same Firestore ID already exists
                  tx.executeSql(
                    `SELECT id FROM notes WHERE fireStoreId = ? AND userId = ?`,
                    [note.fireStoreId, userId],
                    (_, res) => {
                      if (res.rows.length === 0) {
                        tx.executeSql(
                          `
          INSERT INTO notes (userId, fireStoreId, text, lastUpdated, reminder,notificationId, sync)
          VALUES (?, ?, ?, ?, ?, ?, 1)
          `,
                          [userId, note.fireStoreId, note.text, note.lastUpdated, note.reminder, note.notificationId]
                        );
                      } else {
                        // 🔹 If already exists, just update its content
                        tx.executeSql(
                          `
          UPDATE notes
          SET text = ?, lastUpdated = ?, sync = 1
          WHERE fireStoreId = ? AND userId = ?
          `,
                          [note.text, note.lastUpdated, note.fireStoreId, userId]
                        );
                      }
                    }
                  );
                }

              }
            );
          });
        });

        // ✅ Update in-memory notes
        setAllNotes(
          fetchedNotes.map(n => ({
            id: n.fireStoreId,
            note: n.text,
            lastUpdated: n.lastUpdated,
            sync: 1,
            reminder : n.reminder,
            notificationId : n.notificationId
          }))
        );

      } catch (err) {
        console.log('Firestore fetch error:', err);
      }
    }
    else {
      // --- Offline: fetch from SQLite ---
      db?.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM notes WHERE userId = ? ORDER BY lastUpdated DESC`,
          [userId],
          (tx, results) => {
            const rows = results.rows
            const notes: Note[] = []
            for (let i = 0; i < rows.length; i++) {
              notes.push(rows.item(i))
            }
            setAllNotes(
              notes.map(n => ({
                id: n.fireStoreId,
                note: n.text,
                localId: n.id,
                lastUpdated: n.lastUpdated,
                sync: n.sync,
                reminder : n.reminder,
                notificationId : n.notificationId
              }))
            )
          }
        )
      })
    }
  }

  const handleSync = async () => {
    if (isSyncing.current) return
    isSyncing.current = true

    try {
      setSyncingIn(true)
      const state = await NetInfo.fetch()

      if (state.isConnected) {
        console.log("Syncing offline notes...")
        await SyncOfflineNotes()
        await SyncDeletions()
        await fetchNotes(setAllNotes)
        const now = new Date().toLocaleString()
        await AsyncStorage.setItem("lastSync", now)
        console.log("Sync completed")
      }
    } catch (error) {
      console.log("Sync error:", error)
    } finally {
      isSyncing.current = false
      setSyncingIn(false)
    }
  }

  return {
    allNotes,
    setAllNotes,
    fetchNotes,
    handleSync,
    isSyncingIn,
  }
}

export default useHome


