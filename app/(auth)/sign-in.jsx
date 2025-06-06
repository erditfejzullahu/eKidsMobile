import { View, Text, ScrollView, Image, Alert, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import {images} from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { login } from '../../services/authService'
import { useGlobalContext } from '../../context/GlobalProvider'
import { userDetails } from '../../services/necessaryDetails'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NotifierComponent from '../../components/NotifierComponent'
import { useRole } from '../../navigation/RoleProvider'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginUserSchema } from '../../schemas/registerUserSchema'
import Loading from '../../components/Loading'

const SignIn = () => {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
  });

  const { setUser, setIsLoggedIn } = useGlobalContext();
  const {role, isLoading, refreshRole} = useRole();
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = () => {
    setIsRefreshing(true)
    reset();
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000);
  }

  const {showNotification} = NotifierComponent({
    title: "Sapo u identifikuat me sukses"
  })

  const {showNotification: alertNotification} = NotifierComponent({
    alertType: "warning",
    title: "Ju lutem mbushni të fushat e kërkuara!"
  })

  const {showNotification: error} = NotifierComponent({
    alertType: "warning",
    title: "Gabim",
    description: "Dicka shkoi gabim, ju lutem provoni perseri!"
  })

  const {control, reset, formState: {errors, isSubmitting}, handleSubmit} = useForm({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onTouched"
  })

  const submit = async (data) => {
      try {        
        const response = await login(data.email, data.password)
        if(response){
          const userResult = await userDetails();
            setIsLoggedIn(true);
            setUser(userResult)
            showNotification()
            await refreshRole();
            if(!isLoading){
              if(['Instructor'].includes(role)){
                router.replace('/instructor/instructorHome')
              }else{
                router.replace('/home')
              }
            }
        }else{
          error();
        }
      } catch (errorr) {
        console.error(errorr);
        error();
      }
  }
if(isRefreshing) return <Loading />
  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAwareScrollView style={styles.container}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true} // Ensures Android support
        extraScrollHeight={50} // Adjust the scroll height when the keyboard is open
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logoNew}
            resizeMode='contain' className="h-[100px]"
          />
          <Text className="text-white font-psemibold text-xl mt-4 text-center">Kyçuni tek Shoku juaj i Mësimit</Text>
          <View className="gap-3 mt-6">
            <View>
              <Controller 
                control={control}
                name="email"
                render={({field: {onChange, value}}) => (
                  <FormField 
                    title="Emaili/Emri i perdoruesit"
                    value={value}
                    placeholder="Shkruani emailin/emrin e përdoruesit"
                    handleChangeText={onChange}
                    keyboardType="email-address"
                  />
                )}
              />
              <Text className="text-xs text-gray-400 font-plight mt-1">Emaili juaj i verifikuar apo emri i perdoruesit. <Text className="text-secondary">Jo EMRI/MBIEMRI JUAJ!</Text></Text>
              {errors.email && (
                <Text className="text-red-500 text-xs font-plight">{errors.email.message}</Text>
              )}
            </View>
            <View>
              <Controller 
                control={control}
                name="password"
                render={({field: {onChange, value}}) => (
                  <FormField
                    title="Fjalëkalimi"
                    value={value}
                    placeholder="Shkruani fjalëkalimin tuaj"
                    handleChangeText={onChange}
                  />
                )}
              />
              <Text className="text-xs text-gray-400 font-plight mt-1">Fjalekalimi juaj.</Text>
              {errors.password && (
                <Text className="text-red-500 text-xs font-plight">{errors.password.message}</Text>
              )}
            </View>
            <View>
              <CustomButton 
                title={`${isSubmitting ? "Duke u kycur" : "Kycuni"}`}
                handlePress={handleSubmit(submit)}                
                isLoading={isSubmitting}
              />
            </View>
          </View>
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Nuk keni llogari?
            </Text>
            <Link href="/sign-up" className="text-lg font-semibold text-secondary">Regjistrohuni</Link>
          </View>
          <View>
            <Link href="/forgot-password" className="text-secondary font-semibold text-center underline">Keni harruar fjalekalimin?</Link>
          </View>

        </View>
          </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default SignIn