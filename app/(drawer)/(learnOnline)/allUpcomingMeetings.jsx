import { View, Text, FlatList } from 'react-native'
import React from 'react'
import LearnOnlineHeader from '../../../components/LearnOnlineHeader'
import LearnOnlineUpcomingClasses from '../../../components/LearnOnlineUpcomingClasses'

const testArray = [{id:1},{id:2},{id:3}]

const allUpcomingMeetings = () => {

  const inputData = (data) => {
    console.log(data)
  }

  return (
    <View className="flex-1">
        <FlatList
          className="h-full bg-primary"
          contentContainerStyle={{paddingLeft:16, paddingRight:16, gap:16}}
          data={testArray}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <LearnOnlineUpcomingClasses/>
          )}
          ListHeaderComponent={() => (
            <LearnOnlineHeader headerTitle={"Klaset e pritura"} sentInput={inputData}/>
          )}
          ListFooterComponent={() => (
            <View className="my-2"></View>
          )}
        />
    </View>
  )
}

export default allUpcomingMeetings