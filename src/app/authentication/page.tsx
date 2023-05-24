"use client"

import {redirect} from "next/navigation"
import { useSession } from 'next-auth/react'

export default function AuthenticationPage() {
    const {data: session} = useSession({required:true})


    return(
        <ul>
        <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
        <li>Aliquam tincidunt mauris eu risus.</li>
        <li>Vestibulum auctor dapibus neque.</li>
     </ul>
              
        
    )
      
  }
  