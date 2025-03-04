import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../useUser';

const initCompanyMaster = {
    company_name: "",
    created_at: "",
    created_by: "",
    modified_at: "",
    modified_by: "",
    id: "",
};

export default function companyMaster() {
    return useQuery({
        queryKey: ["company_master"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: company } = await supabase
                    .from("master_company")
                    .select("*");
                return company;
            }
            return [];
        }
    });
}

export async function editCompany(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: company, error } = await supabase
            .from("master_company")
            .update({
                company_name: datas.company_name, // Use the vendor_id from the profiles data
                modified_at: today, // Use the today date for modified date
                modified_by: userDet.display_name // Use the display name for modified by
            })
            .eq('id', datas.id)
            .select();

        return company;
    }
    return initCompanyMaster;
}

export async function createCompany(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
     const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: company, error } = await supabase
            .from("master_company")
            .insert({
                company_name: datas.company_name, // Use the vendor_id from the profiles data
                created_by: datas.created_by
            })
            .select();

        return company;
    }
    return initCompanyMaster;
}
export async function deleteCompany(id) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { error } = await supabase
            .from("master_company")
            .delete()
            .eq('id', id);

    }
    return initCompanyMaster;
}