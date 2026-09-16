import Footer from '@/components/layouts/footer/Footer'
import { Navbar } from '@/components/layouts/navbar/Navbar'
import React from 'react'

const UserLayout = ({children}) => {
  return (
    <div>
        <Navbar/>
        {children}
        <Footer/>
    </div>
  )
}

export default UserLayout