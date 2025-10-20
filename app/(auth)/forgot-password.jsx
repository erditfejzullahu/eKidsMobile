import { View, Text, SafeAreaView, Image, ScrollView, RefreshControl, Platform } from 'react-native'
import { memo, useCallback, useMemo, useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import Loading from '../../components/Loading'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomButton from '../../components/CustomButton'
import { ForgotPasswordReq } from '../../services/fetchingService'
import NotifierComponent from '../../components/NotifierComponent'
import { Link, useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'

const ForgotPassword = () => {
    const {colorScheme} = useColorScheme();
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const onRefresh = useCallback(() => {
        setIsRefreshing(true)
        setEmail("")
        setTimeout(() => {
            setIsRefreshing(false)
        }, 1000);
    }, [setIsRefreshing, setEmail])


    const successNotifier = useMemo(() => NotifierComponent({
        title: "Sukses",
        description: "Emaili shkoi me sukses ne adresen elektronike te paraqitur ne forme",
        theme: colorScheme
    }))

    const success = successNotifier.showNotification

    const errorNotifier = useMemo(() => NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim, ju lutem provoni perseri!",
        alertType: "warning",
        theme: colorScheme
    }), [colorScheme])

    const error = errorNotifier.showNotification

    const emptyFieldNotifier = useMemo(() => NotifierComponent({
        title: "Gabim",
        description: "Emaili është i detyrueshëm",
        alertType: "warning",
        theme: colorScheme
    }), [colorScheme])
    
    const emptyField = emptyFieldNotifier.showNotification

    const submit = useCallback(async () => {
        if(email.trim() === "" || email === null){
            emptyField()
            return;
        }
        setIsLoading(true)
        const payload = {
            email: email
        }
        const response = await ForgotPasswordReq(payload)
        if(response === 200){
            success();
            router.replace('/sign-in')
        }else{
            setEmail("")
            error();
        }
    }, [router, setIsLoading, setEmail, ForgotPasswordReq, error])

    if(isRefreshing) return <Loading />

  return (
    <SafeAreaView className="bg-primary-light dark:bg-primary h-full">
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" extraScrollHeight={50} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />} className="h-full px-4" contentContainerStyle={{flexGrow: 1, justifyContent: "space-between", alignItems: "center"}}>
            <View className="w-full flex-1 justify-center">
                <View>
                    <Image 
                        source={images.logoNew}
                        resizeMode='contain' className="h-[100px]"
                    />
                    <Text className="text-oBlack dark:text-white font-psemibold text-xl mt-4 text-center">Forma e rivendosjes se fjalekalimit</Text>
                </View>
                <View className="mt-6">
                    <FormField 
                        title={"Emaili"}
                        placeholder={"Shkruani ketu email adresen tuaj"}
                        keyboardType="email-address"
                        value={email}
                        handleChangeText={(e) => setEmail(e)}
                    />
                    <Text className="text-sm text-gray-600 dark:text-gray-400 font-plight mt-1">Ju do te pranoni nje link te posacshem per rivendosjen e fjalekalimit tuaj. Jetegjatesia e linkut eshte 2 ore. Sigurohuni qe linku i marre ne emailin tuaj te mos shperndahet.</Text>
                </View>
                <View className="w-full mt-4">
                    <CustomButton 
                        title={`${isLoading ? "Duke paraqitur..." : "Paraqit kerkesen"}`}
                        handlePress={submit}
                        isLoading={isLoading}
                    />
                </View>
                <View className="flex-row items-center gap-1.5 justify-center flex-wrap mt-3">
                    <Text className="text-lg text-gray-700 dark:text-gray-100 font-pregular">
                        Ridrejtohu tek
                    </Text>
                    <Link href="/sign-in" className="text-lg font-semibold text-secondary">forma e kycjes</Link>
                </View>
            </View>
            <View className="w-full justify-end border-t border-white dark:border-black-200 pt-3">
                <Text className="text-oBlack dark:text-white font-psemibold text-sm">Realizuar nga <Link href={"https://murrizi.org"} accessibilityRole="link" className="text-secondary">Murrizi Co.</Link></Text>
            </View>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default memo(ForgotPassword)