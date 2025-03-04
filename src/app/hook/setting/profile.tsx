import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { getUserDetail } from '../useUser';

const initUser = {
    id: "",
    created_at: "",
    modified_at: "",
    created_by: "",
    modified_by: "",
    email: "",
    display_name: "",
    role_id: "",
    company_id: "",
    image_url: "",
    station_id: "",
    master_company: {
        id: "",
        company_name: ""
    },
    master_role: {
        id: "",
        role_name: ""
    },
    master_station: {
        id: "",
        station_name: "",
        station_code: ""
    }
}

const initStation = {
    id: "",
    created_at: "",
    created_by: "",
    modified_at: "",
    modified_by: "",
    station_name: "",
    station_code: ""
}

const initRole = {
    id: "",
    created_at: "",
    role_name: "",
    created_by: "",
    modified_at: "",
    modified_by: ""
}
const initCompany = {
    created_at: "",
    created_by: "",
    modified_at: "",
    modified_by: "",
    id: "",
    company_name: "",
}

interface user{
    company_id: number;
    created_at: string;
    display_name: string | null;
    email: string | null;
    id: string;
    image_url: string | null;
    modified_at: string | null;
    role_id: number | null;
}


export default function useProfiles() {
    return useQuery({
        queryKey:["profile"],
        queryFn: async () =>{
            const supabase = createClient();
    
            const { data } = await supabase.auth.getSession();
            
            if(data.session?.user){
                //fetch user info from profile table
                const { data: user } = await supabase
                        .from("profiles")
                        .select("*")
                return user
            }
            return [];
        }
      })
}

export function getRoles(){
    return useQuery({
        queryKey:["role"],
        queryFn: async () =>{
            const supabase = createClient();               
                        
            const { data } = await supabase.auth.getSession();
    
            if(data.session?.user){
                //fetch user info from profile table
                const { data: roles, error } = await supabase
                        .from("master_role")
                        .select("*")
                
                        if(error){
                            console.log(error)
                            return initRole;
                        }
                return Array.isArray(roles) ? roles : [roles];
            }
            return initRole;
        }
      })
}

export function getCompany(){
    return useQuery({
        queryKey:["companies"],
        queryFn: async () =>{
            const supabase = createClient();
    
            const { data } = await supabase.auth.getSession();
    
            if(data.session?.user){
                //fetch user info from profile table
                const { data: company } = await supabase
                        .from("master_company")
                        .select("*")
    
                return Array.isArray(company) ? company : [company]; 
            }
            return initCompany;
        }
      })
}

export function getStation(){
    return useQuery({
        queryKey:["station"],
        queryFn: async () =>{
            const supabase = createClient();
    
            const { data } = await supabase.auth.getSession();
    
            if(data.session?.user){
                //fetch user info from profile table
                const { data: station } = await supabase
                        .from("master_station")
                        .select("*")
                
                return Array.isArray(station) ? station : [station]; 
            }
            return initStation;
        }
      })
}

export async function editProfiles(profiles) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();

    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: user, error } = await supabase
            .from("profiles")
            .update({
                role_id: profiles.role_id, // Use the vendor_id from the profiles data
                company_id: profiles.company_id, // Use the company_id from the profiles data
                station_id: profiles.station_id, // Use the station_id from the profiles data
                employee_id: profiles.employee_id, // Use the station_id from the profiles data
                modified_at: today, // Use the today date for modified date
                modified_by: userDet.display_name // Use the display name for modified by
                // Add other fields as necessary
            })
            .eq('id', profiles.id)
            .select();

        return user;
    }
    return initUser;
}