import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants';
import Loading from "./Loading"
import { initialFilterData } from '../services/filterConfig';
import { getAllTagsByCategory, getAllBlogsByTag } from '../services/fetchingService';
import { useRouter } from 'expo-router';
import * as Animatable from "react-native-animatable"

const TagsByCategories = ({categories}) => {
    // console.log(categories);
    const router = useRouter();
    const [categoryOpened, setCategoryOpened] = useState(false)
    const [tagOpened, setTagOpened] = useState([])

    const [tagsData, setTagsData] = useState(null)
    const [blogsData, setBlogsData] = useState(null)
    const [pairOfBlogs, setPairOfBlogs] = useState([])

    const [paginationData, setPaginationData] = useState({
        pageNumber: 1,
        pageSize: 5
    })

    const getTags = async () => {        
        const response = await getAllTagsByCategory(categories.CategoryID)
        // console.log(response);
        
        response ? setTagsData(response) : null
        setCategoryOpened(!categoryOpened)

    }

    const getBlogs = async (tagId) => {        
        const response = await getAllBlogsByTag(tagId)        
        response ? setBlogsData(response) : null
        setTagOpened((prevData) => {
            if(prevData.includes(tagId)){
                return prevData.filter((idx) => idx !== tagId)
            }else{
                return [...prevData, tagId]
            }
        })
        // console.log(tagOpened);
    }

    const goToBlog = (blogId) => {
        router.push(`(blogs)/(discussions)/${blogId}`)
    }


  return (
    <View>
        <TouchableOpacity onPress={getTags} className="flex-row gap-2 items-center">
            <Text className="text-white font-plight text-sm">{categories.categoryName}</Text>
            <Image 
                source={categoryOpened ? icons.downArrow : icons.rightArrow}
                className="h-4 w-4"
                resizeMode='contain'
                tintColor={"#FF9C01"}
            />
        </TouchableOpacity>

        {categoryOpened && <FlatList 
            data={tagsData}
            keyExtractor={(item) => 'sideTag-' + item?.id}
            renderItem={({item}) => (
                <View key={`sideTags-${item?.id}`} className="border bg-primary border-black-200 rounded-[5px] p-2 m-2 my-3">
                    <View>
                        <TouchableOpacity onPress={() => getBlogs(item.id)}>
                            <View className="flex-row relative items-center gap-2">
                                <Text className="text-white text-sm italic">{item?.name}</Text>
                                <Image
                                    source={tagOpened.includes(item.id) ? icons.downArrow : icons.rightArrow}
                                    className="h-4 w-4"
                                    resizeMode='contain'
                                    tintColor={"#FF9C01"}
                                />
                                {tagOpened.includes(item.id) && <View className="absolute h-[12px] w-[1px] -bottom-4 left-[20px] bg-secondary"/>}
                            </View>
                        </TouchableOpacity>
                        {/* <View>
                            <Loading />
                        </View> */}
                        {(tagOpened.includes(item.id) && blogsData.some(tagId => tagId.tagId === item.id)) && 
                        <Animatable.View animation="fadeIn">
                        <FlatList
                            data={blogsData}
                            keyExtractor={(bItem) => 'sideBlog-' + bItem?.id}
                            renderItem={({item, index}) => (
                                <View key={`sideBlogs-${item?.id}`} className={`${index === 0 ? "mt-3.5" : ""} ml-3`}>
                                    <TouchableOpacity onPress={() => goToBlog(item.id)}>
                                        <Text className="text-white text-sm italic py-0.5">{item?.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <View className="mt-3.5 ml-3">
                                    <Text>Nuk u gjend asnje blog</Text>
                                </View>
                            )}
                        />
                        </Animatable.View>
                        }
                    </View>
                </View>
            )}

            ListEmptyComponent={() => (
                <View className="border bg-primary border-black-200 rounded-[5px] p-2 m-2 my-3">
                    <Text className="text-white text-sm italic">Nuk u gjend asnje etiketim</Text>
                </View>
            )}
        /> }
        
    </View>
  )
}

export default TagsByCategories