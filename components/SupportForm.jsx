import { View, Text } from 'react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supportSectionSchema } from '../schemas/supportSectionSchema'
import NotifierComponent from './NotifierComponent'
import { StyleSheet } from 'react-native'
import { Platform } from 'react-native'
import FormField from './FormField'
import { Picker } from '@react-native-picker/picker'
import CustomButton from './CustomButton'
const SupportForm = ({onSuccess}) => {

    const {control, handleSubmit, reset, trigger, watch, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(supportSectionSchema),
        defaultValues: {
            subject: '',
            description: '',
            topicType: "Ndihme_Navigimi"
        },
        mode: "onTouched"
    })

    const {showNotification: success} = NotifierComponent({
        title: "Sukses",
        description: "Kerkesa shkoj me sukses. Do te njoftoheni ne emailin tuaj sa me shpejt qe eshte e mundur.",
    })

    const {showNotification: error} = NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim. Ju lutem provoni perseri!",
        alertType: "warning"
    })

    const submitSupport = (data) => {
        console.log(data);

        setTimeout(() => {
            onSuccess()
        }, 1000);
    }

  return (
    <View className="gap-3" style={styles.box}>
        <View>
            <Controller 
                control={control}
                name="subject"
                render={({field: {onChange, value}}) => (
                    <FormField 
                        title={"Titulli i subjektit(Kerkeses)"}
                        placeholder={"P.sh. Ndihmese ne ..."}  
                        value={value}
                        handleChangeText={onChange}
                    />
                )}
            />
            <Text className="text-xs text-gray-400 font-plight mt-1">Subjekti i paraqitur ne kete forme, do vije ne email si titull emaili.</Text>
            {errors.subject && (
                <Text className="text-red-500 text-xs font-plight">{errors.subject.message}</Text>
            )}
        </View>
        <View>
            <Controller 
                control={control}
                name="description"
                render={({field: {onChange, value}}) => (
                    <FormField 
                        title={"Pershkrimi i kerkeses tuaj /Opsional"}
                        placeholder={"P.sh. Ecuria qe te shtyu per te bere kete kerkese ndihmese"}  
                        value={value}
                        handleChangeText={onChange}
                    />
                )}
            />
            <Text className="text-xs text-gray-400 font-plight mt-1">Pershkrim mund te jete ecuria se si shkuat deri ne ate faze ku nuk mund te ndihmoheshit vetem ne aplikacion.</Text>
            {errors.description && (
                <Text className="text-red-500 text-xs font-plight">{errors.description.message}</Text>
            )}
        </View>
        <View>
            <Controller 
                control={control}
                name="topicType"
                render={({field: {onChange, value}}) => (
                    <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        placeholder={{ label: "Zgjidhni ne cilen kategori futet kuizi juaj", value: '' }}
                        style={pickerSelectStyles}
                        itemStyle={{color: "#fff", fontFamily: "Poppins-Regular"}}
                    >
                        <Picker.Item label="Ndihme navigimi" value="Ndihme_Navigimi" />
                        <Picker.Item label="Ndihme ngarkimi" value="Ndihme_Ngarkimi" />
                        <Picker.Item label="Ndihme kuizi" value="Ndihme_Kuizi" />
                        <Picker.Item label="Ndihme diskutimi" value="Ndihme_Diskutimi" />
                        <Picker.Item label="Ndihme blogu" value="Ndihme_Blogu" />
                        <Picker.Item label="Ndihme mesimi online" value="Ndihme_Mesimi_Online" />
                        <Picker.Item label="Ndihme kursi" value="Ndihme_Kursi" />
                        <Picker.Item label="Ndihme leksioni" value="Ndihme_Leksioni" />
                        <Picker.Item label="Ndihme komenti" value="Ndihme_Komenti" />
                        <Picker.Item label="Ndihme komunikimi" value="Ndihme_Komunikimi" />
                        <Picker.Item label="Ndihme profili" value="Ndihme_Profili" />
                        <Picker.Item label="Tjeter" value="tjeter" />
                    </Picker>
                )}
            />
            <Text className="text-xs text-gray-400 font-plight mt-1">Zgjidh nje nga rubrikat me larte.</Text>
            {errors.topicType && (
                <Text className="text-red-500 font-plight text-xs">{errors.topicType.message}</Text>
            )}
        </View>
        <View>
            <CustomButton 
                title={`${isSubmitting ? "Duke u derguar" : "Dergoni"}`}
                isLoading={isSubmitting}
                handlePress={handleSubmit(submitSupport)}
            />
        </View>
    </View>
  )
}

export default SupportForm

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
    box: {
      ...Platform.select({
          ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
      })
  },
  });