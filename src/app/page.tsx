"use client"

import { signIn, signOut, useSession } from 'next-auth/react';

import { Auth } from 'googleapis';
import { AuthForm } from '@/components/auth';
import {CalendarApp} from '../components/calendar';

// Import the functions you need from the SDKs you need




export default function Home() {
  const {data, status} = useSession()

  if (data) {
    return( <div>
      <div>
        <p>Welcome {data.user?.name}</p>
    </div>
    <CalendarApp/>
    </div>
    )
  }
  else {
    return (
      <div>
        <p>Not signed in.</p>
        <button title="Sign in" onClick={() => signIn()} className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Sign in</button>
      </div>
    )
  }

    
}
