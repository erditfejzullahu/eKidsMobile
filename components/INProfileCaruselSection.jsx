import { View, Text, ScrollView, Platform, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import EmptyState from './EmptyState'
import { Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { icons } from '../constants'

const INProfileCaruselSection = ({statistics}) => {
  console.log(statistics, ' statistikat');
  
  const {friends, courses, meetings, students} = statistics
  const router = useRouter();

  const [showSections, setShowSections] = useState(true)
  //TODO: modals for each one of them in click
  if(!statistics) return;
  return (
    <>
    <TouchableOpacity 
      className="rounded-md border border-black-200 h-10 w-10 items-center justify-center bg-primary absolute z-20 left-2 top-0" style={styles.box}
      onPress={() => setShowSections(!showSections)}
    >
      <Image 
        source={showSections ? icons.downArrow : icons.upArrow}
        className="w-6 h-6"
        resizeMode='contain'
        tintColor={"#ff9c01"}
      />
    </TouchableOpacity>
    {!showSections && <View className="h-16"></View>}
    {showSections && <ScrollView horizontal className="flex-row p-4 mt-1 relative" showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-6 flex-1 relative pb-2 pr-4" style={styles.box}>
        {students > 0 ? (
          <TouchableOpacity className="bg-oBlack w-[250px] border rounded-md border-black-200 p-2 pb-1 justify-center">
            <Text className="text-base text-center font-psemibold text-white">Studentet tuaj</Text>
            <Text className="text-center text-secondary font-pblack text-lg">{students}</Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-oBlack w-[250px] border rounded-md border-black-200 p-2 pb-1 justify-center">
            <EmptyState 
              title={"Nuk keni ende studente"}
              titleStyle={"!text-base"}
              subtitleStyle={"!font-plight !text-xs"}
              subtitle={"Mund te terheqni studente duke krijuar kurse/leksione atraktive ose duke shperndare brenda apo jashte apliacionit"}
              showButton={false}
            />
          </View>
        )} 

        {courses > 0 ? (
          <TouchableOpacity className="bg-oBlack w-[250px] border rounded-md border-black-200 p-2 pb-1 justify-center">
            <Text className="text-base text-center font-psemibold text-white">Kurset tuaja</Text>
            <Text className="text-center text-secondary font-pblack text-lg mt-1">{courses} <Text className="text-gray-100 text-sm">{courses === 1 ? "I krijuar" : "Te krijuar"}</Text></Text>
            <Text className="text-gray-100 font-plight text-xs text-center mt-1">Per detaje klikoni mbi dialogun</Text>
          </TouchableOpacity>
        ) : (
          <View className=" bg-oBlack w-[250px] border rounded-md border-black-200 p-2 pb-1 justify-center">
            <EmptyState 
              title={"Nuk keni ende kurse"}
              titleStyle={"!text-base"}
              subtitleStyle={"!font-plight !text-xs"}
              subtitle={"Mund te shtoni duke naviguar tek linqet perkatese ose duke shtypur butonin e meposhtem"}
              showButton={true}
              buttonTitle={"Krijoni kurs"}
              buttonStyle={"!min-h-[45px]"}
              buttonFunction={() => router.replace('/instructor/addCourse')}
            />
          </View>
        )}

        {friends?.length > 0 ? (
          <TouchableOpacity className="bg-oBlack w-[250px] border rounded-md border-black-200 p-2 pb-1 justify-center">
            <Text className="text-base text-center font-psemibold text-white">Miqte tuaj</Text>
            <Text className="text-center text-secondary font-pblack text-lg mt-1">{friends.length} <Text className="text-gray-100 text-sm">{friends.length === 1 ? "Mik" : "Miq"}</Text></Text>
            <Text className="text-gray-100 font-plight text-xs text-center mt-1">Klikoni mbi dialog per te pare listen</Text>
          </TouchableOpacity>
        ) : (
          <View className=" bg-oBlack w-[250px] border rounded-md border-black-200 p-2 pb-1 justify-center">
            <EmptyState 
              title={"Nuk keni ende miq"}
              titleStyle={"!text-base"}
              subtitleStyle={"!font-plight !text-xs"}
              subtitle={"Mund te shtoni miq duke ndervepruar mes komunitetit te ShokuMesimit"}
              buttonTitle={"Lidhuni"}
              buttonStyle={"!min-h-[45px]"}
              buttonFunction={() => router.replace('/all-messages')}
            />
          </View>
        )}

        {meetings > 0 ? (
          <TouchableOpacity className="bg-oBlack w-[250px] border rounded-md border-black-200 p-2 pb-1 justify-center">
            <Text className="text-base text-center font-psemibold text-white">Takimet e krijuara</Text>
            <Text className="text-center text-secondary font-pblack text-lg mt-1">{meetings} <Text className="text-gray-100 text-sm">{meetings === 1 ? "I krijuar" : "Te krijuar"}</Text></Text>
            <Text className="text-gray-100 font-plight text-xs text-center mt-1">Per detaje klikoni mbi dialogun</Text>
          </TouchableOpacity>
        ) : (
          <View className=" bg-oBlack w-[250px] border rounded-md border-black-200 p-2 pb-1 justify-center">
            <EmptyState 
              title={"Nuk keni krijuar ende takime"}
              titleStyle={"!text-base"}
              subtitleStyle={"!font-plight !text-xs"}
              subtitle={"Mund te krijoni takime duke klikuar ne ikonen e (+) ose duke klikuar tek butoni me poshte"}
              buttonTitle={"Krijoni"}
              buttonStyle={"!min-h-[45px]"}
              buttonFunction={() => router.replace('/instructor/addScheduleMeeting')}
            />
          </View>
        )}

        </View>
    </ScrollView>}
    </>
  )
}

export default INProfileCaruselSection

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