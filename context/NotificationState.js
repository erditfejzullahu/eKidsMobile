import { createContext, useContext, useState } from "react";

const NotificationContext = createContext()
export const useNotificationContext = () => useContext(NotificationContext);

const NotificationProvider = ({children}) => {
    const [isOpened, setIsOpened] = useState(false)

    return(
        <NotificationContext.Provider value={{isOpened, setIsOpened}}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider;