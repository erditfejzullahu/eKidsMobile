import { useNavigation, useRouter } from "expo-router"

export const useNavigateToSupport = () => { //can be support, report or chatSupport
    const router = useRouter();

    const navigateToSupport = (type) => {
        router.push({
            pathname: 'support',
            params: {type}
        })
    }

    return navigateToSupport;
}