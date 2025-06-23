import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import * as Animatable from "react-native-animatable"

const MessengerSearchInput = ({sendText}) => {
    const [searchText, setSearchText] = useState("")
  return (
    <Animatable.View animation={"fadeInLeft"} easing={"ease-in-out"} duration={500} className="flex-1 border-white dark:border-black-200 rounded-md bg-oBlack-light dark:bg-oBlack p-1 border">
      <TextInput 
        value={searchText}
        onChangeText={(e) => setSearchText(e)}
        onSubmitEditing={() => sendText(searchText)}
        placeholder='Kerkoni perdorues...'
        className="p-2 pt-1.5 pb-1 font-plight text-oBlack placeholder:text-gray-400 dark:placeholder:text-gray-700 dark:text-white text-sm underline rounded-md border-gray-200 dark:border-black-200"
      />
    </Animatable.View>
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