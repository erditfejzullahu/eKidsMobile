import { View, Text, ScrollView, Platform, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import EmptyState from './EmptyState'
import { Dimensions } from 'react-native'
import { useRouter } from 'expo-router'

const INProfileCaruselSection = ({statistics}) => {
  const router = useRouter();
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [friends, setFriends] = useState([])

    const { width: screenWidth } = Dimensions.get('window');

  return (
    <ScrollView horizontal className="flex-row p-4 mt-3">
      <View className="flex-row gap-6 flex-1 relative pb-2 pr-4" style={styles.box}>
        {students.length > 0 ? (
          students.map((item, idx) => (
            <View key={idx} className="p-4 bg-oBlack">
              <Text>test</Text>
            </View>
          ))
        ) : (
          <View className=" bg-oBlack w-[250px] border rounded-md border-black-200 p-2 pb-1 justify-center">
            <EmptyState 
              title={"Nuk keni ende studente"}
              titleStyle={"!text-base"}
              subtitleStyle={"!font-plight !text-xs"}
              subtitle={"Mund te shtoni studente duke krijuar kurse/leksione atraktive ose duke shperndare brenda apo jashte apliacionit"}
              showButton={false}
            />
          </View>
        )} 

        {courses.length > 0 ? (
          students.map((item, idx) => (
            <View key={idx} className="p-4 bg-oBlack">
              <Text>test</Text>
            </View>
          ))
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
              buttonFunction={() => router.replace('/instructor/addScheduleMeeting')}
            />
          </View>
        )}

        {friends.length > 0 ? (
          students.map((item, idx) => (
            <View key={idx} className="p-4 bg-oBlack">
              <Text>test</Text>
            </View>
          ))
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
        </View>
    </ScrollView>
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