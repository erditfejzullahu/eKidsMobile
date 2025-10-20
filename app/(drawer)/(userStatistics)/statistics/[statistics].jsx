import { View, Text, Image, Dimensions, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { icons, images } from '../../../../constants';
import { LineChart } from 'react-native-chart-kit';
import * as Animatable from "react-native-animatable"
import useFetchFunction from '../../../../hooks/useFetchFunction';
import { GetStatisticsBasedOfType } from '../../../../services/fetchingService';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import Loading from '../../../../components/Loading';
import { useColorScheme } from 'nativewind';

const Statistics = () => {
  const {statistics} = useLocalSearchParams();  
  const {colorScheme} = useColorScheme();
  const {user, isLoading} = useGlobalContext(); 
  const year = new Date().getFullYear();
  
  const {data: statisticsDataResponse, refetch, isLoading: statisticsLoading} = useFetchFunction(() => GetStatisticsBasedOfType(user?.data?.userData?.id, year, statistics))
  const { width: screenWidth } = Dimensions.get('window');
  const [statisticsData, setStatisticsData] = useState(Array(12).fill(0))
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refetch();
    setIsRefreshing(false)
  }, [setIsRefreshing, refetch])

  useEffect(() => {
    refetch()
  }, [statistics])
  
  useEffect(() => {
    setStatisticsData(statisticsDataResponse || [0,0,0,0,0,0,0,0,0,0,0,0])
  }, [statisticsDataResponse]);
  

  const chartConfig = useMemo(() => ({
    backgroundGradientFrom: colorScheme === "dark" ? "#1E2923" : "#FFD3B6",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: colorScheme === "dark" ? "#08130D" : "#FFE8D6",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 156, 1, ${opacity})`,
    labelColor: (opacity = 1) => `${colorScheme === "dark" ? `rgba(255, 255 ,255, ${opacity})` : "#000"}`,
    strokeWidth: 2, // optional, default 3
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#FF9C01',
    },
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  }), [colorScheme]);

  const data = useMemo(() => ({
    labels: ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nentor", "Dhjetor"],
    datasets: [
      {
        data: statisticsData || [0,0,0,0,0,0,0,0,0,0,0,0],
        color: (opacity = 1) => `rgba(255, 156, 1, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: [`${statistics === "1" ? "Kurset e kryera" : statistics === "2" ? "Kurset offline te krijuara" : statistics === "3" ? "Kuizet e kryera" : statistics === "4" ? "Kuizet e krijuara" : statistics === "5" ? "Blogjet e krijuara" : statistics === "6" ? "Diskutimet e krijuara" : statistics === "7" ? "Takimet online te mbajtura" : statistics === "8" ? "Nderveprimet e tua ne Shokun e Mesimit" : "Undefined"}`] // optional
  }), [statisticsData, statistics]);
  
  const chartWidth = Math.max(screenWidth, data.labels.length * 80); // 80px per label

  if(isLoading || statisticsLoading || isRefreshing) return <Loading />
  return (
    <ScrollView 
      className="h-full bg-primary-light dark:bg-primary px-4"
      refreshControl={<RefreshControl tintColor="#ff9c01" colors={['#ff9c01', '#ff9c01', '#ff9c01']} refreshing={isRefreshing} onRefresh={onRefresh} />}>
      <View className="my-4 relative">
        <Text className="text-oBlack dark:text-white font-pmedium text-2xl">Statistikat per <Text className="text-secondary">{statistics === '1' ? "Kurset e kryera" : statistics === '2' ? "Kurset offline e krijuara" : statistics === '3' ? "Kuizet e kryera" : statistics === "4" ? "Kuizet e krijuara" : statistics === "5" ? "Blogjet" : statistics === "6" ? "Diskutimet" : statistics === "7" ? "Takimet online" : statistics === "8" ? "Nderveprimet" : "Undefined"}</Text>
        <View>
            <Image
                source={images.path}
                className="h-auto w-[100px] absolute -bottom-8 -left-12"
                resizeMode='contain'
            />
        </View>
        </Text>
        <View className="absolute flex items-center justify-center left-0 -bottom-8 z-20">
            <Animatable.View 
                animation={{
                    0: { translateX: 0, opacity: 1 },   // Start position
                    0.5: { translateX: 10, opacity: 1 }, // Moves slightly to the right
                    1: { translateX: 0, opacity: 0.2 }  // Comes back & fades out
                }} 
                duration={2000} iterationCount="infinite">
                <Image
                    source={icons.rightArrow}
                    tintColor={colorScheme === "dark" ? "#fff" : "#000"}
                    className="size-8 bg-oBlack-light dark:bg-oBlack p-2 border-gray-200 dark:border-black-200 rounded-lg"
                    resizeMode='contain'
                />
            </Animatable.View>
        </View>
      </View>

      <View className="mt-4">
        <ScrollView horizontal className="bg-oBlack-light dark:bg-oBlack rounded-[5px] overflow-hidden border border-gray-200 dark:border-black-200">
          <LineChart 
            data={data}
            height={320}
            width={chartWidth}
            chartConfig={chartConfig}
          />
        </ScrollView>
        <View className="mt-4 border-t border-gray-200 dark:border-black-200 pt-4">
          <Text className="text-oBlack dark:text-white font-plight text-sm">Angazhimet tuaja shfaqen ne baze te muajve te vitit dhe keto statistika mund te shihen nga te gjithe perdoruesit e <Text className="text-secondary font-psemibold">ShokuMesimit</Text> duke pasqyruar dedikimin tuaj ne fusha dhe kategori te ndryshme te nevojshme per ngritje personale tuajen apo te te tjereve!</Text>
          <Text className="text-oBlack dark:text-white font-plight text-sm mt-4">Per te shikuar te gjithe krijimtarine tuaj mund te shkoni tek seksioni i <Link className="text-secondary font-psemibold underline" href={`/profile`} accessibilityRole="link">Profilit</Link> kurse per te shikuar krijimtarine e perdoruesve te tjere mund te shkoni tek seksioni i <Link className="text-secondary font-psemibold underline" href={`/all-messages`}>Lajmetarit</Link> dhe te percillni gjendjen e te gjithe perdoruesve!</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default Statistics