import notifee from "@notifee/react-native"

export const Permission = async () => {
    await notifee.requestPermission()
}