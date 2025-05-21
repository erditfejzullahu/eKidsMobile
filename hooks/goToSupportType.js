import { useNavigation } from "expo-router"

export const useNavigateToSupport = () => { //can be support, report or chatSupport
    const navigation = useNavigation();

    const navigateToSupport = (type) => {
        navigation.navigate("support", {
            type: type
        })
    }

    return navigateToSupport;
}