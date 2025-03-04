import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../useUser';

const initTerminalMaster = {
    terminal: "",
    created_at: "",
    created_by: "",
    modified_at: "",
    modified_by: "",
    id: "",
};

export default function terminalMaster() {
    return useQuery({
        queryKey: ["terminal_master"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: terminal } = await supabase
                    .from("master_terminal")
                    .select("*");
                return terminal;
            }
            return [];
        }
    });
}

export async function editTerminal(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: terminal, error } = await supabase
            .from("master_terminal")
            .update({
                terminal: datas.terminal, // Use the vendor_id from the profiles data
                modified_at: today, // Use the today date for modified date
                modified_by: userDet.display_name // Use the display name for modified by
            })
            .eq('id', datas.id)
            .select();

        return terminal;
    }
    return initTerminalMaster;
}

export async function createTerminal(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
     const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: terminal, error } = await supabase
            .from("master_terminal")
            .insert({
                terminal: datas.terminal, // Use the vendor_id from the profiles data
                created_by: userDet.display_name
            })
            .select();

        return terminal;
    }
    return initTerminalMaster;
}
export async function deleteTerminal(id) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { error } = await supabase
            .from("master_terminal")
            .delete()
            .eq('id', id);

    }
    return initTerminalMaster;
}