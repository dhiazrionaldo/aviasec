import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../useUser';

const initAirlineMaster = {
    airline_name: "",
    airline_code_iata: "",
    airline_code_icao: "",
    created_at: "",
    created_by: "",
    modified_at: "",
    modified_by: "",
    id: "",
};

export default function airlineMaster() {
    return useQuery({
        queryKey: ["airline_master"],
        queryFn: async () => {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: airline } = await supabase
                    .from("master_airline")
                    .select(`
                        *,
                        master_terminal(id, terminal)
                    `);
                if(error){
                    console.error("Error updating daily schedule:", error);
                    throw new Error(error.message);
                }else {
                    return airline;
                }
                
                
            }

            
            return [];
        }
    });
}

export async function editAirline(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: airline, error } = await supabase
            .from("master_airline")
            .update({
                airline_name: datas.airline_name, // Use the vendor_id from the profiles data
                airline_code_iata: datas.airline_code_iata, // Use the vendor_id from the profiles data
                airline_code_icao: datas.airline_code_icao, // Use the vendor_id from the profiles data
                terminal_id: datas.terminal_id,
                modified_at: today, // Use the today date for modified date
                modified_by: userDet.display_name // Use the display name for modified by
            })
            .eq('id', datas.id)
            .select();

        if(error){
            console.error(error.message)
            throw new Error(error.message);
        }

        return airline;
    }
    return initAirlineMaster;
}

export async function createAirlineMaster(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
     const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: airline, error } = await supabase
            .from("master_airline")
            .insert({
                airline_name: datas.airline_name, // Use the vendor_id from the profiles data
                airline_code_iata: datas.airline_code_iata, // Use the vendor_id from the profiles data
                airline_code_icao: datas.airline_code_icao, // Use the vendor_id from the profiles data
                terminal_id: datas.terminal_id,
                created_by: datas.created_by
            })
            .select();

        if(error){
            console.error(error.message)
            throw new Error(error.message);
        }

        return airline;
    }
    return initAirlineMaster;
}
export async function deleteAirlineMaster(id) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { error } = await supabase
            .from("master_airline")
            .delete()
            .eq('id', id);
        
            if(error){
            console.error(error.message)
            throw new Error(error.message);
        }
    }
    return initAirlineMaster;
}