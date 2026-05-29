import React from 'react'
import { useNavigate } from 'react-router-dom';
import {axiosInstance} from '../../lib/axios.js'
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query'
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";
const Navbar = ({authUser}) => {
  const queryClient = useQueryClient();
  const navigate=useNavigate();
  const {data:notifications}=useQuery({
    queryKey:['notifications'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/notifications');
        return response.data;
      }
      catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },
    enabled: !!authUser, // Only fetch notifications if the user is authenticated
  });
    const {data:connectionRequests}=useQuery({
      queryKey:['connectionRequests'],
      queryFn: async () => {
        try {
          const response = await axiosInstance.get('/connections/requests');
          return response.data;
        }
      catch (error) {
        console.error('Error fetching connection requests:', error);
      }
    },
    enabled: !!authUser, // Only fetch connection requests if the user is authenticated
  });
  const {mutate:logout}=useMutation({
    mutationFn: async () => {
	//   navigate('/login');
      await axiosInstance.get('/auth/logout');

    },
    onSuccess: () => {
		
		 queryClient.invalidateQueries({queryKey: ['authUser',authUser]});
		 window.location.href = '/login';

      // queryClient.invalidateQueries(['notifications']);
      // queryClient.invalidateQueries(['connectionRequests']);
    }
  });
  const unReadNotificationsCount = notifications ? notifications.filter(n => !n.read).length : 0;
  const unReadConnectionRequestsCount = connectionRequests ? connectionRequests.length : 0;
  console.log("Notifications:", notifications);
  console.log("Connection Requests:", connectionRequests);
  return (
    
      	<nav className='bg-secondary shadow-md sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<div className='flex items-center space-x-4'>
						<Link to='/'>
							<img className='h-8 rounded' src='/small-logo.png' alt='LinkedIn' />
						</Link>
					</div>
					<div className='flex items-center gap-2 md:gap-6'>
						{authUser ? (
							<>
								<Link to={"/"} className='text-neutral flex flex-col items-center'>
									<Home size={20} />
									<span className='text-xs hidden md:block'>Home</span>
								</Link>
								<Link to='/network' className='text-neutral flex flex-col items-center relative'>
									<Users size={20} />
									<span className='text-xs hidden md:block'>My Network</span>
									{unReadConnectionRequestsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unReadConnectionRequestsCount}
										</span>
									)}
								</Link>
								<Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
									<Bell size={20} />
									<span className='text-xs hidden md:block'>Notifications</span>
									{unReadNotificationsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unReadNotificationsCount}
										</span>
									)}
								</Link>
								<Link
									to={`/profile/${authUser.user.username}`}
									className='text-neutral flex flex-col items-center'
								>
									<User size={20} />
									<span className='text-xs hidden md:block'>Me</span>
								</Link>
								<button
									className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
									onClick={() => logout()}
								>
									<LogOut size={20} />
									<span className='hidden md:inline'>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to='/login' className='btn btn-ghost'>
									Sign In
								</Link>
								<Link to='/register' className='btn btn-primary'>
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>

  )
}

export default Navbar
