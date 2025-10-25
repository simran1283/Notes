import { useEffect } from "react"
import AppSafeView from "./src/components/AppSafeView/View/AppSafeView"
import MainAppStackNavigation from "./src/navigations/MainAppStackNavigation"
import FlashMessage from "react-native-flash-message"
import { initDB, SyncOfflineNotes } from "./src/database/databse"
import NetInfo from "@react-native-community/netinfo"


const App = () => {

  useEffect(() => {

    const setupDB = async () => {
      try {
        await initDB()
        console.log("Database Setup successful")
      }
      catch (error) {
        console.log("Error setting up the database")
      }
    }

    setupDB();

  }, [])

  useEffect(() => {
    const syncNotes = async () => {
      try {
        const state = await NetInfo.fetch()
        if (state.isConnected) {
          await SyncOfflineNotes()
        }
      } catch (error) {
        console.log(error)
      }
    }

    syncNotes()
  }, [])


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        SyncOfflineNotes()
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