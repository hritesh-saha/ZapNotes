import React from 'react'
import { SignIn } from '@clerk/clerk-react'
const Login = () => {
  return (
    <div className='flex items-center justify-center'>
        <div>
        <SignIn/>
        </div>
    </div>
  )
}

export default Login