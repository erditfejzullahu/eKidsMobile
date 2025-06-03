import { View, Text, SafeAreaView, Image, ScrollView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import Loading from '../../components/Loading'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomButton from '../../components/CustomButton'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const onRefresh = () => {
        setIsRefreshing(true)
        setEmail("")
        setTimeout(() => {
            setIsRefreshing(false)
        }, 1000);
    }

    const submit = async () => {
        setIsLoading(true)
        try {
            
        } catch (error) {
            console.error(error)

        } finally {
            setIsLoading(false)
        }
    }

    if(isRefreshing) return <Loading />

  return (
    <SafeAreaView className="bg-primary h-full">
        <KeyboardAwareScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />} className="h-full px-4" contentContainerStyle={{flexGrow: 1, justifyContent: "space-between", alignItems: "center"}}>
            <View className="w-full flex-1 justify-center">
                <View>
                    <Image 
                        source={images.logoNew}
                        resizeMode='contain' className="h-[100px]"
                    />
                    <Text className="text-white font-psemibold text-xl mt-4 text-center">Forma e rivendosjes se fjalekalimit</Text>
                </View>
                <View className="mt-6">
                    <FormField 
                        title={"Emaili"}
                        placeholder={"Shkruani ketu email adresen tuaj"}
                        keyboardType="email-address"
                        value={email}
                        handleChangeText={(e) => setEmail(e)}
                    />
                    <Text className="text-xs text-gray-400 font-plight mt-1">Ju do te pranoni nje link te posacshem per rivendosjen e fjalekalimit tuaj. Jetegjatesia e linkut eshte 2 ore. Sigurohuni qe linku i marre ne emailin tuaj te mos shperndahet.</Text>
                </View>
                <View className="w-full mt-4">
                    <CustomButton 
                        title={`${isLoading ? "Duke paraqitur..." : "Paraqit kerkesen"}`}
                        handlePress={submit}
                        isLoading={isLoading}
                    />
                </View>
            </View>
            <View className="w-full justify-end">
                <Text className="text-white font-psemibold text-sm">Realizuar nga <Text className="text-secondary">Murrizi Co.</Text></Text>
            </View>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default ForgotPassword