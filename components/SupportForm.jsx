import { View, Text, Image, TouchableOpacity } from 'react-native'
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
import * as Animatable from "react-native-animatable"
import * as ImagePicker from "expo-image-picker"
import { currentUserID } from '../services/authService'
import { CreateSupportReportTicket } from '../services/fetchingService'
import { useColorScheme } from 'nativewind'
import { useShadowStyles } from '../hooks/useShadowStyles'
import * as Linking from "expo-linking"

const SupportForm = ({onSuccess, availableTickets = []}) => {
    const {colorScheme} = useColorScheme();
    const {shadowStyle} = useShadowStyles();
    const {control, handleSubmit, reset, trigger, watch, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(supportSectionSchema),
        defaultValues: {
            subject: '',
            description: '',
            topicType: 1,
            otherTopic: '',
            image: ""
        },
        mode: "onTouched"
    })



    const selectedTopic = watch("topicType");

    const {showNotification: success} = NotifierComponent({
        title: "Sukses",
        description: "Kerkesa shkoj me sukses. Do te njoftoheni ne emailin tuaj sa me shpejt qe eshte e mundur.",
        theme: colorScheme
    })

    const {showNotification: error} = NotifierComponent({
        title: "Gabim",
        description: "Dicka shkoi gabim. Ju lutem provoni perseri!",
        alertType: "warning",
        theme: colorScheme
    })

    const {showNotification: permissionNotification} = NotifierComponent({
        title: "Nevojitet leje!",
        description: "Klikoni per te shtuar lejet e posacshme",
        alertType: "warning",
        onPressFunc: () => Linking.openSettings(),
        theme: colorScheme
    })

    const pickImage = async (onChange) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(permission.granted === false){
            permissionNotification();
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

    const submitSupport = async (data) => {
        const userId = await currentUserID()
        const payload = {
            availableTicketId: data.topicType,
            ticketCreatorUserId: userId,
            reportedUserId: null,
            otherMessage: data.otherTopic,
            image: data.image
        }
        const response = await CreateSupportReportTicket(payload);
        if(response === 200){
            success()
            onSuccess()
        }else{
            error();
        }
    }

  return (
    <View className="gap-3" style={shadowStyle}>
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
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Subjekti i paraqitur ne kete forme, do vije ne email si titull emaili.</Text>
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
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Pershkrim mund te jete ecuria se si shkuat deri ne ate faze ku nuk mund te ndihmoheshit vetem ne aplikacion.</Text>
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
                        placeholder={{ label: "Zgjidhni kategorine e ndihmes", value: '' }}
                        style={pickerSelectStyles}
                        itemStyle={{color: colorScheme === "dark" ? "#fff" : "#13131a", fontFamily: "Poppins-Regular"}}
                    >
                        {availableTickets.map((item) => (
                            <Picker.Item key={item.id} label={item.ticketTitle} value={item.id} />
                        ))}
                    </Picker>
                )}
            />
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Zgjidh nje nga rubrikat me larte.</Text>
            {errors.topicType && (
                <Text className="text-red-500 font-plight text-xs">{errors.topicType.message}</Text>
            )}
        </View>

        {selectedTopic === 12 && (<Animatable.View animation={"fadeInLeft"}>
            <Controller 
                control={control}
                name="otherTopic"
                render={({field: {onChange, value}}) => (
                    <FormField 
                        title={"Zgjidhni temen tjeter"}
                        value={value}
                        handleChangeText={onChange}
                        placeholder={"P.sh. Ndihme ne ..."}
                    />
                )}
            />
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Shkruani tematiken tjeter.</Text>
            {errors.otherTopic && (
                <Text className="text-red-500 font-plight text-xs">{errors.otherTopic.message}</Text>
            )}
        </Animatable.View>)}
        <View>
            <Controller 
                control={control}
                name="image"
                render={({field: {value, onChange}}) => (
                    <>
                        <Text className={`text-base text-gray-700 dark:text-gray-100 font-pmedium mb-2`}>Paraqitni imazhin /Opsionale</Text>
                        <TouchableOpacity className="bg-oBlack border-2 border-gray-200 dark:border-black-200 rounded-xl py-3" onPress={() => pickImage(onChange)}>
                            <Text className="text-white text-center font-psemibold ">{value ? "Ndrysho imazhin" : "Zgjidh imazhin"}</Text>
                        </TouchableOpacity>
                        {value ? (
                            <View className="border mt-2 rounded-xl border-gray-200 dark:border-black-200 max-h-[200px]" style={shadowStyle}>
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
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-plight mt-1">Per vleresim me te mire te raportimit tuaj paraqitni screenshots(SC) te problemit/raportimit.</Text>
            {errors.image && (
                <Text className="text-red-500 font-plight text-xs">{errors.image.message}</Text>
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