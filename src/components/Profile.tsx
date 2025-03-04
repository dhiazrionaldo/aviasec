"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import useUser from '@/app/hook/useUser'
import Image from 'next/image'
import createClient from '@/utils/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {Loader2} from 'lucide-react'

export default function Profile() {
  const {isFetching, data} = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  

  if(isFetching){
    return <></>
  }

  const handleLogout = async () => {
    setLoading(true)

    const supabase = createClient();
    queryClient.clear();

    await supabase.auth.signOut();

    setLoading(false);
    router.push('/login');
  }

  return (
    <div>
        {isLoading ? (
            <Loader2 className='animate-spin' />
        ) : (
            <>
            {!data?.id ? (
                <Link href="/login">
                    <Button variant="outline">Sign In</Button>
                </Link>
                ):(
                    <div className='flex flex-row gap-2'>
                        <Image 
                            src={data.image_url || ""}
                            alt={data.display_name || ""}
                            width={30}
                            height={30}
                            className='rounded-full cursor-pointer'
                            onClick={handleLogout}
                        />
                        <div>
                            <p className='text-xs'>{data.display_name}</p>
                            <p className='text-xs'>{data.email}</p>
                        </div>
                    </div>
                )
            }
            </>
        )}
    </div>
  )
}
