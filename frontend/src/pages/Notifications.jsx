import React from 'react'
import { useQuery,useQueryClient,useMutation } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus,ThumbsDown } from "lucide-react";
import toast from 'react-hot-toast' 
import { Link } from 'react-router-dom';
// import { UserPlus,MessageSquare,ThumbsUp } from 'lucide-react'
import Sidebar from "../components/sidebar.jsx";
import { formatDistanceToNow } from "date-fns";

const Notifications = ({authUser}) => {
    const queryClient = useQueryClient();
    // const {data:user}=useQuery({
    //     queryKey:['authUser']
    // })
    const {data:notifications,isLoading}=useQuery({
        queryKey:['notifications'],
        queryFn: async () => {
          try {
            const response = await axiosInstance.get('/notifications');
            return response.data;
          }
          catch (error) {
            console.error('Error fetching notifications:', error);
          }
        }
    })
    console.log(notifications?.length)
    var notf;
    const {mutate:markNotificationAsRead}=useMutation({
        mutationFn: async (notificationId) => {
            await axiosInstance.put(`/notifications/${notificationId}/read`)
            notf=notificationId
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['notifications',notf]});
        },
    })
    const {mutate:deleteNotification}=useMutation({
        mutationFn: async (notificationId) => {
            axiosInstance.delete(`/notifications/${notificationId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['notifications']});
            toast.success('Notification deleted successfully!');
        },
    })
    const renderNotificationIcon=(type)=>{
        switch(type){
            case 'dislike':
                return <ThumbsDown className="text-red-500"/>
            case 'like':
                return <ThumbsUp className="text-blue-500"/>
            case 'comment':
                return <MessageSquare className="text-green-500"/>
            case 'connectionAccepted':
                return <UserPlus className="text-purple-500"/>
            default:
                return null
        }
    }
    const renderNotificationContent=(notification)=>{
        switch(notification.type){
            case 'dislike':
                return (
                <span>
                    <strong>{notification.sender.name}</strong> disliked your post
                </span>
                )
            case 'like':
                return (
                <span>
                    <strong>{notification.sender.name}</strong> liked your post
                </span>
                )
            case 'comment':
                return <span>
                    <Link className="font-bold" to={`profile/${notification.sender.username}`}>
                    {notification.sender.name}</Link>
                    {" "}commented on your post 
                </span>
            case 'connectionAccepted':
                return (
                    <span>
                        <Link className="font-bold" to={`profile/${notification.sender.username}`}>
                        {notification.sender.name}</Link>
                        {" "}accepted your connection request
                    </span>
                )
            default:
                return null
        }
    }
   const renderRelatedPost = (relatedPost) => {
		if (!relatedPost) return null;

		return (
			<Link
				to={`/post/${relatedPost._id}`}
				className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors'
			>
				{relatedPost.image && (
					<img src={relatedPost.image} alt='Post preview' className='w-10 h-10 object-cover rounded' />
				)}
				<div className='flex-1 overflow-hidden'>
					<p className='text-sm text-gray-600 truncate'>{relatedPost.content}</p>
				</div>
				<ExternalLink size={14} className='text-gray-400' />
			</Link>
		);
	};
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser}></Sidebar>
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white p-6 rounded-lg shadow">
         <h1 className="text-2xl font-bold mb-6">Notifications</h1>   
         {isLoading ? (<p>Loading Notifications...</p>):(
            notifications && notifications?.length>0?(
                <ul>
                    {notifications.map((notification) => (
                        <li
									key={notification._id}
									className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
										!notification.read ? "border-blue-500" : "border-gray-200"
									}`}
								>
									<div className='flex items-start justify-between'>
										<div className='flex items-center space-x-4'>
											<Link to={`/profile/${notification.sender.username}`}>
												<img
													src={notification.sender.profilePicture || "/avatar.png"}
													alt={notification.sender.name}
													className='w-12 h-12 rounded-full object-cover'
												/>
											</Link>

											<div>
												<div className='flex items-center gap-2'>
													<div className='p-1 bg-gray-100 rounded-full'>
														{renderNotificationIcon(notification.type)}
													</div>
													<p className='text-sm'>{renderNotificationContent(notification)}</p>
												</div>
												<p className='text-xs text-gray-500 mt-1'>
													{formatDistanceToNow(new Date(notification.createdAt), {
														addSuffix: true,
													})}
												</p>
												{renderRelatedPost(notification.post)}
											</div>
										</div>

										<div className='flex gap-2'>
											{!notification.read && (
												<button
													onClick={() => markNotificationAsRead(notification._id)}
													className='p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors'
													aria-label='Mark as read'
												>
													<Eye size={16} />
												</button>
											)}

											<button
												onClick={() => deleteNotification(notification._id)}
												className='p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors'
												aria-label='Delete notification'
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								</li>
                    ))}
                </ul>
            ):(<p>No notifications at the moment</p>)
         )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
