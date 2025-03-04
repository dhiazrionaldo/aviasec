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

export function getTerminal() {
    return useQuery({
        queryKey: ["terminal_master_pairing"],
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

export function getGate() {
    return useQuery({
        queryKey: ["gate_master_pairing"],
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

export function getParkingStand() {
    return useQuery({
        queryKey: ["parking_stand_master_pairing"],
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

export default function terminalPairingMaster() {
    return useQuery({
        queryKey: ["terminal_pairing_master"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: gate } = await supabase
                    .from("master_pairing_gate")
                    .select("*");
                return gate;
            }
            return [];
        }
    });
}

export async function editTerminalPairing(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { data: pairing_gate, error } = await supabase
            .from("master_pairing_gate")
            .update({
                gate_id: datas.gate_id, // Use the vendor_id from the profiles data
                parking_id: datas.parking_id, // Use the vendor_id from the profiles data
                terminal_id: datas.terminal_id, // Use the vendor_id from the profiles data
                station_id: datas.station_id, // Use the vendor_id from the profiles data
                remark: datas.remark, // Use the vendor_id from the profiles data
                modified_at: today, // Use the today date for modified date
                modified_by: userDet.display_name // Use the display name for modified by
            })
            .eq('id', datas.id)
            .select();

        return pairing_gate;
    }
    return initGateMaster;
}

export async function submitTerminalPairing(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();

    if (!data.session?.user) return null;

    for (const entry of datas) {
        if (entry.id) {
            // **UPDATE** existing record
            const { data: existingData, error: fetchError } = await supabase
                .from("master_pairing_gate")
                .select("id")
                .eq("id", entry.id)
                .single();

            if (fetchError) {
                console.error("Error fetching existing data:", fetchError);
                continue; // Skip to the next entry if error occurs
            }

            if (existingData) {
                // Perform update
                const { error: updateError } = await supabase
                    .from("master_pairing_gate")
                    .update({
                        gate_id: entry.gate_id,
                        parking_id: entry.parking_id,
                        terminal_id: entry.terminal_id,
                        station_id: entry.station_id,
                        remark: entry.remark,
                        modified_by: userDet.display_name,
                        modified_at: today,
                    })
                    .eq("id", entry.id);

                if (updateError) {
                    console.error("Error updating record:", updateError);
                }
            }
        } else {
            // **INSERT** new record
            const { error: insertError } = await supabase
                .from("master_pairing_gate")
                .insert({
                    gate_id: entry.gate_id,
                    parking_id: entry.parking_id,
                    terminal_id: entry.terminal_id,
                    station_id: entry.station_id,
                    remark: entry.remark,
                    created_by: userDet.display_name,
                    created_at: today,
                });

            if (insertError) {
                console.error("Error inserting record:", insertError);
            }
        }
    }

    return true; // Indicate success
}

export async function deleteTerminalPairing(id) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        const { error } = await supabase
            .from("master_pairing_gate")
            .delete()
            .eq('id', id);

    }
    return initGateMaster;
}