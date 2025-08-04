import { View, Text, ScrollView, Image, Alert, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useNavigation } from 'expo-router'
import { CommonActions } from '@react-navigation/native'
import { useColorScheme } from 'nativewind'

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

const SignIn = () => {
  const {colorScheme} = useColorScheme();
  const navigation = useNavigation();
  

  const { setUser, setIsLoggedIn, isLoggedIn } = useGlobalContext();
  const {role, isLoading, refreshRole} = useRole();
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = () => {
    setIsRefreshing(true)
    reset();
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000);
  }

  const successNotifier = useMemo(() => NotifierComponent({
    title: "Sapo u identifikuat me sukses",
    theme: colorScheme
  }), [colorScheme])

  const showNotification = successNotifier.showNotification;

  const errorNotifier = useMemo(() => NotifierComponent({
    alertType: "warning",
    title: "Gabim",
    description: "Dicka shkoi gabim, ju lutem provoni perseri!",
    theme: colorScheme
  }))
  const error = errorNotifier.showNotification;

  const {control, reset, formState: {errors, isSubmitting}, handleSubmit} = useForm({
    resolver: zodResolver(loginUserSchema),
    defaultValues: useMemo(() => ({
      email: "",
      password: ""
    }), []),
    mode: "onTouched"
  })

  const submit = useCallback(async (data) => {
      try {        
        const response = await login(data.email, data.password)
        if(response){
          const userResult = await userDetails();
            setIsLoggedIn(true);
            setUser(userResult)
            showNotification()
            await refreshRole();
        }else{
          error();
        }
      } catch (errorr) {
        console.error(errorr);
        error();
      }
  }, [role])

  useEffect(() => {
    if(isLoggedIn){
      if(["Instructor"].includes(role)){
        navigation.dispatch(CommonActions.reset({
          index: 0, routes: [{name: "instructor/instructorHome"}]
        }))
      }else{
        navigation.dispatch(CommonActions.reset({
          index: 0, routes: [{name: "(drawer)", state: {routes: [{name: "(tabs)", state: {routes: [{name: 'home'}]}}]}}]
        }))
      }
    }
  }, [role, isLoggedIn, navigation])
  
if(isRefreshing) return <Loading />
  return (
    <SafeAreaView className="bg-primary-light dark:bg-primary h-full">
      <KeyboardAwareScrollView style={styles.container}
        refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}
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
          <Text className="text-oBlack dark:text-white font-psemibold text-xl mt-4 text-center">Kyçuni tek Shoku juaj i Mësimit</Text>
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
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Emaili juaj i verifikuar apo emri i perdoruesit. <Text className="text-secondary">Jo EMRI/MBIEMRI JUAJ!</Text></Text>
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
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Fjalekalimi juaj.</Text>
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
            <Text className="text-lg text-gray-700 dark:text-gray-100 font-pregular">
              Nuk keni llogari?
            </Text>
            <Link href="/sign-up" className="text-lg font-semibold text-secondary">Regjistrohuni</Link>
          </View>
          <View className="flex-row items-center gap-1.5 justify-center flex-wrap">
            <Text className="text-lg text-gray-700 dark:text-gray-100 font-pregular">
              Keni harruar fjalekalimin?
            </Text>
            <Link href="/forgot-password" className="text-lg font-semibold text-secondary">Ridrejtohu</Link>
          </View>

        </View>
          </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default SignIn