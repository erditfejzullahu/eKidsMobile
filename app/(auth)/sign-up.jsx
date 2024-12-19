import { View, Text, ScrollView, Image, StyleSheet, Alert } from 'react-native'
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

const {showNotification} = NotifierComponent({
  title: "Ju lutem mbushni të gjitha fushat!",
  alertType: "warning"
})

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    age: '',
    role: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const submit = async () => {
    if(!form.email || !form.username || !form.firstname || !form.lastname || !form.password || !form.age || !form.role){
      showNotification();
    }else{
      try {
        setIsLoading(true);
        const response = await register(
          form.email, 
          form.username, 
          form.firstname, 
          form.lastname,
          form.password,
          form.age,
          form.role
        )
        console.log(response.data);
        if(response.data === 'me kqyr qysh ekom lon'){
          const loginReq = await login(form.email, form.password)
          console.log(loginReq.data)
          if(loginReq){
            router.replace('/home')
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="my-6">
        <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true} // Ensures Android support
        extraScrollHeight={50} // Adjust the scroll height when the keyboard is open
        keyboardShouldPersistTaps="handled"
        >
        <View className="w-full justify-center h-full px-4">
          <Image 
            source={images.logoNew}
            resizeMode="contain" className="h-[100px] items-center justify-center m-auto"
          />
          <Text className="text-white text-center font-pblack text-xl mt-4">
            Regjistrohuni falas tek
          </Text>
          <Text className="text-secondary text-center font-pblack text-xl">
            Shoku juaj i Mësimit
          </Text>
          <FormField 
            title="Emri juaj"
            value={form.firstname}
            placeholder="Shkruani emrin tuaj këtu"
            handleChangeText={(e) => setForm({ ...form, firstname: e })}
            otherStyles="mt-7"
          />
          <FormField 
            title="Mbiemri juaj"
            value={form.lastname}
            placeholder="Shkruani mbiemrin tuaj këtu"
            handleChangeText={(e) => setForm({ ...form, lastname: e })}
            otherStyles="mt-7"
          />
          <FormField 
            title="Emaili juaj"
            value={form.email}
            placeholder="Shkruani emailin tuaj këtu"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField 
            title="Nofka juaj"
            value={form.username}
            placeholder="Shkruani nofkën tuaj këtu"
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
          />
          <FormField 
            title="Mosha juaj"
            value={form.age}
            placeholder="Paraqitni moshën tuaj këtu"
            handleChangeText={(e) => setForm({ ...form, age: e })}
            otherStyles="mt-7"
            keyboardType="number-pad"
          />
          <Text className="mt-7 text-base text-gray-100 font-pmedium">Roli juaj</Text>
          <Picker
            selectedValue={form.category}
            onValueChange={
              (value) => setForm({ ...form, category: value })
            }
            placeholder={{ label: "Zgjidhni ne cilen kategori futet kuizi juaj", value: '' }}
            style={pickerSelectStyles}
            itemStyle={{color: "#fff", fontFamily: "Poppins-Regular"}}
          >
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Prind" value="prind" />
          </Picker>
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
          <CustomButton 
            title="Regjistrohuni"
            handlePress={submit}
            containerStyles="mt-7 mb-4"
            isLoading={isLoading}
          />
          <View className="justify-center items-center flex-row gap-2 mb-2">
          <Text className="text-lg text-gray-100 font-pregular">
            Keni llogari?
          </Text>
          <Link href="/sign-in" className="text-lg font-semibold text-secondary">Kyçuni</Link>
          </View>

        </View>
        </KeyboardAwareScrollView>
      </ScrollView>
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