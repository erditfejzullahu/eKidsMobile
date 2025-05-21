import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../../constants';
import FormField from '../../../components/FormField';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useGlobalContext } from '../../../context/GlobalProvider';
import QuizCreate from '../../../components/QuizCreate';

const AddQuiz = () => {
  const [form, setForm] = useState({
    category: '',
    quizName: '',
    quizDescription: ''
  });

  const [formErrors, setFormErrors] = useState({
    category: false,
    quizName: false,
    quizDescription: false
  });

  const [touchedFields, setTouchedFields] = useState({
    category: false,
    quizName: false,
    quizDescription: false
  });

  // Validate form whenever form values change
  useEffect(() => {
    validateForm();
  }, [form]);

  const validateForm = () => {
    const newErrors = {
      category: form.category === '',
      quizName: form.quizName === '' || form.quizName.length < 4,
      quizDescription: form.quizDescription === '' || form.quizDescription.length < 8
    };
    setFormErrors(newErrors);
  };

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleCreateSuccess = (data) => {
    if (data === true) {
      setForm({
        category: '',
        quizName: '',
        quizDescription: ''
      });
      // Reset touched fields on success
      setTouchedFields({
        category: false,
        quizName: false,
        quizDescription: false
      });
    }
  };

  const { user } = useGlobalContext();
  const userCategories = user?.data?.categories || [];

  return (
    <KeyboardAwareScrollView 
      style={styles.container}
      className="h-full bg-primary px-4"
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={50}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mt-4 border-b pb-4 mb-4 border-black-200">
        <Text className="text-2xl font-pmedium text-white mb-6">
          Shtoni kuizet tuaja!
          <View>
            <Image 
              source={images.path}
              className="h-auto w-[100px] absolute -bottom-8 -left-12"
              resizeMode='contain'
            />
          </View>
        </Text>
        <Text className="text-gray-400 text-xs font-plight mb-2">
          Duke plotesuar fushat e meposhtme ju beni kerkesen per paraqitjen e kuizit tuaj tek 
          <Text className="text-secondary font-pmedium"> ShokuMesimit</Text>
        </Text>
        <Text className="text-gray-400 text-xs font-plight">
          Pas verifikimit nga ana jone, ju arrini rolin e 
          <Text className="text-secondary font-pmedium"> Pionerit</Text> dhe perfitoni nga angazhimet e studenteve tone!
        </Text>
      </View>

      <View className="border-b border-black-200 mb-5 pb-1">
        <FormField 
          title={"Emri i kuizit tuaj"}
          placeholder={"Shkruani ketu emrin e kuizit tuaj"}
          value={form.quizName}
          handleChangeText={(e) => handleFieldChange('quizName', e)}
          onBlur={() => handleBlur('quizName')}
        />
        <Text className="text-xs text-gray-400 font-plight mt-1">
          Emri qe do shfaqet ne shfletim te kurseve.
        </Text>
        {touchedFields.quizName && formErrors.quizName && (
          <Text className="text-red-500 text-xs font-plight">
            {form.quizName === '' 
              ? "Emri i kuizit eshte i domosdoshem" 
              : "Emri duhet te kete te pakten 4 karaktere"}
          </Text>
        )}

        <FormField 
          title={"Pershkrimi i kuizit tuaj"}
          placeholder={"Shkruani ketu pershkrimin e kuizit tuaj"}
          otherStyles={"mt-7"}
          value={form.quizDescription}
          handleChangeText={(e) => handleFieldChange('quizDescription', e)}
          onBlur={() => handleBlur('quizDescription')}
          multiline={true}
          numberOfLines={4}
        />
        <Text className="text-xs text-gray-400 font-plight mt-1">
          Pershkrim i shkurte i kuizit.
        </Text>
        {touchedFields.quizDescription && formErrors.quizDescription && (
          <Text className="text-red-500 text-xs font-plight">
            {form.quizDescription === '' 
              ? "Pershkrimi i kuizit eshte i domosdoshem" 
              : "Pershkrimi duhet te kete te pakten 8 karaktere"}
          </Text>
        )}

        <Text className="text-base text-gray-100 font-pmedium mt-7">
          Kategorizimi i kuizit tuaj
        </Text>
        <Picker
          selectedValue={form.category}
          onValueChange={(value) => handleFieldChange('category', value)}
          style={pickerSelectStyles}
          itemStyle={{color: "#fff", fontFamily: "Poppins-Regular"}}
        >
          <Picker.Item label="Zgjidhni kategorinë" value="" />
          {userCategories.map((category) => (
            <Picker.Item 
              key={category.CategoryID} 
              label={category.categoryName} 
              value={category.CategoryID.toString()}
            />
          ))}
        </Picker>
        <Text className="text-xs text-gray-400 font-plight mt-1">
          Zgjidhni se cfare kategorizimi i perket kuizit.
        </Text>
        {touchedFields.category && formErrors.category && (
          <Text className="text-red-500 text-xs font-plight">
            Kategorizimi eshte i domosdoshem
          </Text>
        )}
      </View>

      <View>
        <Text className="text-white text-xl mb-4 font-pmedium">
          Paraqitni detajet e kuizit!
          <View>
            <Image 
              source={images.path}
              className="h-auto w-[70px] absolute -bottom-8 -left-8"
              resizeMode='contain'
            />
          </View>
        </Text>
        <Text className="text-gray-400 text-xs font-plight mb-2">
          Plotesoni fushat perkatese ne te cilat jane te mundesuara 
          <Text className="text-secondary font-pmedium"> Pyetjet</Text>, 
          <Text className="text-secondary font-pmedium"> Pergjigjjet</Text> dhe 
          <Text className="text-secondary font-pmedium"> Pergjigjjet e sakta</Text>
        </Text>
      </View>
      
      <QuizCreate 
        quizDetails={form}
        sendSuccess={handleCreateSuccess}
        isFormValid={!Object.values(formErrors).some(error => error)}
      />
    </KeyboardAwareScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'rgb(35 37 51)',
    borderRadius: 16,
    marginTop:7,
    color: 'rgba(255,255,255)',
    paddingLeft: 16,
    height:64,
    backgroundColor:'rgb(30 30 45)',
    fontWeight:'700',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'rgb(35 37 51)',
    borderRadius: 16,
    marginTop:7,
    color: 'rgba(255,255,255)',
    paddingLeft: 16,
    height:64,
    backgroundColor:'rgb(30 30 45)',
    fontWeight:'700'
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default AddQuiz;
