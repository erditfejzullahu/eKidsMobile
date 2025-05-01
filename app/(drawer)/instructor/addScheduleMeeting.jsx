import { View, Text, RefreshControl, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Platform } from 'react-native'
import DefaultHeader from '../../../components/DefaultHeader'
import FormField from '../../../components/FormField'
import { now } from 'lodash'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import CustomButton from '../../../components/CustomButton'
import Checkbox from 'expo-checkbox'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { meetingSchema } from '../../../schemas/addMeetingSchema'
import NotifierComponent from '../../../components/NotifierComponent'

const addScheduleMeeting = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [nonCourseChecked, setNonCourseChecked] = useState(false)
  const [courseSelected, setCourseSelected] = useState(null)
  
  const onRefresh = () => {
    setIsRefreshing(false)

    setIsRefreshing(true)
  }

  const {control, handleSubmit, reset, trigger, watch, formState: {errors, isSubmitting}} = useForm({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: "",
      scheduledDate: new Date()
    },
    mode: "onTouched"
  })
  const {showNotification: pickCourse} = NotifierComponent({
    title: "Gabim",
    description: "Duhet te zgjidhni nje kurs",
    alertType: "warning"
  })
  const onSubmit = (data) => {
    if(!nonCourseChecked && courseSelected === null){
      pickCourse();
      return;
    }else{

    }
    console.log(data)
  }

  return (
    <KeyboardAwareScrollView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="h-full bg-primary px-4" refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
      <DefaultHeader headerTitle={"Shto nje kohe mesimi"} showBorderBottom={true} bottomSubtitle={"Me ane te ketij seksioni ju mund te shtoni kohe te ndryshme te mesimeve Online. Nga te gjithe kurset ose leksionet egzistuese ju mund te zgjidhni kohen dhe daten e caktuar se kur do mbahet ligjerata. Te gjithe studentet tuaj do njoftohen permes dritareve te tyre perkatese."}/>
      <View className="gap-3 mb-4" style={styles.box}>
        <View>
          <Controller 
            control={control}
            name="title"
            render={({field: {onChange, value}}) => (
              <FormField 
                title={"Titulli i takimit online"}
                placeholder={"P.sh. Emri i leksionit, arsya e takimit etj."}
                value={value}
                handleChangeText={onChange}
              />
            )}
          />
          <Text className="text-xs text-gray-400 font-plight mt-1">Ne baze te ketij emri studentet tuaj mund te identifikojne ligjeraten tuaj.</Text>
          {errors.title && (
            <Text className="text-red-500 text-xs font-plight">{errors.title.message}</Text>
          )}
        </View>
        <View>
          <FormField 
            title={"Pershkrimi i takimit /Opsional"}
            placeholder={"Shkruani ketu pershkrimin e takimit..."}
          />
          <Text className="text-xs text-gray-400 font-plight mt-1">Pershkrim mund te jete, arsya e takimit, permbajtja e takimit, permbajtje mesimore etj.</Text>
        </View>
        <View>
          <Text className="text-base text-gray-100 font-pmedium mb-1.5">Data e takimit</Text>
          <Controller 
            control={control}
            name="scheduledDate"
            render={({field: {onChange, value}}) => (
              <RNDateTimePicker
                  style={{marginLeft: -10}}
                  display="default"
                  value={value}
                  onChange={(event, selectedDate) => {
                    if(selectedDate){
                      onChange(selectedDate)
                    }
                  }}
                  // maximumDate={new Date()}
              />
            )}
          />
          <Text className="text-xs text-gray-400 font-plight mt-1">Ky seksion tregon daten se kur do mbahet takimi (tregohuni konsistent).</Text>
          {errors.scheduledDate && (
            <Text className="text-red-500 text-xs font-plight">{errors.scheduledDate.message}</Text>
          )}
        </View>
        <View>
          <FormField
            title={"Kohezgjatja /Opsionale"}
            placeholder={"Paraqitni kohezgjatjen me minuta..."}
            keyboardType="number-pad"
          />
          <Text className="text-xs text-gray-400 font-plight mt-1">Mund te caktoni cfaredo kohezgjatje qe deshironi. Mjafton te jete me minuta. P.sh 1.5ore = 90min.</Text>
        </View>
        <View>
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-gray-100 font-pmedium mb-1.5">Zgjidhni kursin</Text>
            <TouchableOpacity className="flex-row items-center justify-center gap-1 mb-2" onPress={() => setNonCourseChecked(!nonCourseChecked)}>
              <Checkbox
                value={nonCourseChecked}
                onValueChange={() => setNonCourseChecked(!nonCourseChecked)}
                color={nonCourseChecked ? "#ff9c01" : "#232533"}
                className="mr-2"
                />
                <Text className="text-gray-100 font-pmedium">Takim pa permbajtje</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className={`h-[100px] border-2 border-black-200 rounded-xl ${nonCourseChecked ? "pointer-events-none opacity-30" : ""}`}>
            <TouchableOpacity className="p-3 bg-oBlack border-b border-black-200 rounded-md">
              <Text className="text-white font-psemibold">Kursi 1</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-oBlack border-b border-black-200 rounded-md">
              <Text className="text-white font-psemibold">Kursi 2</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-oBlack border-b border-black-200 rounded-md">
              <Text className="text-white font-psemibold">Kursi 3</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-oBlack border-b border-black-200 rounded-md">
              <Text className="text-white font-psemibold">Kursi 4</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-oBlack border-b border-black-200 rounded-md">
              <Text className="text-white font-psemibold">Kursi 5</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <View className="mb-4" style={styles.box}>
        <CustomButton 
          title={"Paraqitni takimin online"}
          isLoading={isSubmitting}
          handlePress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default addScheduleMeeting

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