import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../useUser';

const initCompanyMaster = {
    station_name: "",
    station_code: "",
    created_at: "",
    created_by: "",
    modified_at: "",
    modified_by: "",
    id: "",
};

export default function stationMaster() {
    return useQuery({
        queryKey: ["station_master"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: station } = await supabase
                    .from("master_station")
                    .select("*");
                return station;
            }
            return [];
        }
    });
}

export async function editStation(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: station, error } = await supabase
            .from("master_station")
            .update({
                station_code: datas.station_code, // Use the vendor_id from the profiles data
                station_name: datas.station_name, // Use the vendor_id from the profiles data
                modified_at: today, // Use the today date for modified date
                modified_by: userDet.display_name // Use the display name for modified by
            })
            .eq('id', datas.id)
            .select();

        return station;
    }
    return initCompanyMaster;
}

export async function createStation(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
     const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: company, error } = await supabase
            .from("master_station")
            .insert({
                station_name: datas.station_name, // Use the vendor_id from the profiles data
                station_code: datas.station_code, // Use the vendor_id from the profiles data
                created_by: userDet.display_name
            })
            .select();

        return company;
    }
    return initCompanyMaster;
}
export async function deleteStation(id) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { error } = await supabase
            .from("master_station")
            .delete()
            .eq('id', id);

    }
    return initCompanyMaster;
}