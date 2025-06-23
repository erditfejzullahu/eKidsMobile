import { View, Text, FlatList, RefreshControl, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { icons } from '../../../../constants';
import useFetchFunction from '../../../../hooks/useFetchFunction';
import { getBlogById } from '../../../../services/fetchingService';
import Loading from '../../../../components/Loading';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import BlogCardComponent from '../../../../components/BlogCardComponent';
import * as Animatable from "react-native-animatable";
import { useShadowStyles } from '../../../../hooks/useShadowStyles';

const Blogs = () => {
    const {shadowStyle} = useShadowStyles();
    const { blogs, userId, userPhoto } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useGlobalContext();
    const { data, isLoading, refetch } = useFetchFunction(() => getBlogById(blogs, userId));
    const [blogData, setBlogData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = async () => {
        setIsRefreshing(true);
        setBlogData([]);
        await refetch();
        setIsRefreshing(false);
    };

    useEffect(() => {
        if (data) {
            setBlogData(Array.isArray(data) ? data : [data]);
        } else {
            setBlogData([]);
        }
    }, [data]);
    
    useEffect(() => {
        setBlogData([]);
        refetch();
    }, [blogs]);

    if (isLoading || isRefreshing) return <Loading />;

    return (
        <FlatList
            className="bg-primary-light dark:bg-primary"
            data={blogData}
            keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
            refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}
            ListHeaderComponent={
                <View className="bg-oBlack-light dark:bg-oBlack border-b border-t border-gray-200 dark:border-black-200 flex-row items-center" style={shadowStyle}>
                    <View className="border-r border-gray-200 dark:border-black-200 p-2 flex-[0.25] items-center">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Image
                                source={icons.leftArrow}
                                className="w-6 h-6"
                                resizeMode='contain'
                                tintColor={"#ff9c01"}
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 flex-row items-center gap-2 p-2 justify-center border-r border-gray-200 dark:border-black-200">
                        <Text className="text-oBlack dark:text-white font-psemibold text-lg">ShokuMesimit</Text>
                        <Image 
                            source={icons.star}
                            className="h-4 w-4"
                            tintColor={"#ff9c01"}
                            resizeMode='contain'
                        />
                    </View>
                    <View className="flex-[0.25] p-2 items-center">
                        <TouchableOpacity onPress={() => router.replace(`/users/${userId}`)}>
                            <Image 
                                source={{ uri: userPhoto }}
                                className="w-10 h-10 rounded-full border border-black-200"
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            }
            renderItem={({ item }) => (
                <View className="px-4 my-4">
                    <BlogCardComponent 
                        blog={item}
                        userData={user}
                        fullBlogSection={true}
                    />
                </View>
            )}
            ListFooterComponent={
                <Animatable.View animation="fadeInLeft" duration={1000} className="mb-4 mx-4 pt-3 mt-3 border-t border-gray-200 dark:border-black-200">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-oBlack dark:text-white text-xl font-psemibold">Permbledhja e blogut</Text>
                        <Image 
                            source={icons.star}
                            className="size-4"
                            tintColor={"#ff9c01"}
                        />
                        <Text className="text-secondary font-pblack text-lg">AI</Text>
                    </View>
                    <View className="p-4  border-gray-200 dark:border-black-200 border rounded-md mt-2">
                        <Text className="text-gray-600 dark:text-gray-400 text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti saepe vero quasi sit quod minima aut dicta quae possimus cumque, ratione perferendis tempore dolor accusantium placeat, error, delectus nisi ducimus?</Text>
                    </View>
                </Animatable.View>
            }
        />
    );
};

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
});

export default Blogs;