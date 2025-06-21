import { useColorScheme } from "nativewind";
import { shadowStyles } from "../utils/shadowStyles";

export const useShadowStyles = () => {
    const {colorScheme} = useColorScheme()

    return {
        shadowStyle: colorScheme === 'light' ? shadowStyles.light : shadowStyles.dark
    }
}

export const useNotifierStyles = () => {
    const {colorScheme} = useColorScheme();
    return {
        titleColor: colorScheme === 'dark' ? "#fcf6f2" : "#fff",
        descriptionColor: colorScheme === 'dark' ? "#9ca3af" : "#4b5563",
        backgroundColor: colorScheme === 'dark' ? "#161622" : "#f8f5f2"
    }
}