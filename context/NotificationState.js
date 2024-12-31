import { createContext, useContext, useState } from "react";

const NotificationContext = createContext()
export const useNotificationContext = () => useContext(NotificationContext);

const NotificationProvider = ({children}) => {
    const [isOpened, setIsOpened] = useState(false)
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [currentConnection, setCurrentConnection] = useState(null)

    return(
        <NotificationContext.Provider value={{isOpened, setIsOpened, notificationsCount, setNotificationsCount, currentConnection, setCurrentConnection}}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider;