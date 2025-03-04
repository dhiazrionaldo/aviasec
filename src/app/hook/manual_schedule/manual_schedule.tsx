import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../useUser';

export default function getDepartureManualSchedule() {
    return useQuery({
        queryKey: ["departure_manual_schedule"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: gate } = await supabase
                    .from("departure_manual_schedule")
                    .select(`*`);
                return gate;
            }
            return [];
        }
    });
}

export async function submitScheduleDeparture(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();

    if (!data.session?.user) return null;
    
    if (!user_id) throw new Error("User not authenticated.");
    console.log(datas)
    try {
        for (const entry of datas) {
            if(!entry.aircraft_model) throw new Error("The Aircraft Model can not be empty");
            if(!entry.schedule_type) throw new Error("The Schedule Type can not be empty");
            if(!entry.airline_code_iata) throw new Error("The Airline Code can not be empty");
            if(!entry.flight_number) throw new Error("The Flight Number can not be empty");
            if(!entry.d_des_iata1) throw new Error("The Destination can not be empty");
            if(!entry.d_ori_iata) throw new Error("The Origin Station can not be empty");
            if(!entry.start_effective_date) throw new Error("The Start Date can not be empty");
            if(!entry.end_effective_date) throw new Error("The End Date can not be empty");
            if(!entry.aircraft_types) throw new Error("The Aircraft Type can not be empty");
            
            if (entry.id) {
                // **UPDATE** existing record
                const { data: existingData, error: fetchError } = await supabase
                    .from("departure_manual_schedule")
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
                        .from("departure_manual_schedule")
                        .update({
                            aircraft_model: entry.aircraft_model,
                            schedule_type: entry.schedule_type,
                            aircraft_types: entry.aircraft_types,
                            airline_code_iata: entry.airline_code_iata,
                            airline_code_icao: entry.airline_code_icao,
                            airline_name: entry.airline_name,
                            d_des_iata1: entry.d_des_iata1,
                            d_des_iata2: entry.d_des_iata2,
                            d_des_iata3: entry.d_des_iata3,
                            d_des_iata4: entry.d_des_iata4,
                            d_ori_iata: entry.d_ori_iata,
                            flight_number: entry.flight_number,
                            monday: entry.monday,
                            tuesday: entry.tuesday,
                            wednesday: entry.wednesday,
                            thursday: entry.thursday,
                            friday: entry.friday,
                            saturday: entry.saturday,
                            sunday: entry.sunday,
                            remark: entry.remark,
                            start_effective_date: entry.start_effective_date,
                            end_effective_date: entry.end_effective_date,
                            flight_time: entry.flight_time,
                            modified_by: userDet.display_name,
                            modified_at: today,
                        })
                        .eq("id", entry.id);
    
                    if (updateError) {
                        console.error("Error updating record:", updateError);
                        throw new Error(updateError.message);
                    }
                }
            } else {
                // **INSERT** new record
                const { error: insertError } = await supabase
                    .from("departure_manual_schedule")
                    .insert({
                        aircraft_model: entry.aircraft_model,
                        schedule_type: entry.schedule_type,
                        aircraft_types: entry.aircraft_types,
                        airline_code_iata: entry.airline_code_iata,
                        airline_code_icao: entry.airline_code_icao,
                        airline_name: entry.airline_name,
                        d_des_iata1: entry.d_des_iata1,
                        d_des_iata2: entry.d_des_iata2,
                        d_des_iata3: entry.d_des_iata3,
                        d_des_iata4: entry.d_des_iata4,
                        d_ori_iata: entry.d_ori_iata,
                        flight_number: entry.flight_number,
                        monday: entry.monday,
                        tuesday: entry.tuesday,
                        wednesday: entry.wednesday,
                        thursday: entry.thursday,
                        friday: entry.friday,
                        saturday: entry.saturday,
                        sunday: entry.sunday,
                        remark: entry.remark,
                        start_effective_date: entry.start_effective_date,
                        end_effective_date: entry.end_effective_date,
                        flight_time: entry.flight_time,
                        created_by: userDet.display_name,
                        created_at: today,
                    });
    
                if (insertError) {
                    console.error("Error inserting record:", insertError);
                    throw new Error(insertError.message);
                }
            }
        }
    } catch (error) {
        throw error;
    }
}