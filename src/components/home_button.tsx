"use client"

import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import useUser from '@/app/hook/useUser'

export default function HomeButton() {
    const [loading, setLoading] = useState(false);
    const {data} = useUser();
    const [isAdmin, setAdmin] = useState(false);
    const [isAuth, setAuth] = useState(false);

    useEffect(() => {
        if(data){
          if (data?.master_role?.role_name === 'admin' || data?.master_role?.role_name === 'superadmin') {
              setAdmin(true);
              setAuth(true);
          } else {
              setAdmin(false);
              setAuth(false);
          }
        }
    }, [data]);
    console.log(data);
  return (
    <div>
      {loading ? (
        <Button disabled>Proceed to App <Loader2 className='animate-spin'/></Button>
      ) : isAuth && isAdmin ? (
            <Link href="/admin/home">
              <Button onClick={() => setLoading(true)}>Proceed to App <ArrowRight /></Button>
            </Link>
          ): isAuth && !isAdmin && (
            <p>Please ask your administrator to assign your account</p>
          )
      }
      
    </div>
  )
}
