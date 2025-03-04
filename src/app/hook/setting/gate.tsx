import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../useUser';

const initGateMaster = {
    gate: "",
    created_at: "",
    created_by: "",
    modified_at: "",
    modified_by: "",
    id: "",
};

export default function gateMaster() {
    return useQuery({
        queryKey: ["gate_master"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: gate } = await supabase
                    .from("master_gate")
                    .select("*");
                return gate;
            }
            return [];
        }
    });
}

export async function editGate(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: gate, error } = await supabase
            .from("master_gate")
            .update({
                gate: datas.gate, // Use the vendor_id from the profiles data
                modified_at: today, // Use the today date for modified date
                modified_by: userDet.display_name // Use the display name for modified by
            })
            .eq('id', datas.id)
            .select();

        return gate;
    }
    return initGateMaster;
}

export async function createGate(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
     const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: gate, error } = await supabase
            .from("master_gate")
            .insert({
                gate: datas.gate, // Use the vendor_id from the profiles data
                created_by: userDet.display_name
            })
            .select();

        return gate;
    }
    return initGateMaster;
}
export async function deleteGate(id) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { error } = await supabase
            .from("master_gate")
            .delete()
            .eq('id', id);

    }
    return initGateMaster;
}