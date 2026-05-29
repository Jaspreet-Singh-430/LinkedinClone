import React from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { useQuery,useQueryClient,useMutation } from '@tanstack/react-query'
import AboutSection from '../components/AboutSection'
import ProfileHeader from '../components/ProfileHeader'
import ExperienceSection from '../components/ExperienceSection'
import EducationSection from '../components/EducationSection'
import SkillsSection from '../components/SkillsSection'
const Profile = ({authUser}) => {
    const {username} = useParams()
    const queryClient=useQueryClient()
    const {data:userProfile,isLoading:isUserProfileLoading}=useQuery({
        queryKey:['profile',username],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(`/users/${username}`);
                return response.data;
            }
            catch (error) {
                console.error('Error fetching authenticated user:', error);
                return null;
            }
        }
    })
    const {mutate:updateProfile}=useMutation({
        mutationFn: async (data) => await axiosInstance.put(`/users/profile`,data),
        onSuccess: () => {
            toast.success('Profile updated successfully!')
            queryClient.invalidateQueries({queryKey:['profile',username]})
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        }
    })
    if(isUserProfileLoading){
        return null;
    }
    const handleSave=(updatedData)=>{
        updateProfile(updatedData)
    }
    console.log(authUser)
    const isOwnProfile=authUser?.user?.username==userProfile.username
     const userData=isOwnProfile?authUser.user:userProfile
  return (
    <div className='max-w-4xl p-4 mx-auto'>
      <ProfileHeader authUser={authUser} userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
      <AboutSection authUser={authUser} userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
      <ExperienceSection authUser={authUser} userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
      <EducationSection authUser={authUser} userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
      <SkillsSection authUser={authUser} userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>

    </div>
  )
}

export default Profile
