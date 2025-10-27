import SQLite, { SQLiteDatabase } from "react-native-sqlite-storage"
import firestore, { Timestamp } from "@react-native-firebase/firestore"
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

        db = await SQLite.openDatabase({ name: "notes.db", location: "default" })

        // await db.executeSql(`DROP TABLE IF EXISTS notes`);

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

        await db.executeSql(`DROP TABLE IF EXISTS deleted_notes`)

        await db.executeSql(`
  CREATE TABLE IF NOT EXISTS deleted_notes (
    fireStoreId TEXT UNIQUE
    id TEXT UNIQUE
  );
`);

        console.log("Database Initialized Successfully")
        return db

    } catch (error) {
        console.log(error)
    }
}



let isSyncing = false //Global flag to prevent duplicate runs

export const SyncOfflineNotes = async () => {
    if (isSyncing) {
        console.log("Sync already in progress")
        return
    }

    try {
        const db = await initDB()
        const userId = auth().currentUser?.uid
        if (!userId) return

        isSyncing = true //  Lock sync

        const results = await db?.executeSql(
            `SELECT * FROM notes WHERE userId = ? AND sync = 0`,
            [userId]
        )
        const rows = results[0].rows

        for (let i = 0; i < rows.length; i++) {
            const note = rows.item(i)

            const docRef = await firestore()
                .collection("users")
                .doc(userId)
                .collection("notes")
                .add({
                    note: note.text,
                    lastUpdated: note.lastUpdated,
                    userId: note.userId,
                })

            await db?.executeSql(
                `UPDATE notes SET sync = 1, fireStoreId = ? WHERE id = ?`,
                [docRef.id, note.id]
            )
        }

        if (rows.length > 0) {
            showMessage({
                type: "success",
                message: `${rows.length} notes synced successfully!`,
            })
        } else {
            console.log("No offline notes to sync.")
        }

    } catch (error) {
        console.log("Error syncing notes:", error)
        showMessage({
            type: "danger",
            message: "Error syncing notes",
        })
    } finally {
        isSyncing = false // Unlock sync after done
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

                // Remove from deleted_notes after successful sync
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
