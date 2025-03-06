import createClient from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient'
import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query'
import React from 'react'

const initUser = {
    company_id: null,
    created_at: "",
    display_name: "",
    email: "",
    id: "",
    modified_at: "",
    role_id: "",
    image_url: "",
    master_role: {
      id: "",
      role_name: ""
    },
    master_company: {
      company_name: ""
    }
}

const initCompany = {
  id: "",
  created_at: "",
  created_by: "",
  modified_at: "",
  modified_by: "",
  company_name: ""
}

export async function getUserDetail(user_id){
  const supabase = createClient();
  const { data: user } = await supabase
  .from("profiles")
  .select(`
      *,
      master_company(id, company_name),
      master_role(id, role_name),
      master_station(id, station_name, station_code)
  `)
  .eq("id", user_id)
  .single();
  return user;
}

export default function useUser() {
  return useQuery({
    queryKey:["user"],
    queryFn: async () =>{
        const supabase = createClient();

        const  users  = await supabase.auth.getSession();
        
        if(users.data.session?.user){
            //fetch user info from profile table
            const { data: user } = await supabase
                    .from("profiles")
                    .select(`
                        *,
                        master_company(company_name),
                        master_role(id,role_name),
                        master_station(id, station_name, station_code)
                      `)
                    .eq("id", users.data.session.user.id)
                    .single();
            return user
        }
        return initUser;
    }
  })
}

export function registrationGetCompany(){
  return useQuery({
    queryKey:["registration_master_company"],
    queryFn: async () => {
      const supabase = createClient();

      // const  users  = await supabase.auth.getSession();
      
      // if(users.data.session?.user){
          //fetch user info from profile table
          const { data: company, error } = await supabase
                  .from("master_company")
                  .select(`*`);

          if(error){
            console.error(error)
            return error
          }
          return company
      // }
      // return initCompany;

    }
  })
}

export async function updateProfileData(datas) {
  const supabase = createClient();

  // Step 1: Get the profile ID where email matches
  const { data: profile, error: selectError } = await supabase
      .from("profiles")
      .select("id") // Select only the ID
      .eq("email", datas.email)
      .single(); // Ensure only one row is returned

  if (selectError) {
      console.error("Error fetching profile ID:", selectError);
      return new Error("Unable to fetch profile ID");
  }

  if (!profile) {
      return new Error("Profile not found");
  }

  // Step 2: Update the profile using the retrieved ID
  const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({
          company_id: datas.company_id,
          display_name: datas.display_name
      })
      .eq("id", profile.id)
      .select(); // Update by ID
      

  if (updateError) {
      console.error("Error updating profile:", updateError);
      return new Error("Unable to update profile");
  }

  return updatedProfile;
}
