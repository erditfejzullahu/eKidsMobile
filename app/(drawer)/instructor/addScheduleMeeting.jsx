import { View, Text, RefreshControl, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { icons, images } from '../../../constants'
import { useRouter } from 'expo-router'
import * as Animatable from "react-native-animatable"
import useFetchFunction from "../../../hooks/useFetchFunction"
import { InstructorCreatedCourses } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'

const AddScheduleMeeting = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {data, isLoading, refetch} = useFetchFunction(InstructorCreatedCourses);

  const [nonCourseChecked, setNonCourseChecked] = useState(false)
  const [courseSelected, setCourseSelected] = useState(null)

  const [coursesData, setCoursesData] = useState([])
  
  const onRefresh = () => {
    setIsRefreshing(false)

    setCourseSelected(null)
    setNonCourseChecked(false)
    reset();
    refetch()
    setIsRefreshing(true)
  }

  useEffect(() => {
    if(nonCourseChecked){
      setCourseSelected(null)
    }
  }, [nonCourseChecked])
  

  useEffect(() => {
    console.log(data);
    
    setCoursesData(data || [])
  }, [data])
  

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

  const {showNotification: errorMeeting} = NotifierComponent({
    title: "Gabim",
    description: "Dicka shkoi gabim ne krijimin e mledhjes online. Ju lutem provoni perseri!",
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
if(isLoading || isRefreshing) return <Loading />
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
            {coursesData.length > 0 ? (
              (coursesData.map((item) => (
                <TouchableOpacity onPress={() => setCourseSelected(item.id)} key={item.id} className={`p-3 bg-oBlack border-b border-black-200 rounded-md ${courseSelected === item.id ? "flex-row items-center justify-between" : ""}`}>
                  <Text className={`font-psemibold ${courseSelected === item.id ? "text-secondary" : "text-white"}`}>{item.name}</Text>
                  {courseSelected === item.id && (
                    <Image 
                      source={icons.tick}
                      className="size-6"
                      tintColor={"#FF9C01"}
                      resizeMode='contain'
                    />
                  )}
                </TouchableOpacity>
              )))
              ) : (
                <TouchableOpacity onPress={() => router.replace('/instructor/addCourse')}>
                  <Animatable.View 
                    className="flex-col gap-2 items-center justify-center h-[95px] m-auto"
                    animation="pulse" iterationCount="infinite" duration={1000}>
                    <Image
                      source={images.breakHeart}
                      className="size-10"
                      resizeMode='contain'
                      tintColor={"#ff9c01"}
                    />
                    <Text className="text-white font-psemibold text-sm">Ju nuk keni kurse ende</Text>
                  </Animatable.View>
                </TouchableOpacity>
              )}
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

export default AddScheduleMeeting

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