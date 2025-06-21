import { View, Text, ScrollView, Image, StyleSheet, Alert, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
// import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { login, register } from '../../services/authService'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NotifierComponent from '../../components/NotifierComponent'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerUserSchema } from '../../schemas/registerUserSchema'
import Loading from '../../components/Loading'
import { useRole } from '../../navigation/RoleProvider'
import { userDetails } from '../../services/necessaryDetails'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useColorScheme } from 'nativewind'

const SignUp = () => {
  const {colorScheme} = useColorScheme();
  const {role, isLoading, refreshRole} = useRole();
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { setUser, setIsLoggedIn } = useGlobalContext();
  
  const {control, handleSubmit, reset, trigger, watch, formState: {errors, isSubmitting}} = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: "",
      username: "",
      firstname: "",
      lastname: "",
      password: "",
      age: 13,
      role: "student"
    },
    mode: "onTouched"
  })
  
  const {showNotification: errorr} = NotifierComponent({
    title: "Gabim",
    description: "Dicka shkoi gabim, ju lutem provoni perseri",
    alertType: "warning",
    theme: colorScheme
  })
  
  const {showNotification: success} = NotifierComponent({
    title: "Sukses",
    description: "Sapo, u regjistruat me sukses, tani do te ridrejtoheni!",
    theme: colorScheme
  })
  
  const onRefresh = () => {
    setIsRefreshing(true)
    reset();
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000);
  }

  const submit = async (data) => {
    try {
      const response = await register(data)
      if(response.data === "me kqyr responsin"){
        success()
        const loginResponse = await login(data.email, data.password)
        if(loginResponse){
          const userResult = await userDetails();
          setIsLoggedIn(true)
          setUser(userResult)
          if(!isLoading){
            if(['Instructor'].includes(role)){
              router.replace('/instructor/instructorHome')
            }else{
              router.replace('/home')
            }
          }
        }else{
          errorr();
        }
      }
    } catch (error) {
      console.error(error)
      errorr();
    }
  }
