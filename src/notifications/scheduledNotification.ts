import { Note } from "../components/NotesCard/Model/NotesCardProps"
import { saveNotification } from "../database/databse"
import { createChannel } from "./channel"
import notifee, { TriggerType } from "@notifee/react-native"


export const scheduledNotification = async (date : Date, note : Note | null) => {
    
    const channelId = await createChannel()

    const notificationId = await notifee.createTriggerNotification({
        id: String(note?.id ?? note?.localId),
        title: "Notes",
        body: note?.note,
        data: {
            id: note?.id ?? "",
            localId : note?.localId ?? ""
        },
        android: {
            channelId,
            pressAction: {
                id: "default"
            }
        }
    },
        {
            type: TriggerType.TIMESTAMP,
            timestamp: date.getTime()
        }
    )

    await saveNotification(notificationId, note?.localId, note?.id)

}