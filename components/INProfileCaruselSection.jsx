import { View, Text, ScrollView } from 'react-native'
import React from 'react'

const INProfileCaruselSection = (statistics) => {

  return (
    <ScrollView horizontal>
        {statistics.map((item, idx) => (
            <View key={idx} className="border border-black-200 rounded-md">
                <Text>Statistics</Text>
            </View>
        ))}
    </ScrollView>
  )
}

export default INProfileCaruselSection