import React from 'react'
import Navbar from './navbar'

const Layout = ({children, authUser}) => {
  return (
    <div className='min-h-screen bg-base-100'>
      <Navbar authUser={authUser}></Navbar>
      <main className='max-w-7xl mx-auto px-4 py-6'>
        {children}
      </main>
    </div>
  )
}

export default Layout
