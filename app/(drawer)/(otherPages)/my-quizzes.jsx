import { View, Text, Image, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
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
        if(data.emri !== null) setFilterData((prevData) => ({...prevData, sortByName: "QuizName", sortNameOrder: data.emri}));
        if(data.data !== null) setFilterData((prevData) => ({...prevData, sortByDate: "createdAt", sortDateOrder: data.data}));
        if(data.shikime !== null) setFilterData((prevData) => ({...prevData, sortByPopular: "viewCount", sortPopularOrder: data.shikime}));
    }

    const onRefresh = async () => {
        setIsRefreshing(true)
            setFilterData((prevData) => ({
                ...prevData,
                pageNumber: 1,
                pageSize: 15,
                sortByName: '',
                sortNameOrder: '',
                sortByDate: '',
                sortDateOrder: '',
                sortByPopular: '',
                sortPopularOrder: '',
                categoryId: '',
            }))
        setIsRefreshing(false)
    }

    const filterQuizzes = (item) => {
        console.log(item);
        
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
        setModalVisible(false)
        router.push(`/quiz/${singleQuizData?.id}`)
    }   

    const deleteQuizPrompt = async () => {
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

    useEffect(() => {
      if(data){
        setYourQuizzesData(data);
      }else{
        setYourQuizzesData(null);
      }
    }, [data])

    useEffect(() => {
        refetch();
    }, [filterData])
    


    

    if(isLoading || isRefreshing || quizloading){
        return (
            <Loading />
        )
    }else{
        return (
                <FlatList 
                    className="h-full bg-primary px-4"
                    refreshControl={< RefreshControl onRefresh={onRefresh} refreshing={isRefreshing}/>}
                    data={yourQuizzesData}
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
                            />  
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <>
                        <View className="mb-4"/>
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