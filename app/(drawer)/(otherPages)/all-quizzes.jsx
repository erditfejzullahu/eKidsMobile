import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform, RefreshControl, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import { icons, images } from '../../../constants'
import CustomModal from '../../../components/Modal'
import SorterComponent from '../../../components/SorterComponent'
import { useGlobalContext } from '../../../context/GlobalProvider'
import useFetchFunction from '../../../hooks/useFetchFunction'
import { getAllQuizzes } from '../../../services/fetchingService'
import Loading from '../../../components/Loading'
import SingleQuizComponent from '../../../components/SingleQuizComponent'
import EmptyState from '../../../components/EmptyState'
import { initialFilterData } from '../../../services/filterConfig'
import ShareToFriends from '../../../components/ShareToFriends'
import { useTopbarUpdater } from '../../../navigation/TopbarUpdater'
import { ActivityIndicator } from 'react-native'
import QuizzesCategoriesFilter from '../../../components/QuizzesCategoriesFilter'
import SearchInput from '../../../components/SearchInput'

const AllQuizzes = () => {
  const {user, isLoading} = useGlobalContext();
  const userCategories = user?.data?.categories;  
  const [showModal, setShowModal] = useState(true)
  const [openCategories, setOpenCategories] = useState(false)
  const [quizesData, setQuizesData] = useState(null)
  const [filterData, setFilterData] = useState({
    ...initialFilterData,
    userId: user?.data?.userData?.id,
    searchParam: ""
  })
  const [singleQuizData, setSingleQuizData] = useState(null)

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadedFirst, setLoadedFirst] = useState(false)

  const {data, isLoading: quizzesLoading, refetch} = useFetchFunction(() => getAllQuizzes(filterData))

  const sortQuizes = (data) => {
    setFilterData((prev) => ({
      ...prev,
      sortByName: data.emri != null && "QuizName",
      sortNameOrder: data.emri,
      sortByDate: data.data != null && "createdAt",
      sortDateOrder: data.data,
      sortByViews: data.shikime != null && "viewCount",
      sortViewOrder: data.shikime,
      pageSize: data.pageSize,
    }))
  }


  const filterQuizes = (category) => {    
    setLoadedFirst(false)
    setFilterData((prevValues) => ({
      ...prevValues,
      categoryId: category.CategoryID
    }))
  }

  const {setShareOpened, shareOpened} = useTopbarUpdater();

  const loadMore = () => {
    if(!quizesData.hasMore || isLoadingMore) return;
    setIsLoadingMore(true)
    setFilterData((prev) => ({
      ...prev,
      pageNumber: prev.pageNumber + 1
    }))
  }

  useEffect(() => {
    if(quizesData?.result?.length > 0){
      setLoadedFirst(true)
    }
  }, [quizesData])
  

  useEffect(() => {
    if(data){
      if(filterData.pageNumber > 1){
        setQuizesData((prev) => ({
          ...prev,
          result: [...prev.result, ...data.result],
          hasMore: data.hasMore
        }))
      }else{
        setQuizesData(data);
      }
      setIsLoadingMore(false)
    }else{
      setQuizesData(null)
    }
  }, [data])
  

  useEffect(() => {
    refetch();
  }, [filterData])
  

  const onRefresh = () => {
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

  if((isRefreshing || isLoading || quizzesLoading) && !loadedFirst){
    return(
      <Loading />
    )
  }else{
  return (
    <>
    <FlatList 
      className="bg-primary h-full px-4"
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
      refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} onRefresh={onRefresh} refreshing={isRefreshing} />}
      data={quizesData?.result}
      keyExtractor={(item) => 'Quiz-' + item?.id?.toString()}
      renderItem={({item}) => (
        <SingleQuizComponent 
          quizData={item}
          user={user}
          allQuizzes={true}
        />
      )}
      ListHeaderComponent={() => (
        <>
        <View className="my-4">
          <Text className="text-2xl text-white font-pmedium">Te gjitha kuizet
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
            placeholder={"Kerkoni kuize..."}
            searchFunc={(e) => {setLoadedFirst(false); setFilterData((prev) => ({...prev, searchParam: e}))}}
            valueData={filterData.searchParam}
          />
        </View>
        <QuizzesCategoriesFilter filterQuizzes={filterQuizes} sortQuizzes={sortQuizes} userCategories={userCategories}/>
        </>
      )}
      ListEmptyComponent={() => (
        <View className="mt-4">
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
        <View className="mb-4" />
        <View className="justify-center p-4 -mt-5 flex-row items-center gap-2">
        {quizesData?.hasMore ? (
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
        </>
      )}
    />

    {/* modali */}
    <CustomModal
      title={"Informacione mbi kuizet"}
      visible={showModal}
      onlyCancelButton={true}
      cancelButtonText={"Largo dritaren"}
      onClose={() => setShowModal(false)}
    >
      <ScrollView className="max-h-[300px] my-4" style={styles.box}>
        <Text className="text-secondary font-psemibold text-center mb-2 text-lg">(Se shpejti)</Text>
        <Text className="text-white text-sm font-plight">Miresevini në pjesën e kuizeve ku mund të zhvilloni diturinë tuaj duke plotësuar kuizet e kategorive të ndryshme!</Text>
        <Text className="text-white text-xl font-psemibold mt-4 mb-1">Kompeticioni</Text>
        <Text className="text-white text-sm font-plight">Pjesëmarrësit do të kenë mundësinë të garojnë me njëri-tjetrin në një kompeticion emocionues. Çdo javë, do të shpallen fituesit përkatës të çdo kategorie, dhe ata do të marrin çmime të veçanta.</Text>
        <Text className="text-white text-xl font-psemibold mt-4 mb-1">Si te merrni pjese?</Text>
        <Text className="text-white text-sm font-plight">1. <Text className="font-pbold">Zgjidhni Kategorine:</Text> Zgjidhni nga një gamë e gjerë kategorish që ju interesojnë apo zgjidhni kuizin ne menyre te randomizuar.</Text>
        <Text className="text-white text-sm font-plight">2. <Text className="font-pbold">Plotësoni Kuizin:</Text> Përdorni njohuritë tuaja për të plotësuar kuizin.</Text>
        <Text className="text-white text-sm font-plight">3. <Text className="font-pbold">Shihni Rezultatet:</Text> Pas përfundimit, shihni se si u renditët krahasuar me pjesëmarrësit e tjerë ne baze te karakteristikave sic jane: Koha, Gabimet, Perkushtimi.</Text>
        <Text className="text-white text-xl font-psemibold mt-4 mb-1">Përfitimet</Text>
        <Text className="text-white text-sm font-plight">1. <Text className="font-pbold">Zhvilloni Diturinë:</Text> Mësoni gjëra të reja dhe thelloni njohuritë tuaja.</Text>
        <Text className="text-white text-sm font-plight">2. <Text className="font-pbold">Bashkëpunimi:</Text> Bisedoni dhe shkëmbeni mendime me pjesëmarrës të tjerë.</Text>
        <Text className="text-white text-sm font-plight">3. <Text className="font-pbold">Çmime:</Text> Fitoni çmime dhe njohje për arritjet tuaja.</Text>
      </ScrollView>
    </CustomModal>
    </>
  )
  }
}
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
})
export default AllQuizzes