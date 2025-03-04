import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../useUser';

const initRoleMaster = {
    role_name: "",
    created_at: "",
    created_by: "",
    modified_at: "",
    modified_by: "",
    id: "",
};

export default function roleMaster() {
    return useQuery({
        queryKey: ["role_master"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: role } = await supabase
                    .from("master_role")
                    .select("*");
                return role;
            }
            return [];
        }
    });
}

export async function editRole(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: role, error } = await supabase
            .from("master_role")
            .update({
                role_name: datas.role_name, // Use the vendor_id from the profiles data
                modified_at: today, // Use the today date for modified date
                modified_by: userDet.display_name // Use the display name for modified by
            })
            .eq('id', datas.id)
            .select();

        return role;
    }
    return initRoleMaster;
}

export async function createRole(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
     const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: role, error } = await supabase
            .from("master_role")
            .insert({
                role_name: datas.role_name, // Use the vendor_id from the profiles data
                created_by: userDet.display_name
            })
            .select();

        return role;
    }
    return initRoleMaster;
}
export async function deleteRole(id) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { error } = await supabase
            .from("master_role")
            .delete()
            .eq('id', id);

    }
    return initRoleMaster;
}