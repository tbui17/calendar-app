"use client"

import {SessionProvider} from "next-auth/react"

const Provider = ({children}:{children:any}) => {
    return(
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default Provider