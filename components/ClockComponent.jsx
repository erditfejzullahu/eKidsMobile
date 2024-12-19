import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

const ClockComponent = ({ onTimeChange }) => {
    const [time, setTime] = useState({minutes: 0, seconds: 0})

    useEffect(() => {
      const interval = setInterval(() => {
        setTime((prevTime) => {
            let {minutes, seconds} = prevTime;
            seconds += 1;

            if(seconds === 60) {
                seconds = 0;
                minutes += 1;
            }

            const updatedTime = {minutes, seconds};
      
            if(onTimeChange){
              onTimeChange(updatedTime)
            }

            return updatedTime;
        })
      }, 1000);

    
      return () => clearInterval(interval)
    }, [onTimeChange])

    const formatTime = (num) => (num < 10 ? `0${num}` : num);
    
  return <Text className="text-white font-pregular text-sm text-center">{formatTime(time.minutes)}:{formatTime(time.seconds)}</Text>
}

export default ClockComponent