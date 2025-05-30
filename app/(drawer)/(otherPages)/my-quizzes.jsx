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

const MyQuizzes = () => {
    const {user, isLoading} = useGlobalContext();
    const userCategories = user?.data?.categories;  
    const router = useRouter();
    const [openCategories, setOpenCategories] = useState(false)
    const [yourQuizzesData, setYourQuizzesData] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [filterData, setFilterData] = useState({
        ...initialFilterData,
        userId: user?.data?.userData?.id
    })
    const [loadedFirst, setLoadedFirst] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const {shareOpened, setShareOpened} = useTopbarUpdater();

    const {showNotification: successDelete} = NotifierComponent({
        title: "Me sukses!",
        description: `Sapo keni fshirë me sukses kuizin me emër ${singleQuizData?.quizName}`
    })

    const {showNotification: unsuccessDelete} = NotifierComponent({
        title: "Dicka shkoi gabim!",
        description: "Ju lutem provoni perseri apo kontaktoni Panelin e ndihmes!",
        alertType: "warning"
    })

    const [singleQuizData, setSingleQuizData] = useState(null)


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

    const getCourseActions = (quizData) => {
        setSingleQuizData(quizData);
        setModalVisible(true);
    }

    const goToQuiz = () => {
        if(shareOpened){
            setShareOpened(false)
        }
        setModalVisible(false)
        router.push(`/quiz/${singleQuizData?.id}`)
    }   

    const deleteQuizPrompt = async () => {
        if(shareOpened){
            setShareOpened(true)
        }
        setModalVisible(false)
        setTimeout(() => {
            setDeleteModalVisible(true)
        }, 500);
    }

    const deleteQuiz = async () => {        
        const response = await deleteQuizz(singleQuizData?.id);
        
        if(response === 200){
            setDeleteModalVisible(false)
            successDelete();
            refetch();
        }else{
            setDeleteModalVisible(false)
            unsuccessDelete();
        }
        console.log("delete quiz!!!");
    }

    const loadMore = () => {
        if(!yourQuizzesData.hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
        setFilterData((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1
        }))
        console.log("loadmore");
    }

    useEffect(() => {
      if(data){
        console.log(data);
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
                    className="h-full bg-primary px-4"
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    refreshControl={< RefreshControl onRefresh={onRefresh} refreshing={isRefreshing}/>}
                    data={yourQuizzesData?.result}
                    keyExtractor={(item) => 'Quiz-' + item?.id?.toString()}
                    renderItem={({item}) => (
                        <SingleQuizComponent 
                            quizData={item}
                            openCourseActions={getCourseActions}
                        />
                    )}
                    ListHeaderComponent={() => (
                        <>
                        <View className="my-4">
                            <Text className="text-2xl text-white font-pmedium">Kuizet e mia
                                <View>
                                <Image
                                    source={images.path}
                                    className="h-auto w-[100px] absolute -bottom-8 -left-12"
                                    resizeMode='contain'
                                />
                                </View>
                            </Text>
                        </View>

                        <View className={`mt-2 relative ${openCategories ? "h-[160px]" : ""} border-b border-black-200 pb-4`}>
                        <View>
                        <TouchableOpacity onPress={() => setOpenCategories(!openCategories)} className={`p-2 w-1/2 flex-row justify-center gap-2 border-black-200 border-b-0 border items-center ml-auto ${openCategories ? "bg-oBlack" : "bg-transparent"}`}>
                            <Text className="font-plight text-sm text-white items-center justify-center gap-2">Kategorite</Text>
                            <View>
                                <Image 
                                source={icons.categories}
                                className="h-5 w-5"
                                resizeMode='contain'
                                style={{tintColor: openCategories ? "#FF9C01" : "#fff"}}
                                />
                            </View>
                            

                        </TouchableOpacity>
                        </View>
                        <View>
                        <SorterComponent 
                            showSorter={true}
                            sortButton={sortQuizzes}
                        />
                        </View>
                        {openCategories && <View className="absolute flex-row flex-wrap z-20 w-full border-t border-l border-black-200 mt-9 bg-primary ">
                        {userCategories.map((item) => {

                            return(
                            <View key={'category-' + item?.CategoryID} className="w-1/3">
                                <TouchableOpacity onPress={() => filterQuizzes(item)} className="p-2 border-b border-r border-black-200 items-center justify-center">
                                <Text className="text-white font-plight text-sm">{item?.categoryName}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            )
                        })}
                        </View>}
                        </View>
                        </>
                    )}
                    ListEmptyComponent={() => (
                        <View className="mt-4 ">
                            <EmptyState 
                                title={"Asnje kuiz nuk u gjend!"}
                                titleStyle={"!font-pregular"}
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
                            <Text className="text-white font-psemibold text-sm">Ju lutem prisni...</Text>
                            <ActivityIndicator color={"#FF9C01"} size={24} />
                            </> 
                        ): (
                            <>
                            <Text className="text-white font-psemibold text-sm">Nuk ka me kuize...</Text>
                            <Image
                                source={images.breakHeart}
                                className="size-5"
                                tintColor={"#FF9C01"}
                                resizeMode='contain'
                            />
                            </>
                        )}
                        </View>
                            {/* Quiz Actions Modal */}
                            <CustomModal 
                                visible={modalVisible}
                                title="Veprimet e kuizit"
                                onlyCancelButton={true}
                                cancelButtonText="Largo dritaren"
                                onClose={() => setModalVisible(false)}
                            >
                                <View className="mb-6 mt-2">
                                    <Text className="text-white font-plight text-center text-sm">
                                        Këtu mund të ndërveproni në lidhje me kursin tuaj! Gjatë kohës do të shtohen edhe mundësitë për redaktimin e kursit dhe shikimin e statistikave ndërmjet kurseve tjera!
                                    </Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(false); 
                                        setTimeout(() => {
                                            setShareOpened(true)
                                        }, 150); }} 
                                        className="bg-secondary p-2 py-1.5 items-center justify-center gap-2 flex-row rounded-[5px] mb-2">
                                        <Text className="text-white font-pregular text-sm">Shperndani kursin</Text>
                                        <Image 
                                            source={icons.share}
                                            className="h-6 w-6"
                                            resizeMode='contain'
                                            tintColor={"#fff"}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View className="gap-2 flex-row flex-wrap mb-2">
                                    <TouchableOpacity onPress={goToQuiz} className="flex-row flex-1 items-center justify-center gap-2 bg-secondary p-2 py-1.5 rounded-[5px]">
                                        <Text className="text-white font-pregular text-sm">Shikoni kursin</Text>
                                        <Image 
                                            source={icons.quiz}
                                            className="h-6 w-6"
                                            resizeMode='contain'
                                            tintColor={"#fff"}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={deleteQuizPrompt} className="flex-row flex-1 items-center justify-center gap-2 bg-secondary p-2 py-1.5 rounded-[5px]">
                                        <Text className="text-white font-pregular text-sm">Fshini kursin</Text>
                                        <Image 
                                            source={icons.close}
                                            className="h-4 w-4"
                                            resizeMode='contain'
                                            tintColor={"#fff"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </CustomModal>


                            <ShareToFriends 
                                currentUserData={user?.data?.userData}
                                shareType="quiz"
                                passedItemId={singleQuizData?.id}
                            />

                            {/* Delete Confirmation Modal */}
                            <CustomModal
                                visible={deleteModalVisible}
                                title="A jeni të sigurtë?"
                                showButtons={true}
                                proceedButtonText="Fshini kursin"
                                cancelButtonText="Mos e fshini!"
                                onProcced={deleteQuiz}
                                onClose={() => setDeleteModalVisible(false)}
                            >
                                <Text className="text-white font-plight text-sm text-center">
                                    Me këtë veprim ju fshini kursin e krijuar dhe të gjitha statistikat e kursit tuaj që mund të jenë të ndërlidhura me të ardhurat tuaja të mundshme! Nëse jeni të sigurtë, procedoni me butonin e mëposhtëm.
                                </Text>
                            </CustomModal>
                        </>
                    )}
                />
        )
    }
}

export default MyQuizzes