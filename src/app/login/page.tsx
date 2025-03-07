'use client'
import { login, signup } from './action'
import Link from 'next/link'
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Loader2, LogIn, UserPlus2, UserPlus2Icon } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';
import  createClient  from '@/utils/supabase/client';

//zod config
const formSchema = z.object({
    email: z.string().min(1, { message: "This field has to be filled." })
      .email("This is not a valid email.")
      .refine((email) => !email.endsWith("@gmail.com") || !email.endsWith("outlook.com") || !email.endsWith("yahoo.com"), {
        message: "Only company email address are allowed.",
      }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters. and use Upercase and Lowercase also symbols and number",
    }),
  })
//end zod config

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [loading,setLoading] = useState(false);

  // 1. Define your form.
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      }
    });
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
      setLoading(true);
      try {
        const response = await login(values);
        
        if (response?.error) {
          toast.error(response.error); // Show the Supabase error in toast
        }
      } finally {
        setLoading(false);
      }
    }
    

    function handleLoginWithOAuth(provider: "google") {
      setLoading(true);
      const supabase = createClient();
  
      supabase.auth.signInWithOAuth({
          provider,
          options: {
              redirectTo: location.origin + "auth/callback"
          }
      }).then(() => {
          // Handle successful login if needed
      }).catch((error) => {
          console.log(error);
          toast.error(`Error: ${error}`)
      }).finally(() => {
          setLoading(false);
      });
    }

  return (

    <div className='flex items-center justify-center w-full h-screen'>
    <div className='w-96 rounded-md border p-5 relative bg-slate-900'>
      <div className='flex justify-center gap-2'>
          <h1 className='text-2xl font-bold'>Welcome to <b className="uppercase">AviaSec</b></h1>
      </div>

      

      <div className='flex flex-col  space-y-3'>
          <p className='flex justify-center text-sm'>Flight Schedule Management System</p>
          
          <div className='flex flex-col gap-2'>
              {loading ? (
                  <Button disabled className='w-full flex items-center gap-2 text-white' variant={'outline'}><Loader2 className='animate-spin'/> Google Account Login</Button>
              ): (
                  <>
                  <Button onClick={()=>handleLoginWithOAuth("google")} className='w-full flex items-center gap-2 bg-indigo-700 text-white hover:bg-indigo-900'><FcGoogle /> Google Account Login</Button>
                  </>
              )}
              
              <p className='font-bold text-center uppercase'>or</p>
              <p className='text-sm text-center'>Use your company mail account</p>
          </div>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@email.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your valid Email Address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loading ? (
                <Button disabled className='flex w-full'><Loader2 className='animate-spin'/>Submit</Button>
              ):(
                <Button className='flex w-full'><LogIn size={15} /> Login</Button>
              )}
              
            </form>
          </Form>
          <div className='flex justify-center'>
            <p>don't have an account?</p>
          </div>
          <Link href="/signup">
            <Button className='flex w-full bg-blue-800 text-white hover:bg-blue-900'><UserPlus2Icon size={15}  /> Sign Up</Button>
          </Link>
      </div>

      
      <div className='glowBox -z-10'>

      </div>
      
    </div>
  </div>
  )
}