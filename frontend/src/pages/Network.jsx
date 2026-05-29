import React from 'react'
import {useQuery} from '@tanstack/react-query'
import FriendRequest from '../components/FriendRequest'
import { axiosInstance } from '../lib/axios'
import UserCard from '../components/UserCard'
import Sidebar from '../components/sidebar'
import { UserPlus } from 'lucide-react'
const Network = ({authUser}) => {
    const {data:connectionRequests}=useQuery({
        queryKey:['connectionRequests'],
        queryFn: async () => {
            const response = await axiosInstance.get('/connections/requests');
            return response.data;
        }
    })
    const {data:connections}=useQuery({
        queryKey:['connections'],
        queryFn: async () => {
            const response = await axiosInstance.get('/connections');
            return response.data;
        }
        // onSuccess:(data)=>{
        //     console.log(data.length)
        // }
    })
    //   {console.log(connections)}
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser}></Sidebar>
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className='bg-secondary rounded-lg shadow mb-6 p-6'>
        <h1 className='text-2xl fot-bold mb-6'>My Network</h1>
        {connectionRequests?.length > 0 ? (
            <div className='mb-8'>
                <h2 className='text-xl mb-2 font-semibold'>Connection Requests</h2>
                <div className='space-y-4'>
                {connectionRequests.map((request) => (
                    <FriendRequest key={request._id} request={request}></FriendRequest>
                ))}
                </div>

            </div>
        ):(
          
            <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
                <UserPlus size={48} className="mx-auto text-gray-400 mb-4"/>
                <h3 className='text-xl font-semibold mb-2'>No connection requests</h3>
                <p className='text-gray-600'>You don't have any connection requests at the moment</p>
                <p className='text-gray-600 mt-2'>
                    Explore suggested connections to expand your network
                </p>
            </div>
        )}
        <div className="flex md:flex-col-3 flex-col-1 gap-4">

        {connections?.length > 0 && (
            connections.map((connection) => (
                <UserCard key={connection._id} user={connection} isConnection={true}/>
            ))
        )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Network
