import { View, Text, Image, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { icons, images } from '../../../../constants';
import { LineChart } from 'react-native-chart-kit';
import * as Animatable from "react-native-animatable"

const statistics = () => {
  const {statistics} = useLocalSearchParams();  
  console.log(statistics);

  const { width: screenWidth } = Dimensions.get('window');


  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 156, 1, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255 ,255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#FF9C01',
    },
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const data = {
    labels: ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nentor", "Dhjetor"],
    datasets: [
      {
        data: [30, 45, 28, 80, 99, 43, 50, 75, 40, 60, 70, 90],
        color: (opacity = 1) => `rgba(255, 156, 1, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: [`${statistics === "1" ? "Kurset e krijuara" : statistics === "2" ? "Kuizet e krijuara" : statistics === "3" ? "Blogjet e krijuara" : "Nderveprimet e tua ne Shokun e Mesimit"}`] // optional
  };
  
  const chartWidth = Math.max(screenWidth, data.labels.length * 80); // 80px per label

  return (
    <ScrollView className="h-full bg-primary px-4">
      <View className="my-4 relative">
        <Text className="text-white font-psemibold text-2xl">Statistikat per <Text className="text-secondary">{statistics === '1' ? "Kurset" : statistics === '2' ? "Kuizet" : statistics === '3' ? "Blogs" : "Nderveprimet"}</Text>
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
                    tintColor={"#fff"}
                    className="size-8 bg-oBlack p-2 border rounded-lg"
                    resizeMode='contain'
                />
            </Animatable.View>
        </View>
      </View>

      <View className="mt-4">
        <ScrollView horizontal className="bg-oBlack rounded-[5px] overflow-hidden border border-black-200">
          <LineChart 
            data={data}
            height={320}
            width={chartWidth}
            chartConfig={chartConfig}
          />
        </ScrollView>
        <View className="mt-4 border-t border-black-200 pt-4">
          <Text className="text-white font-plight text-sm">Angazhimet tuaja shfaqen ne baze te muajve te vitit dhe keto statistika mund te shihen nga te gjithe perdoruesit e <Text className="text-secondary font-psemibold">ShokuMesimit</Text> duke pasqyruar dedikimin tuaj ne fusha dhe kategori te ndryshme te nevojshme per ngritje personale tuajen apo te te tjereve!</Text>
          <Text className="text-white font-plight text-sm mt-4">Per te shikuar te gjithe krijimtarine tuaj mund te shkoni tek seksioni i <Link className="text-secondary font-psemibold underline" href={`/profile`}>Profilit</Link> kurse per te shikuar krijimtarine e perdoruesve te tjere mund te shkoni tek seksioni i <Link className="text-secondary font-psemibold underline" href={`/all-messages`}>Lajmetarit</Link> dhe te percillni gjendjen e te gjithe perdoruesve!</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default statistics