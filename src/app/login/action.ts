'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import toast from 'react-hot-toast'

// export async function login(formData: FormData) {

//   try {
//     const supabase = await createClient()

//     // type-casting here for convenience
//     // in practice, you should validate your inputs
//     const data = {
//       email: formData.email,
//       password: formData.password
//     }
  
//     const { error } = await supabase.auth.signInWithPassword(data)
  
//     if (error) {
//       throw Error(error.message)
//     } else {
//       revalidatePath('/', 'layout')
//       redirect('/')
//     }
//   } catch (error) {
//     throw Error('Unable to login')
//   }
 
// }
export async function login(formData: FormData) {
  try {
    const supabase = await createClient();

    const data = {
      email: formData.email,
      password: formData.password
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      return { error: error.message, code: 400 }; // Return the error message instead of throwing
    } else {
      revalidatePath("/", "layout");
      redirect("/");
    }
  } catch (error) {
    return { error: "Unable to login" }; // Ensure we return a structured error
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password
  }

  const { error } = await supabase.auth.signUp(data)
  console.log(error)
  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/signup')
}