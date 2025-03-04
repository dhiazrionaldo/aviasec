import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../useUser';

const initParkingStand = {
    parking_stand: "",
    created_at: "",
    created_by: "",
    modified_at: "",
    modified_by: "",
    id: "",
};

export default function parkingStandMaster() {
    return useQuery({
        queryKey: ["parking_stand_master"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: parking_stand } = await supabase
                    .from("master_parking_stand")
                    .select("*");
                return parking_stand;
            }
            return [];
        }
    });
}

export async function editParkingStand(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: parking_stand, error } = await supabase
            .from("master_parking_stand")
            .update({
                parking_stand: datas.parking_stand, // Use the vendor_id from the profiles data
                modified_at: today, // Use the today date for modified date
                modified_by: userDet.display_name // Use the display name for modified by
            })
            .eq('id', datas.id)
            .select();

        return parking_stand;
    }
    return initParkingStand;
}

export async function createParkingStand(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
     const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: parking_stand, error } = await supabase
            .from("master_parking_stand")
            .insert({
                parking_stand: datas.parking_stand, // Use the vendor_id from the profiles data
                created_by: userDet.display_name
            })
            .select();

        return parking_stand;
    }
    return initParkingStand;
}
export async function deleteParkingStand(id) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { error } = await supabase
            .from("master_parking_stand")
            .delete()
            .eq('id', id);

    }
    return initParkingStand;
}