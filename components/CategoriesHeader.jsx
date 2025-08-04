import { memo } from 'react';
import { View, Text, Image } from 'react-native';
import SearchInput from './SearchInput';
import SorterComponent from './SorterComponent';
import { images } from '../constants';
import { getCourseCategories } from '../services/fetchingService';

const CatHeader = ({ showAllCategories, user, categories, updateSearchData, sortingData, sortCategories }) => {
  return (
    <View className="px-4">
      <View className="relative">
        <Text className="text-oBlack dark:text-white font-pmedium text-2xl mt-4">
            {showAllCategories ? "Të gjitha kategoritë" : `Të gjitha kurset për kategorinë ${getCourseCategories(user?.data?.categories, parseInt(categories))}`}
            <View>
                <Image
                source={images.path}
                resizeMode="contain"
                className="h-auto w-[100px] absolute -bottom-8 -left-12"
                />
            </View>
        </Text>
      </View>

      <View className="mt-6 pb-5 border-b border-gray-200 dark:border-black-200">
        <SearchInput
          searchFunc={updateSearchData}
          placeholder="Shkruani këtu kategorinë tuaj të dëshiruar"
          keyboardType="email-address"
          valueData={sortingData.searchData}
        />
      </View>

      <View className="mt-6 overflow-hidden">
        <SorterComponent
          showSorter={true}
          sortButton={sortCategories}
        />
      </View>
    </View>
  );
};
export default memo(CatHeader)