import React from 'react'
import { useState } from 'react'
import { useQueryClient,useMutation } from '@tanstack/react-query';
import {axiosInstance} from '../lib/axios.js'
import { Image,Loader } from 'lucide-react';
import toast from 'react-hot-toast';
const PostCreation = ({user}) => {
  const [content, setContent] = useState('');
 const [image, setImage] = useState(null);
 const [imagePreview, setImagePreview] = useState(null);
 const queryClient = useQueryClient();
 const {mutate:createPostMutation,isPending}=useMutation({
  mutationFn: async (postData) => {
    const res=await axiosInstance.post("/posts/create",postData,{
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
  },
  onSuccess: (data) => {
    ResetForm();
    console.log('Post created successfully:', data);
    toast.success('Post created successfully!');
    queryClient.invalidateQueries({queryKey: ['posts']});
  },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post.');
    },
    });


  const handlePostCreation = async(e) => {
    e.preventDefault();
    try {
            const postData = {content};
            if(image){
            postData.image = await readFileAsDataURL(image);
            }
            createPostMutation(postData);
            
    }
    catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post.');
    }
    // Handle post submission logic here
  };

const ResetForm=()=>{
    setContent('');
    setImage(null);
    setImagePreview(null);
}

const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then((dataURL) => {
          setImagePreview(dataURL);
        })
        .catch((error) => {
          console.error('Error reading image file:', error);
          toast.error('Failed to read image file.');
        });
    }
    else {
        setImagePreview(null);
    }
  };
  
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
}
  return (
    <div className="bg-secondary rounded-lg p-4 shadow mb-4">
      {/* <h2>Create Post</h2>
      <p>Welcome, {user?.name}!</p> */}
    <div className='flex space-x-3'>
        <img
            src={user?.user?.profilePicture || "/avatar.png"}
            alt={user?.user?.name}
            className='w-12 h-12 rounded-full'
        />
        <textarea 
        placeholder="What's on your mind?"
        className='p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none
        resize-none transition-colors duration-200 min-h-[100px] w-full'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        >
        </textarea>
    </div>
        {imagePreview && (
            <div className= 'mt-4'>
                <img src={imagePreview} alt="Preview" className='max-h-auto w-full rounded-lg' />
                </div>
         )}
         <div className='flex items-center justify-between mt-4'>
            <div className="flex space-x-4">
              <label className='flex items-center cursor-pointer text-info hover:text-info-dark transition-colors duration-200'>
              <Image size={20} className="mr-2" />
              <span>Photo</span>
              <input type="file" accept='image/*' className='hidden' onChange={handleImageChange} />
            </label>
            </div>
            <button className='bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200'
            onClick={handlePostCreation}
            disabled={isPending}>
              {isPending ? <Loader className="size-5 animate-spin"/>:"Share"}
            </button>
         </div>       
    </div>
  )
}

export default PostCreation
