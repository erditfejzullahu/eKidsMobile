import { View, Text, TextInput } from 'react-native'
import React, {useState} from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { images, icons } from '../constants'
import { useColorScheme } from 'nativewind'

const SearchInput = ({ title, placeholder, otherStyles, searchFunc, valueData, ...props }) => {
  const {colorScheme} = useColorScheme();
    const [searchData, setSearchData] = useState({
      data: ''
    })

    const sendSearchData = () => {
      searchFunc(searchData.data);
    }
    return (
            <View className="border-2 border-gray-200 dark:border-black-200 w-full h-16 px-4 bg-oBlack-light dark:bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
                <TextInput
                    className="text-base my-6 h-full items-center text-oBlack placeholder:text-oBlack dark:placeholder:text-gray-700 dark:text-white flex-1 font-pregular"
                    value={searchData.data}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    onChangeText={(e) => {setSearchData({...searchData, data: e})}}
                    onSubmitEditing={sendSearchData}
                    returnKeyType="search"
                    {...props}
                />
                <TouchableOpacity
                  onPress={sendSearchData}
                >
                  <Image 
                    source={icons.search}
                    className="h-5 w-5"
                    resizeMode='contain'
                    tintColor={colorScheme === 'light' ? "#000" : "#CDCDE0"}
                  />
                </TouchableOpacity>
            </View>
    )
}

export default SearchInput