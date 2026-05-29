import React, { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/sidebar.jsx'
import Post from '../components/post.jsx'
import { axiosInstance } from '../lib/axios.js'
const PostPage = ({authUser}) => {
    const {postId} = useParams()
    const {data:post,isLoading}=useQuery({
        queryKey:["post",postId],
        queryFn:async()=>{
          const response=await axiosInstance.get(`/posts/${postId}`)
          return response.data
        },

        onSuccess:()=>{
          console.log(post)
        }
          
    })
    if(isLoading){
        return <div>Loading post...</div>
    }
    if(!post){
        return <div>Post not found</div>
    }
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar user={authUser}/>
      </div>
      <div className='col-span-1 lg:col-span-3'>
      <Post authUser={authUser} post={post}/>
      </div>
    </div>
  )
}

export default PostPage
