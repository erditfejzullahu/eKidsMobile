import { View, Text, Image, Platform, StyleSheet, TextInput, ScrollView, Modal, Pressable, TouchableWithoutFeedback, Touchable } from 'react-native'
import React, { useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { getCourseCategories } from '../services/fetchingService'
import { FlatList } from 'react-native-gesture-handler'
import { useEffect } from 'react'
import { icons } from '../constants'
import * as Animatable from "react-native-animatable"

const AddBlogComponent = ({userData, getUserOutside}) => {
    const user = userData?.data?.userData
    
    const categories = userData?.data?.categories

    const [selectedCategory, setSelectedCategory] = useState(null)
    const [openCategories, setOpenCategories] = useState(false)
    const [openTags, setOpenTags] = useState(false)
    const [inputFocused, setInputFocused] = useState(true)

    const [openTagDialog, setOpenTagDialog] = useState(false)
    const [allTags, setAllTags] = useState(true)
    const [addTags, setAddTags] = useState(false)

    const [writtenTags, setWrittenTags] = useState(null)
    const [outputTags, setOutputTags] = useState([])
    const [enteredOnce, setEnteredOnce] = useState(false)

    const [blogContent, setBlogContent] = useState('')
    const [title, setTitle] = useState('')

    const [tagsSelected, setTagsSelected] = useState([])

    const selectTags = (item) => {
        setTagsSelected((prevData) => {
            if(prevData.includes(item)){
                return prevData.filter((tag) => tag !== item);
            }else {
                return [...prevData, item];
            }
        })
    }


    const tagsexample = ["Tagu 1", "Tagu 2", "Tagu 3", "Tagu 4", "Tagu 5"]

    const blogContentRef = useRef(null)

    const removeTag = (tag) => {
        if(outputTags.includes(tag)){
            setOutputTags((prevData) => prevData.filter((item) => item !== tag));
        }
    }

    const switchFromTitle = (e) => {
        if(e.nativeEvent.key === 'Enter' && !enteredOnce){
            setEnteredOnce(true);
            setTimeout(() => {
                if (blogContentRef.current) {
                    blogContentRef.current.focus();
                }
            }, 100);
        }
    }

    const createBlog = () => {
        const payload = {};
        if(addTags && outputTags.length > 0){
            payload = {
                blogDto: {
                    title: title,
                    content: blogContent,
                    categoryId: selectedCategory,
                    status: "1",
                    userId: user.id
                },
                tagDto: {
                    name: "",
                    parentId: "",
                    category_Id: selectedCategory,
                    children: outputTags.map(tag => ({
                        name: tag.name,
                        category_Id: selectedCategory
                    }))
                }
            }
        }else if(allTags && tagsSelected.length > 0){
            payload = {
                
            }
        }
    }

    useEffect(() => {
        if(writtenTags !== null){
            const words = writtenTags.trim().split(/\s+/);
            if(words){
              setOutputTags(words)
            }
        }
        if(writtenTags === '' || writtenTags === null){
            setOutputTags([])
        }
    }, [writtenTags])
    

    useEffect(() => {        
      if(getUserOutside === true){
        setInputFocused(false)
      }
    }, [getUserOutside])
    
    
    
  return (
            <View 
                className="relative bg-oBlack border border-black-200 rounded-[10px] flex-1"
                style={styles.box}
                >
                <View className="absolute -right-2 -top-2">
                    <TouchableOpacity className="bg-secondary p-2">
                        <Image
                            source={icons.fullscreen}
                            className="h-6 w-6"
                            tintColor={"#fff"}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/* profile */}
                <View className="flex-row gap-4 items-center px-4 pt-4">
                    <View>
                        <Image 
                            source={{uri: user?.profilePictureUrl}}
                            className="h-16 w-16 rounded-full border border-black-200"
                            resizeMode='contain'
                        />
                    </View>
                    <View className="gap-2">
                        <View>
                            <Text className="text-white font-psemibold">{user?.firstname} {user?.lastname}</Text>
                        </View>
                        <TouchableOpacity>
                            <View className="flex-row gap-2 items-center">
                                <View>
                                    <Text className="text-gray-400 font-pregular text-sm">Public</Text>
                                </View>
                                <View>
                                    <Image 
                                        source={icons.earth}
                                        className="h-4 w-4"
                                        resizeMode="contain"
                                        tintColor={"#9ca3af"}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* content  */}
                <View className={`${inputFocused ? "" : "mb-2"} mt-4 px-4`}>
                    <TextInput 
                        className="text-xl font-pbold text-white"
                        placeholder='Cfare titulli?'
                        placeholderTextColor="#9ca3af"
                        onChangeText={(e) => setTitle(e)}
                        onKeyPress={switchFromTitle}
                        value={title}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setEnteredOnce(true)}
                    />
                    {enteredOnce && <TextInput
                        ref={blogContentRef}
                        className="text-gray-200 text-sm font-psemibold p-2 pl-0"
                        placeholder='Cfare keni ne mendje?'
                        placeholderTextColor="#9ca3af"
                        multiline={true}
                        value={blogContent}
                        onChangeText={(e) => setBlogContent(e)}
                        onFocus={() => setInputFocused(true)}
                        // onBlur={() => setInputFocused(false)}
                    />}
                </View>

                {inputFocused && <Animatable.View animation="fadeIn">
                    {/* etiketimet kategorine */}
                    <View className="flex-row justify-between mt-4 gap-2 px-4">
                        <View className="flex-1">
                            <View className="mb-2">
                                <Text className="text-white font-psemibold text-xs">Kategorite</Text>
                            </View>
                            {selectedCategory === null && 
                            <TouchableOpacity onPress={() => setOpenCategories(!openCategories)} className="border border-black-200 rounded-[5px] p-2 px-4 self-start">
                                <Text className="font-plight text-gray-400 text-sm">Zgjidh kategorine</Text>    
                            </TouchableOpacity>}
                            {selectedCategory !== null && <TouchableOpacity onPress={() => setOpenCategories(!openCategories)} className="border border-black-200 rounded-[5px] self-start p-2 px-4">
                                <Text className="font-psemibold text-gray-400 text-sm">{getCourseCategories(categories, selectedCategory)}</Text>
                            </TouchableOpacity>}
                            {openCategories && <View className="p-2 border border-black-200 rounded-[5px] bottom-0 bg-oBlack mt-2" style={styles.box}>
                                <FlatList
                                    className="h-[60px]"
                                    scrollEnabled={true}
                                    data={categories || []}
                                    keyExtractor={(item) => `categories-${item.CategoryID}`}
                                    renderItem={({item}) => (
                                        <TouchableOpacity 
                                            className="p-1 border-b border-black-200"
                                            onPress={() => {setSelectedCategory(item?.CategoryID), setOpenCategories(false)}}
                                            >
                                            <Text className="text-gray-400 font-plight text-sm">{item?.categoryName}</Text>
                                        </TouchableOpacity>
                                    )}
                                    showsVerticalScrollIndicator
                                />
                            </View>}
                        </View>
                        <View className="flex-1 relative">
                            <TouchableOpacity className="mb-2" onPress={() => setOpenTagDialog(true)}>
                                <Text className="text-white font-psemibold text-xs text-right">Etiketimet
                                    <Animatable.Image
                                        animation="pulse"
                                        iterationCount="infinite" 
                                        source={icons.infoFilled}
                                        className="h-4 w-4"
                                        resizeMode='contain'
                                        tintColor={"#ff9c01"}
                                    />
                                </Text>
                            </TouchableOpacity>
                            {openTagDialog && <Animatable.View animation="bounceIn" className="absolute right-0 bg-oBlack z-50 border border-black-200 rounded-[5px]" style={styles.box}>
                                <TouchableOpacity onPress={() => {setAllTags(true); setAddTags(false); setOpenTagDialog(false);}} className="p-1.5 mx-2 border-b border-black-200">
                                    <Text className="text-white font-plight text-sm text-center">Te gjitha</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setAddTags(true); setAllTags(false); setOpenTagDialog(false);}} className="p-1.5 mx-2">
                                    <Text className="text-white font-plight text-sm text-center">Shto etiketime</Text>
                                </TouchableOpacity>
                            </Animatable.View>}
                            {allTags && <View>
                                {outputTags.length > 0 && 
                                    <FlatList 
                                        className="h-[60px] border border-black-200 rounded-[5px]"
                                        scrollEnabled={true}
                                        horizontal={true}
                                        contentContainerStyle={{ flexDirection: "row", gap: 6, padding: 6, flexBasis: "auto"}}
                                        data={outputTags || []}
                                        keyExtractor={(item, index) => `tagu-${index}`}
                                        renderItem={({item, index}) => (
                                            <View className={`${index === 0 ? "bg-secondary !border-white" : ""} border relative border-black-200 rounded-[5px] self-start p-2 px-4`}>
                                                <Text className={`${index === 0 ? "!text-white font-psemibold" : ""} font-plight text-gray-400 text-xs`}>{item}</Text>
                                                <TouchableOpacity onPress={() => removeTag(item)} className={`absolute -top-0.5 -right-0.5 bg-secondary p-1 rounded-full ${index === 0 ? "border border-white" : ""}`}>
                                                    <Image 
                                                        source={icons.close}
                                                        className="h-2 w-2"
                                                        tintColor={"#fff"}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />}
                                <View className={`${outputTags.length > 0 ? "mt-2" : ""} `}>
                                    <TextInput 
                                        className="border border-black-200 text-gray-400 rounded-[5px] p-2"
                                        placeholder='Etiketimet...'
                                        placeholderTextColor={"#9ca3af"}
                                        onChangeText={(e) => setWrittenTags(e)}
                                        />
                                </View>
                            </View>}
                            {addTags && <View>
                                <TouchableOpacity onPress={() => setOpenTags(!openTags)} className="border border-black-200 rounded-[5px] p-2 px-4 self-start ml-auto">
                                    <Text className="font-plight text-gray-400 text-sm">Zgjidh etiketimet</Text>    
                                </TouchableOpacity>

                                {/* ktu me qit tagat flatlist qe zgjedhen */}
                                {tagsSelected.length > 0 && <FlatList 
                                        className="h-[60px] border border-black-200 rounded-[5px]"
                                        scrollEnabled={true}
                                        horizontal={true}
                                        contentContainerStyle={{ flexDirection: "row", gap: 6, padding: 6, flexBasis: "auto"}}
                                        data={tagsSelected || []}
                                        keyExtractor={(item, index) => `tagunew-${index}`}
                                        renderItem={({item, index}) => (
                                            <View className={`${index === 0 ? "bg-secondary !border-white" : ""} border relative border-black-200 rounded-[5px] self-start p-2 px-4`}>
                                                <Text className={`${index === 0 ? "!text-white font-psemibold" : ""} font-plight text-gray-400 text-xs`}>{item}</Text>
                                            </View>
                                        )}
                                    />}
                                {openTags && <View className="p-2 border border-black-200 rounded-[5px] bottom-0 bg-oBlack mt-2" style={styles.box}>
                                    <FlatList
                                        className="h-[60px]"
                                        scrollEnabled={true}
                                        data={tagsexample || []}
                                        keyExtractor={(item, index) => `selectTags-${index}`}
                                        renderItem={({item}) => (
                                            <TouchableOpacity 
                                                className="p-1 py-1.5 border-b border-black-200 relative"
                                                onPress={() => {selectTags(item)}}
                                                >
                                                <Text className="text-gray-400 font-plight text-sm">{item}</Text>
                                                {tagsSelected.includes(item) && <Image 
                                                    source={icons.tick}
                                                    resizeMode='contain'
                                                    className="w-4 h-4 absolute right-0 top-1.5"
                                                    tintColor={"#ff9c01"}
                                                />}
                                            </TouchableOpacity>
                                        )}
                                        showsVerticalScrollIndicator
                                    />
                                </View>}
                            </View>}
                        </View>
                    </View>

                    {/* status and photos  */}
                    <View className="flex-row bg-primary justify-between items-center mt-4 p-4 rounded-b-[10px] border-t border-black-200" style={styles.box}>
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity>
                                <Image 
                                    source={icons.imageGallery}
                                    className="h-6 w-6"
                                    resizeMode='contain'
                                    tintColor={"#9ca3af"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image 
                                    source={icons.videoCamera}
                                    className="h-6 w-6"
                                    resizeMode='contain'
                                    tintColor={"#9ca3af"}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity className="flex-row gap-2 items-center">
                            <Image 
                                source={icons.earth}
                                className="h-6 w-6"
                                resizeMode="contain"
                                tintColor={"#9ca3af"}
                            />
                            <Text className="text-gray-400 font-pregular text-sm">Public</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="absolute bottom-0 right-0 left-0 bg-white self-start h-[0px]" >
                        <TouchableOpacity className="bg-secondary px-4 justify-center items-center mx-auto h-10 -mt-6 rounded-[2px]" >
                            <Text className="text-white font-pmedium text-sm">Postoni</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>}
            </View>
  )
}
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
export default AddBlogComponent