import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportSectionSchema } from '../schemas/reportSectionSchema'
import NotifierComponent from './NotifierComponent'
import { Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import * as Animatable from "react-native-animatable"
import FormField from './FormField'
import { TouchableOpacity } from 'react-native'
import * as ImagePicker from "expo-image-picker"
import CustomButton from './CustomButton'

const ReportForm = ({onSuccess, availableTickets = []}) => {
    
    const {control, handleSubmit, watch, trigger, reset, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(reportSectionSchema),
        defaultValues: {
            issueType: 13,
            description: "",
            image: "",
            otherTopic: "",
        },
        mode: "onTouched"
    })

    const selectedTopic = watch("issueType");

    const {showNotification: success} = NotifierComponent({
        title: "Sukses",
        description: "Raportimi juaj shkoj me sukses. Do te njoftoheni ne emailin tuaj sa me shpejt qe eshte e mundur.",
    })

    const {showNotification: error} = NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim. Ju lutem provoni perseri!",
        alertType: "warning"
    })

    const submitReport = (data) => {
        console.log(data)

        setTimeout(() => {
            onSuccess()
        }, 1000);
    }

    const {showNotification: requestPermission} = NotifierComponent({
        tite: "Dicka shkoi gabim!",
        description: "Na nevojitet akses ne librarine e fotove tuaja.",
        alertType: "warning"
    })

    const pickImage = async (onChange) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(permission.granted === false){
            requestPermission();
            return;
        }
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0,
            aspect: [4,3],
            allowsEditing: true,
            base64: true
        })

        if(!image.canceled){
            let base64 =  `data:${image.assets[0].mimeType};base64,${image.assets[0].base64}`
            onChange(base64)
        }
    }

  return (
    <View className="gap-3" style={styles.box}>
      <View>
        <Controller 
            control={control}
            name="issueType"
            render={({field: {onChange, value}}) => (
                <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    placeholder={{ label: "Zgjidhni kategorine e problemit", value: '' }}
                    style={pickerSelectStyles}
                    itemStyle={{color: "#fff", fontFamily: "Poppins-Regular"}}
                    >
                    {availableTickets.map((item) => (
                        <Picker.Item label={item.ticketTitle} key={item.id} value={item.id} />
                    ))}
                </Picker>
            )}
        />
        <Text className="text-xs text-gray-400 font-plight mt-1">Zgjidh nje nga rubrikat me larte.</Text>
        {errors.issueType && (
            <Text className="text-red-500 font-plight text-xs">{errors.issueType.message}</Text>
        )}
      </View>
      {selectedTopic === 25 && (<Animatable.View animation={"fadeInLeft"}>
            <Controller 
                control={control}
                name="otherTopic"
                render={({field: {onChange, value}}) => (
                    <FormField
                        title={"Zgjidhni raportimin tjeter"}
                        value={value}
                        handleChangeText={onChange}
                        placeholder={"P.sh. Raportim ne lidhje me..."}
                    />
                )}
            />
            <Text className="text-xs text-gray-400 font-plight mt-1">Shkruani raportimin tjeter.</Text>
            {errors.otherTopic && (
                <Text className="text-red-500 font-plight text-xs">{errors.otherTopic.message}</Text>
            )}
        </Animatable.View>)}

        {(selectedTopic === String(17) || selectedTopic === String(16)) && (
            <Controller 

            />
        )}
        <View>
            <Controller 
                name="description"
                control={control}
                render={({field: {onChange, value}}) => (
                    <FormField 
                        title={"Pershkrimi i raportimit"}
                        value={value}
                        handleChangeText={onChange}
                        placeholder={"P.sh. Arsyja e raportimit eshte..."}
                    />
                )}
            />
            <Text className="text-xs text-gray-400 font-plight mt-1">Pershkruani raportimin e problemit ose te ndonje perdoruesi.</Text>
            {errors.otherTopic && (
                <Text className="text-red-500 font-plight text-xs">{errors.otherTopic.message}</Text>
            )}
        </View>
        <View>
            <Controller 
                control={control}
                name="image"
                render={({field: {value, onChange}}) => (
                    <>
                        <Text className={`text-base text-gray-100 font-pmedium mb-2`}>Paraqitni imazhin /Opsionale</Text>
                        <TouchableOpacity className="bg-oBlack border-2 border-black-200 rounded-xl py-3" onPress={() => pickImage(onChange)}>
                            <Text className="text-white text-center font-psemibold ">{value ? "Ndrysho imazhin" : "Zgjidh imazhin"}</Text>
                        </TouchableOpacity>
                        {value ? (
                            <View className="border mt-2 rounded-xl border-black-200 max-h-[200px]" style={styles.box}>
                                <Image
                                    source={{uri: value}}
                                    className="w-full h-full"
                                    resizeMode='contain'
                                />
                            </View>
                        ) : null}
                    </>
                )}
            />
            <Text className="text-xs text-gray-400 font-plight mt-1">Per vleresim me te mire te raportimit tuaj paraqitni screenshots(SC) te problemit/raportimit.</Text>
            {errors.image && (
                <Text className="text-red-500 font-plight text-xs">{errors.image.message}</Text>
            )}
        </View>
        <View>
            <CustomButton 
                title={`${isSubmitting ? "Duke u derguar" : "Dergoni"}`}
                isLoading={isSubmitting}
                handlePress={handleSubmit(submitReport)}
            />
        </View>
    </View>
  )
}

export default ReportForm

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