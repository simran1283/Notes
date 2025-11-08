import SQLite, { SQLiteDatabase } from "react-native-sqlite-storage"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import { showMessage } from "react-native-flash-message"

SQLite.DEBUG(true)

SQLite.enablePromise(true)

let db: SQLiteDatabase | null = null

export type LocalNote = {
    id: number
    userId: string
    fireStoreId: string
    text: string
    lastUpdated: number
    sync: number
}

//initializing local DB
export const initDB = async () => {

    if (db) return db;

    try {

        db = await SQLite.openDatabase({ name: "notes.db", location: 'Documents', })

        await db.executeSql(`
        CREATE TABLE IF NOT EXISTS notes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        fireStoreId TEXT UNIQUE,
        text TEXT NOT NULL,
        lastUpdated INTEGER,
        sync INTEGER DEFAULT 0
        );
    `);

        await db.executeSql(`
  CREATE TABLE IF NOT EXISTS deleted_notes (
    fireStoreId TEXT UNIQUE
  );
`);

        console.log("Database Initialized Successfully")
        return db

    } catch (error) {
        console.log(error)
    }
}



let isSyncing = false // Global flag to prevent duplicate runs

export const SyncOfflineNotes = async () => {
    if (isSyncing) {
        // showMessage({
        //     type: "info",
        //     message: "Syncing in progress, please wait...",
        // })
        console.log("Sync already in progress")
        return
    }

    const user = auth().currentUser
    if (!user) return

    try {
        isSyncing = true
        const db = await initDB()
        const userId = user.uid

        // Fetch unsynced notes
        const results = await db?.executeSql(
            `SELECT * FROM notes WHERE userId = ? AND sync = 0`,
            [userId]
        )
        const rows = results[0].rows

        if (rows.length === 0) {
            console.log("No offline notes to sync.")
            return
        }

        for (let i = 0; i < rows.length; i++) {
            const note = rows.item(i)
            const noteRef = firestore()
                .collection("users")
                .doc(userId)
                .collection("notes")

            try {
                if (note.fireStoreId) {
                    console.log(`Updating Firestore note: ${note.fireStoreId}`)
                    await noteRef.doc(note.fireStoreId).set(
                        {
                            note: note.text,
                            lastUpdated: note.lastUpdated,
                            userId: note.userId,
                        },
                        { merge: true } // <-- safer than update()
                    )
                } else {

                    console.log(`Adding new Firestore note for local id: ${note.id}`)
                    const docRef = await noteRef
                        .add({
                            note: note.text,
                            lastUpdated: note.lastUpdated,
                            userId: note.userId,
                        })

                    // ✅ Make sure to update the correct local row immediately
                    await db?.executeSql(
                        `UPDATE notes SET fireStoreId = ?, sync = 1 WHERE id = ?`,
                        [docRef.id, note.id]
                    )

                    console.log(`Firestore ID ${docRef.id} set for local note ${note.id}`)

                }

                // Mark note as synced safely (even for updates)
                await db.executeSql(
                    `UPDATE notes SET sync = 1 WHERE id = ?`,
                    [note.id]
                )

            } catch (err) {
                console.log("Error syncing individual note:", err)
            }
        }

        showMessage({
            type: "success",
            message: `${rows.length} notes synced successfully!`,
        })
    } catch (error) {
        console.log("Error syncing notes:", error)
        showMessage({
            type: "danger",
            message: "Error syncing notes",
        })
    } finally {
        isSyncing = false
    }
}



export const SyncDeletions = async () => {
    try {
        const db = await initDB()
        const userId = auth().currentUser?.uid

        const results = await db?.executeSql(`SELECT * FROM deleted_notes`)
        const rows = results[0].rows

        for (let i = 0; i < rows.length; i++) {
            const { fireStoreId } = rows.item(i)

            try {
                await firestore()
                    .collection("users")
                    .doc(userId)
                    .collection("notes")
                    .doc(fireStoreId)
                    .delete()

                //Remove from deleted_notes after successful sync
                await db?.executeSql(`DELETE FROM deleted_notes WHERE fireStoreId = ?`, [fireStoreId])
            } catch (err) {
                console.log("Error syncing deletion:", err)
            }
        }

        console.log("Offline deletions synced successfully!")
    } catch (error) {
        console.log("SyncDeletions Error:", error)
    }
}
