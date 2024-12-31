import {useEffect, useState} from 'react'
import { useRouter } from 'expo-router';

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

export const navigateToMessenger = (router, otherUserData, currentUserData) => {
  if(!router) return console.log('missing router');
  
  if(!otherUserData || !currentUserData) return console.log('Missing details');

  router.push({
      pathname: `(messenger)/${otherUserData?.id}`,
      params: {
          receiverFirstname: otherUserData.firstname,
          receiverUsername: otherUserData.username,
          receiverLastname: otherUserData.lastname,
          receiverProfilePic: otherUserData.profilePictureUrl,
          currentUserFirstName: currentUserData.firstname,
          currentUserLastname: currentUserData.lastname,
          currentUserProfilePic: currentUserData.profilePictureUrl,
          currentUserUsername: currentUserData.username,
      }
  })
}


export default useFetchFunction