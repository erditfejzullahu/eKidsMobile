import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Animated, View, Text, Appearance } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useRef } from 'react';
import { colorScheme } from 'nativewind';
const ThemeToggle = () => {
  const { colorScheme: currentTheme } = useColorScheme();
  const [currentThemeSelected, setCurrentThemeSelected] = useState(currentTheme)
  
  const animatedValue = useRef(new Animated.Value(currentThemeSelected === 'dark' ? 1 : 0)).current;

  const handleToggle = () => {
    Animated.timing(animatedValue, {
      toValue: currentThemeSelected === 'dark' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    const newTheme = currentThemeSelected === 'light' ? 'dark' : 'light';
    setCurrentThemeSelected(newTheme)
    colorScheme.set(newTheme)
    // Appearance.setColorScheme('dark')
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 24],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleToggle}
      className="w-16 h-8 rounded-full px-1 justify-center"
      style={{
        backgroundColor: currentThemeSelected === 'dark' ? '#1e293b' : '#d9d9d9',
      }}
    >
      <Animated.View 
        className="w-7 h-7 rounded-full absolute items-center justify-center"
        style={{
          transform: [{ translateX }],
          backgroundColor: currentThemeSelected === '' ? '#f8fafc' : '#f59e0b',
        }}
      >
        {currentThemeSelected === 'dark' ? (
          <Text className="text-slate-800 text-sm">🌙</Text>
        ) : (
          <Text className="text-amber-600 text-sm">☀️</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ThemeToggle;