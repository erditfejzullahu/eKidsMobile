import { View, Text, ScrollView, TouchableOpacity, Button, FlatList, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useState } from 'react'
import AddBlogComponent from '../../../../components/AddBlogComponent'
import { useGlobalContext } from '../../../../context/GlobalProvider'

const blog = () => {
  const {user, isLoading} = useGlobalContext();

  const [passUserOutside, setPassUserOutside] = useState(false)

  const userOutsidePostCreation = () => {
    setPassUserOutside(!passUserOutside);
  };
  
  return (
    <View className="flex-1">
      
        <FlatList
          className="p-4 h-full bg-primary" 
          ListHeaderComponent={() => (
            <View>
              <AddBlogComponent userData={user} getUserOutside={passUserOutside} />
            </View>
          )}
          ListFooterComponent={() => (
          <TouchableWithoutFeedback onPress={userOutsidePostCreation}>
            <View className="my-6"><Text>asdasdasdasdasdasdasdasdasd</Text></View>
          </TouchableWithoutFeedback>
          )}
        />
        
    </View>
  )
}

export default blog