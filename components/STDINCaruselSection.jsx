import { View, Text, ScrollView, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Platform } from 'react-native';
import OnlineClassesCard from './OnlineClassesCard';
import EmptyState from './EmptyState';
import MeetingCardComponent from './MeetingCardComponent';

const STDINCaruselSection = ({data, sectionType, userData}) => {

  // Return empty view if no data
  if (!data || data?.length === 0) {
    return (
        <>
        <View className="bg-oBlack p-4 m-4 border border-black-200 mt-8" style={styles.box}>
            <EmptyState 
                title={`Nuk ka te dhena per ${sectionType === "courses" ? "Kurse" : sectionType === "students" ? "Studente" : "Takime Online"}`}
                subtitle={"Nese mendoni qe eshte gabim ju lutem rifreskoni dritaren, apo kontaktoni Panelin e Ndihmes"}
                showButton={false}
                titleStyle={"!font-plight"}
                subtitleStyle={"!font-plight !text-xs !-mb-2"}
            />
        </View>
        </>
    ); // or you could return <View /> or a message like <Text>No items to display</Text>
  }

  return (
    <View className="py-4">
      
        <Text className="text-white font-psemibold text-lg px-4">{sectionType === "courses" ? "Kurset" : sectionType === "students" ? "Studentet" : "Takimet Online"}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4"
      >
        {data.map((item) => (
          <View 
            key={item?.id} 
            style={styles.box}
            className="w-[250px] h-fit my-4 bg-oBlack border border-black-200 rounded-xl shadow-sm mr-4 p-4"
          >
            {sectionType === "courses" && (
                <OnlineClassesCard classes={item} userCategories={userData?.data?.categories} viewProfilePlace/>
            )}
            {sectionType === "students" && (
                <View className="bg-oBlack border border-black-200 rounded-md p-4" style={styles.box}>
                    <View className="flex-row gap-2 items-center" style={styles.box}>
                        <View>
                            <Image 
                                source={{uri: item?.profilePictureUrl}}
                                className="size-14 border border-black-200"
                                resizeMode='contain'
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-psemibold text-white" numberOfLines={1}>{item?.name}</Text>
                            <Text className="text-xs font-plight text-gray-400" numberOfLines={1}>{item?.email}</Text>
                            <Text className="text-xs font-plight text-gray-400" numberOfLines={1}>{item?.username}</Text>
                        </View>
                    </View>
                </View>
            )}
            {sectionType === "onlineMeetings" && (
                <MeetingCardComponent item={item} viewProfilePlace={true}/>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default STDINCaruselSection

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
})