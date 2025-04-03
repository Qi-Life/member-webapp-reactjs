import { createContext, useState, ReactNode } from 'react';
import { getNotificationList } from '~/services/NotificationServices';
import { onMessage } from "firebase/messaging";
import { firebase, messaging } from '~/firebase';


export const NotificationContext = createContext<any>({
    notifications: [],
});

function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState([]);


    const fetchNotification = async (limit: number) => {
        const res = await getNotificationList(limit)
        setNotifications(res.data.data)
    }

    const updateNotification = (newdata:any) => {
        setNotifications(newdata)
    }

    const value = {
        notifications,
        fetchNotification,
        updateNotification
    }

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export { NotificationProvider };
