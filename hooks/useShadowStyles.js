import { useColorScheme } from "nativewind";
import { shadowStyles } from "../utils/shadowStyles";

export const useShadowStyles = () => {
    const {colorScheme} = useColorScheme()

    return {
        shadowStyle: colorScheme === 'light' ? shadowStyles.light : shadowStyles.dark
    }
}