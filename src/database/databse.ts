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

        await db.executeSql(`
        CREATE TABLE IF NOT EXISTS notes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        fireStoreId TEXT,
        text TEXT NOT NULL,
        lastUpdated INTEGER,
        sync INTEGER DEFAULT 0
        );
    `);

        console.log("Database Initialized Successfully")
        return db

    } catch (error) {
        console.log(error)
    }
}


export const SyncOfflineNotes = async () => {
    try {

        const db = await initDB()
        const userId = auth().currentUser?.uid

        const results = await db?.executeSql(`SELECT * FROM NOTES WHERE userId = ? and sync = 0`, [userId])

        const rows = results[0].rows

        for (let i = 0; i < rows.length; i++) {
            const note = rows.item(i)

            const docRef = await firestore()
                .collection('users')
                .doc(userId)
                .collection('notes')
                .add({
                    note: note.text,
                    lastUpdated: note.lastUpdated,
                    userId: note.userId
                })

            await db?.executeSql(`UPDATE notes SET sync = 1, fireStoreId = ? WHERE id = ?`, [docRef.id, note.id])
        }

        showMessage({
            type : "success",
            message : "Notes Synced Succeessfully"
        })
    }
    catch (error) {
        console.log(error)

        showMessage({
            type : "danger",
            message : "Error Syncing Notes"
        })
    }
}
