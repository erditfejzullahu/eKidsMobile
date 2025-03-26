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

const AllQuizzes = () => {
  const {user, isLoading} = useGlobalContext();
  const userCategories = user?.data?.categories;  
  const [showModal, setShowModal] = useState(true)
  const [openCategories, setOpenCategories] = useState(false)
  const [quizesData, setQuizesData] = useState(null)
  const [filterData, setFilterData] = useState({
    ...initialFilterData,
    userId: user?.data?.userData?.id
  })
  const [singleQuizData, setSingleQuizData] = useState(null)

  const [isRefreshing, setIsRefreshing] = useState(false)

  const {data, isLoading: quizzesLoading, refetch} = useFetchFunction(() => getAllQuizzes(filterData))

  const sortQuizes = (data) => {
    if(data.emri !== null) setFilterData((prevData) => ({...prevData, sortByName: "QuizName", sortNameOrder: data.emri}));
    if(data.data !== null) setFilterData((prevData) => ({...prevData, sortByDate: "createdAt", sortDateOrder: data.data}));
    if(data.shikime !== null) setFilterData((prevData) => ({...prevData, sortByPopular: "viewCount", sortPopularOrder: data.shikime}));
  }

  

  const filterQuizes = (category) => {    
    setFilterData((prevValues) => ({
      ...prevValues,
      categoryId: category.CategoryID
    }))
  }

  const {setShareOpened, shareOpened} = useTopbarUpdater();
  const handleLongPressShare = (quizData) => {
    console.log(quizData, ' data');
    
    setSingleQuizData(quizData?.id)
    setShareOpened(true);
  }

  useEffect(() => {
    if(data){
      setQuizesData(data);
    }else{
      setQuizesData(null)
    }
  }, [data])
  

  useEffect(() => {
    refetch();
  }, [filterData])
  

  const onRefresh = () => {
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

  if(isRefreshing || isLoading || quizzesLoading){
    return(
      <Loading />
    )
  }else{
  return (
    <>
    <FlatList 
      className="bg-primary h-full px-4"
      refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
      data={quizesData}
      keyExtractor={(item) => 'Quiz-' + item?.id?.toString()}
      renderItem={({item}) => (
        <SingleQuizComponent 
          quizData={item}
          allQuizzes={true}
          longPressShare={handleLongPressShare}
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
              sortButton={sortQuizes}
            />
          </View>
          {openCategories && <View className="absolute flex-row flex-wrap z-20 w-full border-t border-l border-black-200 mt-9 bg-primary ">
            {userCategories.map((item) => {

              return(
                <View key={'category-' + item?.CategoryID} className="w-1/3">
                  <TouchableOpacity onPress={() => filterQuizes(item)} className="p-2 border-b border-r border-black-200 items-center justify-center">
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
        <View className="my-4">
          
        </View>
      )}
    />

    <ShareToFriends 
      currentUserData={user?.data?.userData}
      shareType="quiz"
      passedItemId={singleQuizData}
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