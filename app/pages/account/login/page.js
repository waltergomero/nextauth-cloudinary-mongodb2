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
        console.log("res", res)
        if (!res.error) {
          router.push("/pages/admin");
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
            <label htmlFor='email' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Email:</label>
            <input
              type='email'
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              id='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='password'  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Password:</label>
            <input
              type='password'
              id='password'
              required
              minLength="6"
              maxLength="32"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input type='submit' value='Login' className="px-6 py-1 mt-4 text-white uppercase bg-blue-600 border rounded hover:bg-blue-700"/>
        </form>

        <p className="block text-dark text-sm pt-3">
          Don't have an account? <Link href='/account/register' className="text-md text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
      </div>
    </>  
  )
}


