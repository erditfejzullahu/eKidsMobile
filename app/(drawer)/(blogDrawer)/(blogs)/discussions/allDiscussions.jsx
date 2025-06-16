import React, { useEffect, useState } from 'react'
import { FlatList, Image, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { icons, images } from '../../../../../constants'
import DiscussionsFilter from '../../../../../components/DiscussionsFilter'
import DiscussionsCard from '../../../../../components/DiscussionsCard'
import { useRouter } from 'expo-router'
import useFetchFunction from '../../../../../hooks/useFetchFunction'
import { getDiscussions } from '../../../../../services/fetchingService'
import Loading from "../../../../../components/Loading"
import EmptyState from '../../../../../components/EmptyState'
import { useRoute } from '@react-navigation/native'

const AllDiscussions = () => {
    const route = useRoute();
    const {tagId, name} = route.params || {};
    console.log(tagId, ' tagId');
    
    const router = useRouter();
    const [sortBy, setSortBy] = useState(0)
    const [paginationData, setPaginationData] = useState({pageNumber: 1, pageSize: 15});
    const {data, isLoading, refetch} = useFetchFunction(() => getDiscussions(sortBy, paginationData, tagIdSelected?.tagId))
    
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [discussionData, setDiscussionData] = useState([])

    const [tagIdSelected, setTagIdSelected] = useState(null)

    const onRefresh = async () => {
        setIsRefreshing(true)
        setSortBy(0)
        if(sortBy === 0){
            await refetch();
        }
        setIsRefreshing(false)
    }

    useEffect(() => {
      if(tagId){
        setTagIdSelected({tagId, name})
      }
    }, [tagId, name])
    

    useEffect(() => {
      if(data){
        setDiscussionData(data)
        console.log(discussionData,  ' asdasdasdasd');
        
      }else{
        setDiscussionData([])
      }
    }, [data])

    useEffect(() => {
      refetch();
    }, [sortBy])
    
    
if(isLoading) return <Loading />
  return (
    <FlatList 
        className="bg-primary px-4"
        data={discussionData?.data}
        contentContainerStyle={{gap:20}}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        renderItem={({item}) => (
            <DiscussionsCard discussion={item}/>
        )}
        ListHeaderComponent={() => (
            <>
            <View className={`my-4 flex-row items-center gap-2 relative`}>
                <TouchableOpacity onPress={() => router.push('/discussions/addDiscussion')} className="absolute top-0 right-0 bg-secondary p-2 rounded-md" style={styles.box}>
                    <Image 
                        source={icons.plusnotfilled}
                        className="h-6 w-6"
                        resizeMode='contain'
                        tintColor={"#fff"}
                    />
                </TouchableOpacity>
                <View>
                    <Text className="text-2xl text-white font-pmedium">Diskutimet
                        <View>
                        <Image
                            source={images.path}
                            className="h-auto w-[100px] absolute -bottom-8 -left-12"
                            resizeMode='contain'
                            />
                        </View>
                    </Text>
                </View>
                <View>
                    <Image 
                        source={icons.star}
                        className="size-6"
                        tintColor={"#ff9c01"}
                    />
                </View>
            </View>

            <DiscussionsFilter sendData={(param) => setSortBy(param)} sortBy={sortBy}/>

            {(discussionData.length > 0 && discussionData?.discussionsCount > 0) && <View className="mt-2">
                <Text className="text-white font-psemibold"><Text className="text-secondary">{discussionData?.discussionsCount}</Text> Diskutime</Text>
            </View>}
            {tagIdSelected?.name && (
                <Text className="text-white font-psemibold mt-3">Etiketimi i perzgjedhur: <Text className="text-secondary">{tagIdSelected?.name}</Text></Text>
            )}
            </>
        )}
        ListFooterComponent={() => (
            <View className="mb-4">
                {discussionData?.hasMore && <Loading />}
            </View>
        )}
        ListEmptyComponent={() => (
            <View className="bg-oBlack border border-black-200" style={styles.box}>
                <EmptyState 
                    title={"Nuk ka diskutime"}
                    subtitle={"Nese mendoni qe eshte gabim, rifreskoni dritaren ose kontaktoni Panelin e Ndihmes. Per te krijuar nje diskutim shtypni butonin me poshte"}
                    isSearchPage={true}
                    buttonTitle={"Krijoni nje diskutim"}
                    buttonFunction={() => router.push('/discussions/addDiscussion')}
                />
            </View>
        )}
    />
  )
}

export default AllDiscussions

const styles = StyleSheet.create({
    box: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
        })
    },
});