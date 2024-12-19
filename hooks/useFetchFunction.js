import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import apiClient from '../services/apiClient';

const useFetchFunction = (fn) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
      try {
          setIsLoading(true)
          const response = await fn();
          setData(response);
      } catch (error) {
          console.error(error);
          setData(null);
      } finally {
          setIsLoading(false);
      }
    }

    useEffect(() => {

      fetchData();
    }, [])

    const refetch = () => fetchData();

    return { data, refetch, isLoading }
    
}

export default useFetchFunction