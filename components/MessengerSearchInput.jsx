import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Platform } from 'react-native'

const MessengerSearchInput = ({sendText}) => {
    const [searchText, setSearchText] = useState("")
  return (
    <View className="flex-1 border-black-200 rounded-md bg-oBlack p-1 border">
      <TextInput 
        value={searchText}
        onChangeText={(e) => setSearchText(e)}
        onSubmitEditing={() => sendText(searchText)}
        placeholder='Kerkoni perdorues...'
        className="p-2 pt-1.5 pb-1 font-plight text-white placeholder:text-gray-400 text-sm underline rounded-md border-black-200"
      />
    </View>
  )
}

export default MessengerSearchInput

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