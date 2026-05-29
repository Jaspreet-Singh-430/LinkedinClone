
import './App.css'
import Layout from './components/Layout/layout.jsx'
import { Routes,Route,Navigate } from 'react-router-dom'
import Home from './pages/auth/Home.jsx'
import Signup from './pages/auth/Signup.jsx'
import Login from './pages/auth/Login.jsx'
import toast, { Toaster } from 'react-hot-toast'
import Network from './pages/Network.jsx'
import PostPage from './pages/PostPage.jsx'
import {axiosInstance} from './lib/axios.js'
import { useQuery } from '@tanstack/react-query'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'
function App() {
  const {data:authUser,isLoading}=useQuery({
    queryKey:['authUser'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
      }
      catch (error) {
        console.error('Error fetching authenticated user:', error);
        toast.error(err.response?.data?.message||'Failed to fetch authenticated user.');
        return null;
      }
    }
  });
  // console.log("Authenticated User:", authUser);
  if (isLoading) {
    return null;
  }
  return (
    <>
    <Layout authUser={authUser}>
      <Routes>
        <Route path='/' element={authUser?<Home authUser={authUser}/>:<Navigate to={'/login'}/>} />
        <Route path='/register' element={!authUser?<Signup/>:<Navigate to={'/'}/>} />
        <Route path='/login' element={!authUser?<Login/>:<Navigate to={'/'}/>} />
        <Route path='/notifications' element={authUser?<Notifications authUser={authUser}/>:<Navigate to={'/login'}/>} />
        <Route path='/network' element={authUser?<Network authUser={authUser}/>:<Navigate to={'/login'}/>} />
        <Route path='/post/:postId' element={authUser?<PostPage authUser={authUser}/>:<Navigate to={'/login'}/>} />
        <Route path='/profile/:username' element={authUser?<Profile authUser={authUser}/>:<Navigate to={'/login'}/>} />
      </Routes>
      <Toaster/>
    </Layout>
    </>
  )
}

export default App
