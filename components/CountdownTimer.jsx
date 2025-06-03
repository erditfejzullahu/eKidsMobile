import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const CountdownTimer = ({ meetingData, textStyle }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!meetingData?.scheduleDateTime) return;

    const targetDate = new Date(meetingData.scheduleDateTime).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        // The event has started or passed
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        setHasStarted(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setHasStarted(false);
    };

    // Update immediately
    updateCountdown();

    // Then update every second
    const timer = setInterval(updateCountdown, 1000);

    // Clean up on unmount
    return () => clearInterval(timer);
  }, [meetingData?.scheduleDateTime]);

  // Format the countdown in Albanian
  const formatCountdown = () => {
    const { days, hours, minutes, seconds } = timeLeft;
    const parts = [];

    if (days > 0) parts.push(`${days} ditë`);
    if (hours > 0) parts.push(`${hours} ore`);
    if (minutes > 0) parts.push(`${minutes} minuta`);
    if (seconds > 0 || parts.length === 0) parts.push(`${Math.floor(seconds)} sekonda`);

    return parts.join(' ');
  };

  if (!meetingData?.scheduleDateTime) {
    return <Text>Nuk ka orar të caktuar</Text>;
  }

  return (
    <View>
      {hasStarted ? (
        <Text className={`text-white font-psemibold uppercase ${textStyle}`}>Takimi ka filluar!</Text>
      ) : (
        <Text className={`text-white font-psemibold uppercase ${textStyle}`}>Nis për: {formatCountdown()}</Text>
      )}
    </View>
  );
};

export default CountdownTimer;