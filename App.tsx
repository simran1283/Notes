import { useEffect, useState } from "react"
import AppSafeView from "./src/components/AppSafeView/View/AppSafeView"
import MainAppStackNavigation from "./src/navigations/MainAppStackNavigation"
import FlashMessage from "react-native-flash-message"
import { initDB, removeReminder } from "./src/database/databse"
import useCalendar,{CalendarProvider} from "./src/context/CalendarContext"
import { Permission } from "./src/notifications/permission"
import notifee, { EventType } from "@notifee/react-native"
import { AppState } from "react-native"
import { navigateToTask } from "./src/navigations/navigationRef"
import AsyncStorage from "@react-native-async-storage/async-storage"
import InAppBanner from "./src/components/InAppBanner/View/InAppBanner"
import { CancelNotification } from "./src/notifications/cancelNotification"



const App = () => {

  

  const [banner, setBanner] = useState<null | {
    title: string;
    body: string;
    id: string
  }>(null);

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
    Permission()

  }, [])


  // Foregrund notification
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {

      const notification = detail.notification
      const localId = String(notification?.data?.id)

      if (type === EventType.DELIVERED) {
        
        setBanner({
          title: notification?.title ?? "Reminder",
          body: notification?.body ?? "",
          id: notification?.id ?? ""
        });

        setTimeout(() => setBanner(null), 5000)

      }

      if (type === EventType.PRESS) {
        if (notification?.id) {
          navigateToTask(notification?.id)
          await removeReminder(localId, localId);
          await CancelNotification(localId, localId);
          // onToggleCheck()
        }
        setBanner(null)
      }


    })

    return unsubscribe;
  }, [])


  //Background Event
  useEffect(() => {

    const checkPending = async () => {

      const stored = await AsyncStorage.getItem('PendingNotification')

      if (stored) {
        const data = JSON.parse(stored);
        const localId = data?.id;

        if (localId) {
          navigateToTask(localId)

          await removeReminder(localId, localId);
          await CancelNotification(localId, localId);
          // onToggleCheck()
        }

        await AsyncStorage.removeItem('PendingNotification')
      }
    }

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active')
        checkPending()
    })

    checkPending()

    return () => sub.remove()
  })

  //for iOS
  useEffect(() => {
    async function checkInitialNotification() {
      const initial = await notifee.getInitialNotification();

      if (initial) {
        const data = initial.notification?.data;
        const localId = String(data?.localId || data?.id);

        if (localId) {
          navigateToTask(localId);

          // cleanup reminder and notification after tapping
          await removeReminder(localId, localId);
          await CancelNotification(localId, localId);
          // onToggleCheck()
        }
      }
    }

    checkInitialNotification();
  }, []);




  return (
    <>
      <CalendarProvider>
        <AppSafeView>
          <MainAppStackNavigation />
          <FlashMessage position="top" />
        </AppSafeView>
      </CalendarProvider>
      {banner &&
        <InAppBanner
          title={banner?.title}
          body={banner?.body}
          onPress={async () => {
            navigateToTask(banner.id)
            await removeReminder(banner.id, banner.id)
            await CancelNotification(banner.id, banner.id)
            setBanner(null)
          }}
          onClose={() => {
            setBanner(null)
          }} />
      }
    </>
  )
}

export default App