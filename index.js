/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
        // store which task was pressed
       await AsyncStorage.setItem('PendingNotification',
        JSON.stringify(detail.notification.data)
       )
    }
});


AppRegistry.registerComponent(appName, () => App);
