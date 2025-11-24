import { deleteNotificationId, getNotificationId } from "../database/databse"
import notifee from "@notifee/react-native"

export const CancelNotification = async (localId, firestoreId) => {

    const notificationId = await getNotificationId(localId, firestoreId)

    console.log(notificationId,
        "Notification id"
    )
    if (notificationId) {
        await notifee.cancelTriggerNotification(notificationId.toString())
    }

    await deleteNotificationId(localId, firestoreId)

}