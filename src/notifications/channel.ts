import { AndroidImportance } from "@notifee/react-native"
import notifee from "@notifee/react-native"

export const createChannel = async () => {
    const channelId = await notifee.createChannel({
        id : "default",
        name : "default channel",
        importance : AndroidImportance.HIGH
    })
    return channelId
}
