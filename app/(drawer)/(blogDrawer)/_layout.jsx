import { View, Text, Button, ScrollView, Image, TextInput, RefreshControl, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Drawer } from 'react-native-drawer-layout';
import { Link, Stack, useRouter } from 'expo-router';
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

const TagsHeader = ({isOpened, passRouteClicked}) => {
  const {user, isLoading} = useGlobalContext();
  const userCategories = user?.data?.categories;
  // console.log(userCategories);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {discussionSection} = useTopbarUpdater();
  const [isDiscussionSection, setIsDiscussionSection] = useState(false)

  const [discussionTagData, setDiscussionTagData] = useState([])
  const [blogsTagData, setBlogsTagData] = useState([])

  const [discussionBlogsTagsInputs, setDiscussionBlogsTagsInputs] = useState({
    blogsInput: "",
    discussionsInput: ""
  })

  const {data, isLoading: discussionOrBlogTagsLoading, refetch} = useFetchFunction(() => isDiscussionSection ? getTagsByTitle(discussionBlogsTagsInputs.discussionsInput.trim() === "" ? null : discussionBlogsTagsInputs.discussionsInput) : getAllBlogTags(discussionBlogsTagsInputs.blogsInput.trim() === "" ? null : discussionBlogsTagsInputs.blogsInput))

  const onRefresh = async () => {
    setIsRefreshing(true)
    setDiscussionBlogsTagsInputs((prev) => ({...prev, blogsInput: "", discussionsInput: ""}))
    await refetch();
    setIsRefreshing(false)
  }

  useEffect(() => {
    if(data){
      isDiscussionSection ? setDiscussionTagData(data || []) : setBlogsTagData(data || [])
    }
  }, [data])

  useEffect(() => {
    if(isOpened){
      refetch();
    }
  }, [isOpened])

  useEffect(() => {
    if(discussionSection){
      setIsDiscussionSection(true)
      setBlogsTagData([])
      // onRefresh();
    }else{
      setIsDiscussionSection(false)
      setDiscussionTagData([])
      // onRefresh();
    }
  }, [discussionSection])

  useEffect(() => {
    refetch()
  }, [discussionBlogsTagsInputs])
  
    if(discussionOrBlogTagsLoading || isRefreshing) return <Loading />
  return (
    //tek pjesa e ketij hederi i qes krejt etiketimet me accordions ne baze te kategorive // etiketimet duhet me pas mundesin me pas underetiketime
    <FlatList
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
      className="flex-1 bg-oBlack p-4 border-r overflow-hidden border-black-200"
      contentContainerStyle={{flexGrow: 1, gap: 6}}
      columnWrapperStyle={{gap: 6, overflow: "scroll"}}
      numColumns={4}
      data={isDiscussionSection ? discussionTagData : blogsTagData}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <AllTagsLayoutForDiscussionOrBlogs item={item} discussionSection={isDiscussionSection} tagClicked={(data) => passRouteClicked(data)}/>
      )}
      ListHeaderComponent={() => (
        <BlogsDrawyerHeader discussionSection={isDiscussionSection} sendDiscussionInput={(input) => setDiscussionBlogsTagsInputs((prev) => ({...prev, discussionsInput: input}))} sendBlogsInput={(input) => setDiscussionBlogsTagsInputs((prev) => ({...prev, blogsInput: input}))}/>
      )}
      ListFooterComponentStyle={{flexGrow: 1, justifyContent: "flex-end", position: isDiscussionSection ? "absolute" : "static", bottom: "0", width: isDiscussionSection ? "100%" : "auto"}}
      ListFooterComponent={() => (
        <View className={`py-2 border-t border-black-200 mb-2 `}>
          <Text className="text-white font-plight text-xs">Realizuar nga <Text className="text-secondary font-psemibold">Murrizi Co.</Text></Text>
        </View>
      )}
      ListEmptyComponent={() => (
        <View>
          <EmptyState 
            title={isDiscussionSection ? "Nuk ka etiketime diskutimi" : "Nuk ka etiketime blogu"}
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
  const router = useRouter();
  const {isDrawerOpened, setIsDrawerOpened} = useBlogsDrawerContext();
  // const [isDrawerOpen, setDrawerOpen] = useState(isDrawerOpened);
  const handleRoute = (data) => {
    setIsDrawerOpened(false)
    if(data.discussion){
      router.replace({pathname: `/discussions/allDiscussions`, params: {tagId: data.id, name: data.title}})
    }else{
      router.replace({pathname: `/blogAll`, params: {tagId: data.id, name: data.name}})
    }
  }
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
      </>
  );
};

export default _layout;