if(isRefreshing) return <Loading />
  return (
    <SafeAreaView className="bg-primary-light dark:bg-primary h-full">
        <KeyboardAwareScrollView
          refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}
          className="my-6"
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true} // Ensures Android support
          extraScrollHeight={50} // Adjust the scroll height when the keyboard is open
          keyboardShouldPersistTaps="handled"
        >
        <View className="w-full justify-center h-full px-4">
          <View className="mb-4">
            <Image 
              source={images.logoNew}
              resizeMode="contain" className="h-[100px] items-center justify-center m-auto"
            />
            <Text className="text-oBlack dark:text-white text-center font-pbold text-xl mt-4">
              Regjistrohuni falas tek
            </Text>
            <Text className="text-secondary text-center font-pbold text-xl">
              Shoku juaj i Mësimit
            </Text>
          </View>
          <View className="gap-3">
            <View>
              <Controller 
                control={control}
                name="firstname"
                render={({field: {onChange, value}}) => (
                  <FormField 
                    title="Emri juaj"
                    value={value}
                    placeholder="Shkruani emrin tuaj këtu"
                    handleChangeText={onChange}
                  />
                )}
              />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Shkruani emrin tuaj valid.</Text>
              {errors.firstname && (
                <Text className="text-red-500 text-xs font-plight">{errors.firstname.message}</Text>
              )}
            </View>
            <View>
              <Controller 
                control={control}
                name="lastname"
                render={({field: {onChange, value}}) => (
                  <FormField 
                    title="Mbiemri juaj"
                    value={value}
                    placeholder="Shkruani mbiemrin tuaj këtu"
                    handleChangeText={onChange}
                  />
                )}
              />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Shkruani mbiemrin tuaj valid.</Text>
              {errors.lastname && (
                <Text className="text-red-500 text-xs font-plight">{errors.lastname.message}</Text>
              )}
            </View>
            <View>
              <Controller 
                control={control}
                name="email"
                render={({field: {onChange, value}}) => (
                  <FormField 
                    title="Emaili juaj"
                    value={value}
                    placeholder="Shkruani emailin tuaj këtu"
                    handleChangeText={onChange}
                    keyboardType="email-address"
                  />
                )}
              />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Paraqisni nje email valid, per shkak se ky email do perdoret per verifikim dhe kycje te llogarise suaj.</Text>
              {errors.email && (
                <Text className="text-red-500 text-xs font-plight">{errors.email.message}</Text>
              )}
            </View>
            <View>
              <Controller 
                control={control}
                name="username"
                render={({field: {onChange, value}}) => (
                  <FormField 
                    title="Emri i perdoruesit"
                    value={value}
                    placeholder="Shkruani emrin tuaj te preferuar"
                    handleChangeText={onChange}
                  />
                )}
              />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Shkruani nje emer tuaj te preferuar per qasje te shpejte.</Text>
              {errors.username && (
                <Text className="text-red-500 text-xs font-plight">{errors.username.message}</Text>
              )}
            </View>
            <View>
              <Controller 
                control={control}
                name="age"
                render={({field: {onChange, value}}) => (
                  <FormField 
                    title="Mosha juaj"
                    value={value.toString()}
                    placeholder="Paraqitni moshën tuaj këtu"
                    handleChangeText={onChange}
                    keyboardType="number-pad"
                  />
                )}
              />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Paraqisni moshen tuaj aktuale.</Text>
              {errors.age && (
                <Text className="text-red-500 text-xs font-plight">{errors.age.message}</Text>
              )}
            </View>
            <View>
              <Text className="text-base text-gray-700 dark:text-gray-100 font-pmedium">Roli juaj</Text>
              <Controller 
                control={control}
                name="role"
                render={({field: {onChange, value}}) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={
                      (value) => onChange(value)
                    }
                    placeholder={{ label: "Zgjidhni rolin tuaj", value: '' }}
                    style={pickerSelectStyles}
                    itemStyle={{color: colorScheme === "dark" ? "#fff" : "#13131a", fontFamily: "Poppins-Regular"}}
                  >
                      <Picker.Item label="Student" value="student" />
                      <Picker.Item label="Instruktor" value="instructor" />
                  </Picker>
                )}
              />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Zgjidhni rolin tuaj ne mes te Studentit dhe Instruktorit. Nese zgjidhni rolin Student, ju mund te beni aplikimin per Instruktor.</Text>
              {errors.role && (
                <Text className="text-red-500 text-xs font-plight">{errors.role.message}</Text>
              )}
            </View>
            {/* <Picker 
              onValueChange={
                (value) => setForm({...form, role: value})
              }
              items={[
                { label: 'Student', value: 'student' },
                { label: 'Prind', value: 'prind' },
              ]}
              placeholder={{ label: "Zgjidhni rolin tuaj", value: '' }}
              style={pickerSelectStyles}
            /> */}
            <View>
              <CustomButton 
                title={`${isSubmitting ? "Duke aplikuar" : "Regjistrohuni"}`}
                handlePress={handleSubmit(submit)}
                containerStyles="mb-4"
                isLoading={isSubmitting}
              />
            </View>
          </View>
          <View className="justify-center items-center flex-row gap-2 mb-2">
          <Text className="text-lg text-gray-700 dark:text-gray-100 font-pregular">
            Keni llogari?
          </Text>
          <Link href="/sign-in" className="text-lg font-semibold text-secondary">Kyçuni</Link>
          </View>

        </View>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'rgb(35 37 51)',
    borderRadius: 16,
    marginTop:7,
    color: 'rgba(255,255,255)',
    paddingLeft: 16,
    height:64,
    backgroundColor:'rgb(30 30 45)',
    fontWeight:'700'
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'rgb(35 37 51)',
    borderRadius: 16,
    marginTop:7,
    color: 'rgba(255,255,255)',
    paddingLeft: 16,
    height:64,
    backgroundColor:'rgb(30 30 45)',
    fontWeight:'700'
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default SignUp