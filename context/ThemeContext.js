import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState(systemTheme)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      const loadTheme = async () => {
        const savedTheme = await AsyncStorage.getItem('colorScheme')
        if(savedTheme){
            setTheme(savedTheme)
        }
        setIsMounted(true)
      }
      loadTheme();
    }, [])
    
    const toggleTheme = async () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        await AsyncStorage.setItem('colorScheme', newTheme);
    }

    if(!isMounted){
        return null;
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}