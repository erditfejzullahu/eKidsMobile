import { View, Text, FlatList, Image, ImageBackground, StyleSheet, Platform } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Animatable from 'react-native-animatable';
import { images } from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

const zoomIn = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1.0
    }
}

const zoomOut = {
    0: {
        scale: 1
    },
    1: {
        scale: 0.9
    }
}

const SlidersItem = ({ activeItem, item, onPress }) => {
    // console.log(activeItem, ' ' , item.CategoryID);
    const {colorScheme} = useColorScheme();
    return (
        <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.8}>
            <Animatable.View
                className="mr-2"
                animation={activeItem == item.CategoryID ? zoomIn : zoomOut}
                duration={500}
                style={colorScheme === 'light' ? styles.lightBox : styles.darkBox}
            >
                <ImageBackground
                    source={images.testimage}
                    className={`w-52 h-28 overflow-hidden rounded-[15px] border-2 border-gray-200 dark:border-black-200`}
                    resizeMode="cover"
                />
                <Text className="text-oBlack dark:text-white uppercase text-center mt-2 text-base font-pbold">{item.categoryName}</Text>
            </Animatable.View>
        </TouchableOpacity>
    )
}

const Sliders = ({ posts = [], keyID, dataCategory }) => {
    
    const router = useRouter();
    
    const [activeItem, setActiveItem] = useState(posts[2]?.CategoryID || null)
    // console.log(activeItem);
    const [emptyData, setEmptyData] = useState(false)

    useEffect(() => {
        if (posts.length === 0) {
            setEmptyData(true)
        } else {
            setEmptyData(false)
        }
    }, [posts])

    
    

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if(viewableItems.length > 0) {
            setActiveItem(viewableItems[0]?.item?.CategoryID)
            // console.log(viewableItems[0]?.item.CategoryID, '????');
            
        }
        // console.log(viewableItems[0]?.key);
    }).current

    const handlePress = (item) => {
        // console.log(item.CategoryID);
        router.push(`/categories/${item.CategoryID}`)
    }

  return (
    <FlatList 
        data={posts}
        className="py-4 rounded-[10px]"
        keyExtractor={(item) => item?.[keyID]?.toString() || ''}
        renderItem={({ item }) => (
            <SlidersItem activeItem={activeItem} item={item} onPress={handlePress}/>
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
            itemVisiblePercentThreshold: 50, // Ensures the item is 50% visible to count
        }}
        contentOffset={{ x: (posts[0]?.CategoryID && 3 * 100) || 0, // Adjust `100` based on the width of an item + spacing
            y: 0, }}
        horizontal={!emptyData}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => (
            <View className="w-full justify-center">
                {dataCategory === "categories" ? (
                    <>
                        <Text className="text-white text-xl font-psemibold text-center">Nuk është gjetur ndonjë kategori!</Text>
                        <Text className="text-gray-100 text-xs mt-1 text-center">Ju lutem kontaktoni Seksionin e Ndihmës apo bëni kërkesën e krijimit të një kategorizimi të ri!</Text> 
                   </>
                ) : (
                    <>
                        <Text className="text-white text-xl font-psemibold text-center">Nuk është gjetur ndonjë e dhënë!</Text>
                        <Text className="text-gray-100 text-xs mt-1 text-center">Ju lutem kontaktoni Seksionin e Ndihmës apo bëni kërkesën e krijimit të materialit në bazë të paraqitjes në aplikacion!</Text>
                    </>
                )}
            </View>
        )}
    />
  )
}

const styles = StyleSheet.create({
    lightBox: {
        ...Platform.select({
            ios: {
                shadowColor: "#b8e1ff",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
              },
              android: {
                elevation: 8,
              },
        })
    },
    darkBox: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
              },
              android: {
                elevation: 8,
              },
        })
    },
})

export default Sliders