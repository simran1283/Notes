import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/NavigationType';

export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

export function navigateToTask(taskId: string | number) {
    // navigationRef.current?.navigate("Home", { id: taskId });

    if (navigationRef.current?.isReady()) {
        navigationRef.current?.navigate("Home", { id: taskId });
    } else {
        // store navigation request for later
        (globalThis as any).PENDING_NAVIGATION = taskId;
    }
}
