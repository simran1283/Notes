import { useEffect } from "react"
import AppSafeView from "./src/components/AppSafeView/View/AppSafeView"
import MainAppStackNavigation from "./src/navigations/MainAppStackNavigation"
import FlashMessage from "react-native-flash-message"
import { initDB } from "./src/database/databse"


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


  return (
    <AppSafeView>
      <MainAppStackNavigation />
      <FlashMessage position="top" />
    </AppSafeView>
  )
}

export default App