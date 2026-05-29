import React from 'react'
import {axiosInstance} from '../../lib/axios.js'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast';
import Sidebar from '../../components/sidebar.jsx';
import PostCreation from '../../components/postCreation.jsx';
import Post from '../../components/post.jsx';
import {Users} from "lucide-react"
import RecommendedUser from '../../components/RecommendedUser.jsx';
const Home = ({authUser}) => {
  const {data:recommendedUsers}=useQuery({
    queryKey:['recommendedUsers'],
    queryFn: async () => {
        try {
          const response = await axiosInstance.get('/users/suggestions');
          return response.data;
        }
        catch (error) {
          console.error('Error fetching recommended users:', error);
          toast.error(error.response?.data?.message || 'Failed to fetch recommended users.');
          return [];
        }
    }
  });
  const {data:recommendedPosts}=useQuery({
    queryKey:['recommendedPosts'],
    queryFn: async () => {
        try {
          const response = await axiosInstance.get('/posts');
          return response.data;
        }
        catch (error) {
          console.error('Error fetching recommended posts:', error);
          toast.error(error.response?.data?.message || 'Failed to fetch recommended posts.');
          return [];
        }
    }
  });
  console.log("Recommended Users:", recommendedUsers);
  console.log("Recommended Posts:", recommendedPosts);
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1'>
      <Sidebar user={authUser}></Sidebar>
      </div>
    <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
      <PostCreation user={authUser}></PostCreation>
      {recommendedPosts?.map(post => <Post key={post._id} post={post} authUser={authUser} />)}
      {recommendedPosts?.length===0 && (
        <div className='text-center bg-white rounded-lg shadow p-8'>
          <div className="mb-6">
            <Users size={64} className="mx-auto text-blue-500"/>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">No Posts Yet</h2>
          <p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
        </div>
      )}
    </div>
    {recommendedUsers?.length>0 && (
      <div className='hidden lg:block col-span-1'>
        <div className='bg-secondary rounded-lg shadow p-4'>
          <h2 className='font-semibold mb-4'>People you may know</h2>
          {recommendedUsers.map(user => (
          <RecommendedUser key={user._id} user={user} />    
        ))}
        </div>
      </div>
  )
}
</div>
  )
}

export default Home
