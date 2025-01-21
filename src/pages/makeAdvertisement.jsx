import React from 'react'
import MakeAd from '../components/makeAdvertisement/makeAd'
import MakeForm from '../components/makeAdvertisement/makeForm'
import  useLocalStorage  from '../customHooks/useLocalStorage';
import { useUserContext, fetchUser, useUserDispatchContext } from '../customHooks/UserContext';
import { nanoid } from 'nanoid';

const MakeAdvertisement = () => {
    const user = useUserContext();
    const dispatch = useUserDispatchContext();
    const [advertisement, setAdvertisement] = useLocalStorage('advertisement',initialAd);

    const handleAdChange = (newAd)=>{
      setAdvertisement(newAd);
    }

    const handlePublish = ()=>{

      const uniqueId = nanoid();

      async function publishToDatabase() {
        
        // creating ad
        const response1 = await fetch("http://localhost:5000/createAd",{
          method: 'POST',
          headers: {
            "Content-Type": "application/json", // Content type of the request body
          },
          body: JSON.stringify({
            ad: {
              ...advertisement,
              advertisementId: `ad${uniqueId}`,
              creatorId: user.userId,
              creator: user.name
            }
          })
        })

        const data1 = await response1.json();

        // updating user

        const response2 = await fetch("http://localhost:5000/modifyUser",{
          method: 'POST',
          headers: {
            "Content-Type": "application/json", // Content type of the request body
          },
          body: JSON.stringify({
            userId: user.userId,
            updates: {
              madeAds: [...user.madeAds,{id: `ad${uniqueId}`}]
            }
          })
        })
        const data2 = await response2.json();
        console.log(data2.message);
        fetchUser(dispatch);
      }
      publishToDatabase();
    }

  return (
    <div>
      <MakeAd advertisement={advertisement} setAdvertisement={handleAdChange}/>
      <MakeForm advertisement={advertisement} setAdvertisement={handleAdChange}/>
      <div className='flex justify-between items-center w-full mt-10 p-6 bg-gray-100  dark:bg-gray-900'>
          <div className='flex w-full gap-x-2'>
            <h1 className='font-bold'>Status:</h1>
            <p>Start date missing</p>
          </div>
          <div className='flex w-full gap-x-2'>
            <h1 className='font-bold'>By:</h1>
            <p>{user.name}</p>
          </div>
          <button
          onClick={handlePublish}
          className='px-3 py-[6px] bg-purple-600 border-2 rounded-sm border-purple-700 text-white text-xl transition-transform duration-300 hover:scale-105 active:bg-purple-700'>
            Publish
          </button>
      </div>
    </div>
  )
}

export default MakeAdvertisement


const initialAd = {
  id: 0,
  title: '',
  sequence: [],
  deadline: '',
  creator: '',
  creatorId: '',
  formSequence: [],
  formStartDate: ''
}