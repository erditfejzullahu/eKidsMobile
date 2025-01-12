import { View, Text, Button, ScrollView, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Drawer } from 'react-native-drawer-layout';
import { Link, Stack } from 'expo-router';
import { Dimensions } from 'react-native';
import { images } from '../../../constants';
import {useGlobalContext} from '../../../context/GlobalProvider'
import TagsByCategories from '../../../components/TagsByCategories';

const TagsHeader = () => {
  const {user, isLoading} = useGlobalContext();
  const userCategories = user?.data?.categories;
  console.log(userCategories);
  
  
  return (
    //tek pjesa e ketij hederi i qes krejt etiketimet me accordions ne baze te kategorive // etiketimet duhet me pas mundesin me pas underetiketime
    <FlatList
      className="flex-1 bg-oBlack p-4 border-r border-black-200"
      contentContainerStyle={{flexGrow: 1, gap: 6}}
      data={userCategories}
      keyExtractor={(item) => 'kategoria-' + item?.CategoryID}
      renderItem={({item}) => (
        <TagsByCategories categories={item}/>
      )}
      ListHeaderComponent={() => (
        <View className="mb-6">
          <Text className="text-white font-psemibold text-xl">Shfletoni etiketimet
            <View>
              <Image
                source={images.path}
                className="h-auto w-[100px] absolute -bottom-8 -left-12"
                resizeMode='contain'
              />
            </View>
          </Text>
        </View>
      )}
      ListFooterComponentStyle={{flexGrow: 1, justifyContent: "flex-end"}}
      ListFooterComponent={() => (
        <View className="py-2 border-t border-black-200 mb-2">
          <Text className="text-white font-plight text-xs">Realizuar nga <Text className="text-secondary font-psemibold">Murrizi Co.</Text></Text>
        </View>
      )}
      />
      

  );
};

const _layout = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <Drawer
        drawerPosition="left"
        open={isDrawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
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
