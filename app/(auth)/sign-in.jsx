import { View, Text, ScrollView, Image, Alert, StyleSheet } from 'react-native'
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
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  

  const submit = async () => {
    if(!form.email || !form.password){
      alertNotification()
    }else{
      setIsSubmitting(true);
      try {        
        const response = await login(form.email, form.password)
        if(response){
          const userResult = await userDetails();
            setIsLoggedIn(true);
            setUser(userResult)
            showNotification()
            await refreshRole();
            if(!isLoading){
              if(['Admin', 'Instructor'].includes(role)){
                router.replace('/home')
              }else{
                router.replace('/instructor/instructorHome')
              }
            }
        }else{
          error();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
      <KeyboardAwareScrollView style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true} // Ensures Android support
      extraScrollHeight={50} // Adjust the scroll height when the keyboard is open
      keyboardShouldPersistTaps="handled"
      >
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logoNew}
            resizeMode='contain' className="h-[100px] mb-10"
          />
          <Text className="text-white font-psemibold text-xl mt-4">Kyçuni tek Shoku juaj i Mësimit</Text>
          <FormField 
            title="Emaili i përdoruesit"
            value={form.email}
            placeholder="Shkruani emailin e përdoruesit"
            handleChangeText={(e) => setForm({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Fjalëkalimi"
            value={form.password}
            placeholder="Shkruani fjalëkalimin tuaj"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton 
            title="Kyçuni"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Nuk keni llogari?
            </Text>
            <Link href="/sign-up" className="text-lg font-semibold text-secondary">Regjistrohuni</Link>
          </View>

        </View>
          </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn