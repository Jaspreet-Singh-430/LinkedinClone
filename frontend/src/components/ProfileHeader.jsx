import React,{useState,useMemo} from 'react'
import { useQueryClient,useQuery,useMutation} from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { UserCheck,X,UserPlus,MapPin,Camera } from 'lucide-react';
const ProfileHeader = ({authUser,userData,onSave,isOwnProfile}) => {
  console.log(userData)
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData,setEditedData] = useState({})
  const {data:connectionStatus,refetch:refetchConnectionStatus}=useQuery({
  queryKey:['connectionStatus',userData._id],
  queryFn:async ()=>{
    const response=await axiosInstance.get(`/connections/status/${userData._id}`)
    return response.data

  },
  enabled:!isOwnProfile
  })
  const isConnected=userData.connections.some((connectionId)=>connectionId==authUser.user._id)

  const {mutate:sendConnectionRequest}=useMutation({
    mutationFn: (userId) => {
      axiosInstance.post(`/connections/request/${userId}`)
    },
    onSuccess:()=>{
      toast.success('Connection request sent successfully!')
      refetchConnectionStatus()
      queryClient.invalidateQueries({queryKey:['connectionRequests']})
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send connection request.');
    }
  })
  const {mutate:acceptConnectionRequest}=useMutation({
    mutationFn: (requestId) => {
      axiosInstance.put(`/connections/accept/${requestId}`)
    },
    onSuccess:()=>{
      toast.success('Connection request accepted successfully!')
      refetchConnectionStatus()
      queryClient.invalidateQueries({queryKey:['connectionRequests']})
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to accept connection request.');
    }
  })
  const {mutate:declineConnectionRequest}=useMutation({
    mutationFn: (requestId) => {
      axiosInstance.put(`/connections/reject/${requestId}`)
    },
    onSuccess:()=>{
      toast.success('Connection request declined')
      refetchConnectionStatus()
      queryClient.invalidateQueries({queryKey:['connectionRequests']})
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject connection request.');
    }
  })
  const {mutate:removeConnection}=useMutation({
    mutationFn: (connectionId) => {
      axiosInstance.delete(`/connections/${connectionId}`)
    },
    onSuccess:()=>{
      toast.success('Connection removed successfully!')
      refetchConnectionStatus()
      queryClient.invalidateQueries({queryKey:['connectionRequests']})
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove connection.');
    }
  })
  const getConnectionStatus=useMemo(()=>{
    if(isConnected){
      return 'connected'
    }
    if(!isConnected)
      return 'notConnected'
    return connectionStatus?.status
  },[isConnected,connectionStatus])
  const renderConnectionButton=()=>{
    const baseClass="text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
    switch(getConnectionStatus){
      case 'connected':
        return (
        <div className='flex gap-2 justify-center'>
          <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
            <UserCheck size={20} className='mr-2'/> Connected
          </div>
          <button className={`${baseClass} bg-red-500 hover:bg-red-600`} 
          onClick={()=>removeConnection(userData._id)}>
            <X size={20} className='mr-2'/> Remove Connection
          </button>
        </div>
      )
      case 'requestSent':
        return(
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className='mr-2'/> Pending
          </button>
        )
        case 'requestReceived':
        return(
          <div className='flex gap-2 justify-center'>
            <button 
            onClick={()=>acceptConnectionRequest(connectionStatus.requestId)}
            className={`${baseClass} bg-green-500 hover:bg-green-600`}>Accept</button>
            <button 
            onClick={()=>declineConnectionRequest(connectionStatus.requestId)}
            className={`${baseClass} bg-red-500 hover:bg-red-600`}>Reject</button>
          </div>
        )
        default:
        return(
          <button 
          onClick={()=>sendConnectionRequest(userData._id)}
          className={`${baseClass} bg-primary hover:bg-primary-dark`}>
            <UserPlus size={20} className='mr-2'/> Connect
          </button>
        )
    }
  }
  const handleSave=()=>{
    onSave(editedData)
    setIsEditing(false)
  }
  const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};
  return (
    <div className='bg-white rounded-lg shadow mb-6'>
      <div className='relative h-48 bg-cover rounded-t-lg bg-center'
      style={{backgroundImage:`url(${editedData.bannerImage || userData.bannerImage || "/banner.png"})`}}>
    {isEditing && (
      <label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
						<Camera size={20} />
						<input
							type='file'
							className='hidden'
							name='bannerImage'
							onChange={handleImageChange}
							accept='image/*'
						/>
					</label>
    )}
      </div>
      <div className='p-4'>
        <div className="relative mb-4 -mt-20">
          <img
						className='w-32 h-32 rounded-full mx-auto object-cover'
						src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
						alt={userData.name}
					/>
          {isEditing && (
            <label className='absolute bottom-0 right-1/2 bg-white p-2 rounded-full shadow cursor-pointer translate-x-16'>
              <Camera size={20} />
              <input
                type='file'
                className='hidden'
                name='profilePicture'
                onChange={handleImageChange}
                accept='image/*'
              />
            </label>
          )}
        </div>
        <div className="text-center mb-4">
          {isEditing ? (
            <input
            type="text"
            value={editedData.name??userData.name}
            onChange={(e)=>setEditedData({...editedData,name:e.target.value})}
            className=" text-2xl text-center mb-2  w-full"
            />
          ):(
            <h1 className='text-2xl mb-2 font-bold'>{userData.name}</h1>
          )}
          {isEditing ?(<input
          type="text"
          value={editedData.headline??userData.headline}
          onChange={(e)=>setEditedData({...editedData,headline:e.target.value})}
          className="text-center text-gray-600 w-full"
          />):(
            <p className='text-gray-600'>{userData.headline}</p>
          )}
          <div className="flex justify-center items-center mb-2">
            <MapPin size={16} className='mr-1 text-gray-500'/>
            {isEditing?(
              <input
              type="text"
              value={editedData.location??userData.location}
              onChange={(e)=>setEditedData({...editedData,location:e.target.value})}
              className="text-center text-gray-600"
              />
            ):(
              <span className='text-gray-600'>{userData.location}</span>
            )}
          </div>
        </div>
        {isOwnProfile ? (
					isEditing ? (
						<button
							className='w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
							onClick={handleSave}
						>
							Save Profile
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
						>
							Edit Profile
						</button>
					)
				) : (
					<div className='flex justify-center'>{renderConnectionButton()}</div>
				)}
      </div>
    </div>
  )
}

export default ProfileHeader
