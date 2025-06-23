import { View, Text, Button, ScrollView, Image, TextInput, RefreshControl, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Drawer } from 'react-native-drawer-layout';
import { Link, Stack, usePathname, useRouter } from 'expo-router';
import { Dimensions } from 'react-native';
import { images } from '../../../constants';
import {useGlobalContext} from '../../../context/GlobalProvider'
import { useBlogsDrawerContext } from '../../../context/BlogsDrawerProvider';
import BlogsDrawerContext from "../../../context/BlogsDrawerProvider"
import { useTopbarUpdater } from '../../../navigation/TopbarUpdater';
import BlogsDrawyerHeader from '../../../components/BlogsDrawyerHeader';
import { getAllBlogTags, getTagsByTitle } from '../../../services/fetchingService';
import _ from 'lodash';
import useFetchFunction from '../../../hooks/useFetchFunction';
import AllTagsLayoutForDiscussionOrBlogs from '../../../components/AllTagsLayoutForDiscussionOrBlogs';
import Loading from '../../../components/Loading';
import EmptyState from '../../../components/EmptyState';
import { useNavigateToSupport } from '../../../hooks/goToSupportType';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

const TagsHeader = ({isOpened, passRouteClicked}) => {
  const {user, isLoading} = useGlobalContext();
  const userCategories = user?.data?.categories;
  // console.log(userCategories);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {discussionSection} = useTopbarUpdater();
  
  const [discussionTagData, setDiscussionTagData] = useState([])
  const [blogsTagData, setBlogsTagData] = useState([])

  const [discussionBlogsTagsInputs, setDiscussionBlogsTagsInputs] = useState({
    blogsInput: "",
    discussionsInput: ""
  })

  const {data, isLoading: discussionOrBlogTagsLoading, refetch} = useFetchFunction(() => discussionSection ? getTagsByTitle(discussionBlogsTagsInputs.discussionsInput.trim() === "" ? null : discussionBlogsTagsInputs.discussionsInput) : getAllBlogTags(discussionBlogsTagsInputs.blogsInput.trim() === "" ? null : discussionBlogsTagsInputs.blogsInput))

  const onRefresh = async () => {
    setIsRefreshing(true)
    setDiscussionBlogsTagsInputs((prev) => ({...prev, blogsInput: "", discussionsInput: ""}))
    await refetch();
    setIsRefreshing(false)
  }

  useEffect(() => {
    if(data){
      discussionSection ? setDiscussionTagData(data || []) : setBlogsTagData(data || [])
    }
  }, [data])

  useEffect(() => {
    if(isOpened){
      refetch();
    }
  }, [isOpened])

  useEffect(() => {
    refetch()
  }, [discussionBlogsTagsInputs, discussionSection])
  
    if(discussionOrBlogTagsLoading || isRefreshing) return <Loading />
  return (
    //tek pjesa e ketij hederi i qes krejt etiketimet me accordions ne baze te kategorive // etiketimet duhet me pas mundesin me pas underetiketime
    <FlatList
      refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh}/>}
      className="flex-1 bg-oBlack p-4 border-r overflow-hidden border-black-200"
      contentContainerStyle={{flexGrow: 1, gap: 6}}
      columnWrapperStyle={{gap: 6, overflow: "scroll"}}
      numColumns={4}
      data={discussionSection ? discussionTagData : blogsTagData}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <AllTagsLayoutForDiscussionOrBlogs item={item} discussionSection={discussionSection} tagClicked={(data) => passRouteClicked(data)}/>
      )}
      ListHeaderComponent={() => (
        <BlogsDrawyerHeader discussionSection={discussionSection} sendDiscussionInput={(input) => setDiscussionBlogsTagsInputs((prev) => ({...prev, discussionsInput: input}))} sendBlogsInput={(input) => setDiscussionBlogsTagsInputs((prev) => ({...prev, blogsInput: input}))}/>
      )}
      ListFooterComponentStyle={{flexGrow: 1, justifyContent: "flex-end", position: discussionSection ? "absolute" : "static", bottom: "0", width: discussionSection ? "100%" : "auto"}}
      ListFooterComponent={() => (
        <View className={`py-2 border-t border-black-200 mb-2 `}>
          <Text className="text-white font-plight text-xs">Realizuar nga <Link href={"https://murrizi.org"} accessibilityRole="link" className="text-secondary font-psemibold">Murrizi Co.</Link></Text>
        </View>
      )}
      ListEmptyComponent={() => (
        <View>
          <EmptyState 
            title={discussionSection ? "Nuk ka etiketime diskutimi" : "Nuk ka etiketime blogu"}
            subtitle={"Nese mendoni qe eshte gabim kontaktoni Panelin e Ndihmes"}
            isSearchPage={true}
            buttonTitle={"Paraqitni ankese"}
            buttonFunction={() => useNavigateToSupport("report")}
          />
        </View>
      )}
      />
      

  );
};

const _layout = () => {
  const {colorScheme} = useColorScheme();
  const router = useRouter();
  const {isDrawerOpened, setIsDrawerOpened} = useBlogsDrawerContext();
  const {setDiscussionSection} = useTopbarUpdater();
  const handleRoute = (data) => {
    setIsDrawerOpened(false)
    if(data.discussion){
      console.log(data, ' tek layoutin')
      router.replace({pathname: `/discussions/allDiscussions`, params: {tagId: data.id, name: data.name}})
    }else{
      router.replace({pathname: `/blogAll`, params: {tagId: data.id, name: data.name}})
    }
  }
  const pathname = usePathname();
  useEffect(() => {
    if(pathname.includes('discussions')){
      setDiscussionSection(true);
    }else{
      setDiscussionSection(false);
    }
  }, [isDrawerOpened, pathname])
  
  return (
    <>
      <Drawer
        drawerPosition="left"
        open={isDrawerOpened}
        onOpen={() => setIsDrawerOpened(true)}
        onClose={() => setIsDrawerOpened(false)}
        renderDrawerContent={() => <TagsHeader isOpened={isDrawerOpened} passRouteClicked={(data) => handleRoute(data)}/>}
        // drawerType="front"
        drawerStyle={{
          width: 300,
        }}
      >
            <Stack screenOptions={{gestureEnabled: true, headerShown: false}}></Stack>
      </Drawer>
      <StatusBar translucent backgroundColor="transparent" style={`${colorScheme === 'light' ? "dark" : "light"}`}/>
      </>
  );
};

export default _layout;
