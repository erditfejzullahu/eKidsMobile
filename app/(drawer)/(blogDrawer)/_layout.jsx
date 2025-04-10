import { View, Text, Button, ScrollView, Image, TextInput, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Drawer } from 'react-native-drawer-layout';
import { Link, Stack } from 'expo-router';
import { Dimensions } from 'react-native';
import { images } from '../../../constants';
import {useGlobalContext} from '../../../context/GlobalProvider'
import TagsByCategories from '../../../components/TagsByCategories';
import { useBlogsDrawerContext } from '../../../context/BlogsDrawerProvider';
import BlogsDrawerContext from "../../../context/BlogsDrawerProvider"
import { useTopbarUpdater } from '../../../navigation/TopbarUpdater';
import BlogsDrawyerHeader from '../../../components/BlogsDrawyerHeader';
import { getTagsByTitle } from '../../../services/fetchingService';
import _ from 'lodash';
import useFetchFunction from '../../../hooks/useFetchFunction';
import DiscussionTagsLayout from '../../../components/DiscussionTagsLayout';
import Loading from '../../../components/Loading';
import EmptyState from '../../../components/EmptyState';

const TagsHeader = () => {
  const {user, isLoading} = useGlobalContext();
  const userCategories = user?.data?.categories;
  // console.log(userCategories);
  const {discussionSection} = useTopbarUpdater();
  const [isDiscussionSection, setIsDiscussionSection] = useState(false)

  const [discussionTagData, setDiscussionTagData] = useState([])

  const {data, isLoading: discussionTagLoading, refetch} = useFetchFunction(() => isDiscussionSection ? getTagsByTitle(null) : {})

  useEffect(() => {
    if(data){
      setDiscussionTagData(data)
    }
  }, [data])
  

  useEffect(() => {
    if(discussionSection){
      setIsDiscussionSection(true)
      refetch()
    }else{
      setIsDiscussionSection(false)
      setDiscussionTagData([])
    }
  }, [discussionSection])

  const GetTags = async (tagInput) => {
    console.log(tagInput)
    if(tagInput.length > 1){
      const response = await getTagsByTitle(tagInput)
      console.log(response);
      
      if(response){
        setDiscussionTagData(response);
      }else{
        setDiscussionTagData([])
      }
    }
  }
  
  const debounceTagsData = useCallback(
    _.debounce((text) => {
      GetTags(text);
    }, 500), []
  )
  
  useEffect(() => {
    return () => {
      debounceTagsData.cancel();
    }
  }, [])
  
  if(discussionSection){
    if(discussionTagLoading) return <Loading />
  }
  return (
    //tek pjesa e ketij hederi i qes krejt etiketimet me accordions ne baze te kategorive // etiketimet duhet me pas mundesin me pas underetiketime
    <FlatList
      className="flex-1 bg-oBlack p-4 border-r border-black-200"
      contentContainerStyle={{flexGrow: 1, gap: 6}}
      data={isDiscussionSection ? discussionTagData : userCategories}
      keyExtractor={(item) => isDiscussionSection ? item.id : 'kategoria-' + item?.CategoryID}
      renderItem={({item}) => (
        isDiscussionSection
          ? <DiscussionTagsLayout item={item}/>
          : <TagsByCategories categories={item}/> 
      )}
      ListHeaderComponent={() => (
        <BlogsDrawyerHeader sendInput={(input) => debounceTagsData(input)} />
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
            title={isDiscussionSection ? "Nuk ka etiketime diskutimi" : "Nuk ka te dhena blogu"}
            subtitle={"Nese mendoni qe eshte gabim kontaktoni Panelin e Ndihmes"}
            isSearchPage={true}
            buttonTitle={"Paraqitni ankese"}
            buttonFunction={() => {}}
          />
        </View>
      )}
      />
      

  );
};

const _layout = () => {
  const {isDrawerOpened, setIsDrawerOpened} = useBlogsDrawerContext();
  // const [isDrawerOpen, setDrawerOpen] = useState(isDrawerOpened);
  return (
    <>
      <Drawer
        drawerPosition="left"
        open={isDrawerOpened}
        onOpen={() => setIsDrawerOpened(true)}
        onClose={() => setIsDrawerOpened(false)}
        renderDrawerContent={() => <TagsHeader />}
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
