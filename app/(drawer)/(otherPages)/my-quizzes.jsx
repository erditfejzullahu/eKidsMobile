import { View, Text, Image, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images, icons } from '../../../constants'
import EmptyState from '../../../components/EmptyState'
import { useGlobalContext } from '../../../context/GlobalProvider'
import Loading from '../../../components/Loading'
import SorterComponent from '../../../components/SorterComponent'
import SingleQuizComponent from '../../../components/SingleQuizComponent'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { deleteQuizz, getAllQuizzesByUser } from '../../../services/fetchingService'
import CustomModal from '../../../components/Modal'
import { initialFilterData } from '../../../services/filterConfig'
import NotifierComponent from '../../../components/NotifierComponent'
import { useRouter } from 'expo-router'
import ShareToFriends from '../../../components/ShareToFriends'
import { useTopbarUpdater } from '../../../navigation/TopbarUpdater'
import QuizzesCategoriesFilter from '../../../components/QuizzesCategoriesFilter'
import SearchInput from '../../../components/SearchInput'

const MyQuizzes = () => {
    const {user, isLoading} = useGlobalContext();
    const userCategories = user?.data?.categories;  
    const router = useRouter();
    const [yourQuizzesData, setYourQuizzesData] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [filterData, setFilterData] = useState({
        ...initialFilterData,
        userId: user?.data?.userData?.id,
        searchParam: ""
    })
    const [loadedFirst, setLoadedFirst] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const {data, isLoading: quizloading, refetch} = useFetchFunction(() => getAllQuizzesByUser(filterData))


    const sortQuizzes = (data) => {
        setLoadedFirst(false)
        setFilterData((prev) => ({
            ...prev,
            sortByName: data.emri != null && "QuizName",
            sortNameOrder: data.emri,
            sortByDate: data.data != null && "createdAt",
            sortDateOrder: data.data,
            sortByViews: data.shikime != null && "viewCount",
            sortViewOrder: data.shikime
        }))
    }

    const onRefresh = async () => {
        setIsRefreshing(true)
        setLoadedFirst(false)
        setFilterData((prevData) => ({
            ...prevData,
            pageNumber: 1,
            pageSize: 15,
            sortByName: '',
            sortNameOrder: '',
            sortByDate: '',
            sortDateOrder: '',
            sortByViews: '',
            sortViewOrder: '',
            categoryId: '',
            searchParam: ""
        }))
        setIsRefreshing(false)
    }

    const filterQuizzes = (item) => {
        setLoadedFirst(false)
        setFilterData((prevData) => ({
            ...prevData,
            categoryId: item.CategoryID  
        }))
    }


    const loadMore = () => {
        if(!yourQuizzesData?.hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
        setFilterData((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1
        }))
    }

    useEffect(() => {
      if(data){
        if(filterData.pageNumber > 1){
            setYourQuizzesData(prev => ({
                ...prev, 
                result: [...prev.result, ...data.result],
                hasMore: data.hasMore
            }))
        }else{
            setYourQuizzesData(data);
        }
        setIsLoadingMore(false);
      }else{
        setYourQuizzesData([]);
        setIsLoadingMore(false);
      }
    }, [data])

    useEffect(() => {
      if(yourQuizzesData?.result?.length > 0){
        setLoadedFirst(true)
      }
    }, [yourQuizzesData])
    

    useEffect(() => {
        refetch();
    }, [filterData])

    if((isLoading || isRefreshing || quizloading) && !loadedFirst){
        return (
            <Loading />
        )
    }else{
        return (
                <FlatList 
                    className="h-full bg-primary-light dark:bg-primary px-4"
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    refreshControl={< RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} refreshing={isRefreshing}/>}
                    data={yourQuizzesData?.result}
                    keyExtractor={(item) => 'Quiz-' + item?.id?.toString()}
                    renderItem={({item}) => (
                        <SingleQuizComponent 
                            quizData={item}
                            user={user}
                            refetchCall={() => refetch()}
                        />
                    )}
                    ListHeaderComponent={() => (
                        <>
                        <View className="my-4">
                            <Text className="text-2xl text-oBlack dark:text-white font-pmedium">Kuizet e mia
                                <View>
                                <Image
                                    source={images.path}
                                    className="h-auto w-[100px] absolute -bottom-8 -left-12"
                                    resizeMode='contain'
                                />
                                </View>
                            </Text>
                        </View>
                        <View className="my-2">
                            <SearchInput
                                placeholder={"Kerkoni kuizet tuaja..."}
                                searchFunc={(e) => {setLoadedFirst(false); setFilterData((prev) => ({...prev, searchParam: e}))}}
                                valueData={filterData.searchParam}
                            />
                        </View>
                        <QuizzesCategoriesFilter sortQuizzes={sortQuizzes} filterQuizzes={filterQuizzes} userCategories={userCategories}/>
                        
                        </>
                    )}
                    ListEmptyComponent={() => (
                        <View className="mt-4 ">
                            <EmptyState 
                                title={"Asnje kuiz nuk u gjend!"}
                                // titleStyle={"!font-pregular"}
                                subtitle={"Ju lutem provoni perseri apo provoni te shtoni kuize te reja duke klikuar butonin e meposhtem!"}
                                isSearchPage={true}
                                buttonTitle={"Krijoni nje kuiz te ri!"}
                                buttonFunction={() => router.replace('/add-quiz')}
                            />  
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <>
                        <View className="mb-4"/>
                        <View className="justify-center p-4 -mt-5 flex-row items-center gap-2">
                        {yourQuizzesData?.hasMore ? (
                            <>
                            <Text className="text-oBlack dark:text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                            <ActivityIndicator color={"#FF9C01"} size={24} />
                            </> 
                        ): (
                            <>
                            <Text className="text-oBlack dark:text-white font-psemibold text-sm">Nuk ka me kuize...</Text>
                            <Image
                                source={images.breakHeart}
                                className="size-5"
                                tintColor={"#FF9C01"}
                                resizeMode='contain'
                            />
                            </>
                        )}
                        </View>
                        </>
                    )}
                />
        )
    }
}

export default MyQuizzes