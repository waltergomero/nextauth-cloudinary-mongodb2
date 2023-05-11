'use client';

import { FaUser } from 'react-icons/fa'
import {useState} from 'react'
import Link from 'next/link'
import styles from '@styles/AuthForm.module.css'
import { alertService } from '@services/alert.service'
import { accountService } from '@services/account.service';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    return accountService
      .login(email, password)
      .then((res) => {
        if (res.ok) {
          const returnUrl = router.query.returnUrl || "/pages/admin";
          router.push(returnUrl);
        } else {
          alertService.error(res.error);
        }
      })
      .catch(alertService.error);
  };

  return (
    <>
     < div className='mt-10'>
      <div className={styles.auth}>
          <h1 className="flex items-start gap-16 text-gray-900 text-lg leading-tight font-medium text-center mb-4">
          <FaUser />  Log into your account
          </h1>    
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email' className="block text-dark text-sm" >Email Address</label>
            <input
              type='email'
              className="w-full px-4 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              id='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='password'  className="block text-dark text-sm" >Password</label>
            <input
              type='password'
              id='password'
              required
              minLength="6"
              maxLength="32"
              className="w-full px-4 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <input type='submit' value='Login' className="px-6 py-1 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"/>
        </form>

        <p className="block text-dark text-sm">
          Don't have an account? <Link href='/account/register' className="text-sm text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
      </div>
    </>  
  )
}


