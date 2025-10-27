import { useEffect, useRef } from "react"
import AppSafeView from "./src/components/AppSafeView/View/AppSafeView"
import MainAppStackNavigation from "./src/navigations/MainAppStackNavigation"
import FlashMessage from "react-native-flash-message"
import { initDB, SyncDeletions, SyncOfflineNotes } from "./src/database/databse"
import NetInfo from "@react-native-community/netinfo"


const App = () => {

  const isSyncing = useRef(false);


  const handleSync = async () => {
    // If a sync is already happening, don’t run again
    if (isSyncing.current) return;
    isSyncing.current = true;

    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        console.log(" Syncing offline notes...");
        await SyncOfflineNotes();
        await SyncDeletions()
        console.log(" Sync completed");
      }
    } catch (error) {
      console.log("Sync error:", error);
    } finally {
      isSyncing.current = false;
    }
  };


  useEffect(() => {

    const setupDB = async () => {
      try {
        await initDB()
        console.log("Database Setup successful")
        await handleSync()
      }
      catch (error) {
        console.log("Error setting up the database")
      }
    }

    setupDB();

  }, [])




  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        handleSync()
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <AppSafeView>
      <MainAppStackNavigation />
      <FlashMessage position="top" />
    </AppSafeView>
  )
}

export default App