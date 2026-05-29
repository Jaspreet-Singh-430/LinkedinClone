import React,{use, useState} from 'react'
import { useMutation,useQueryClient } from '@tanstack/react-query'
import {axiosInstance} from '../../../lib/axios.js'
import toast from 'react-hot-toast'
import {Loader} from "lucide-react"
const SignUpForm = () => {
    const [name,setName] = useState('')
    const queryClient = useQueryClient();
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [username,setUsername] = useState('')
    const handleSignUp = (e) => {
        e.preventDefault()
        console.log(name,email,password,username)
        signUpMutation({ name, email, password, username });
    }
    const {mutate:signUpMutation,isLoading}=useMutation({
      mutationFn: async (data) => {
        const response = await axiosInstance.post('/auth/register', data);
        return response.data;
      },
      onSuccess: (data) => {
        console.log('User registered successfully:', data);
        toast.success('User registered successfully!');
        queryClient.invalidateQueries({queryKey: ['authUser']});
      },

      onError: (error) => {
        console.error('Error registering user:', error);
        toast.error('Error registering user.');
      },
    })
    
  return (
    <form className='flex flex-col gap-4' onSubmit={handleSignUp}>
      <div>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          className='input input-bordered w-full'
          onChange={(e) => setName(e.target.value)}
            required 
        />
      </div>
     
      <div>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          className='input input-bordered w-full'
          onChange={(e) => setUsername(e.target.value)} 
          required
        />
      </div>
      <div>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          className='input input-bordered w-full'
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
      </div>
      <div>
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          className='input input-bordered w-full'
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
      </div>
      <button disabled={isLoading} className='btn btn-primary w-full text-white' type="submit">
        {isLoading ? <Loader className=" size-5 animate-spin" /> : 'Agree & Join'}
      </button>
    </form>
  )
}

export default SignUpForm
