import createClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from '../useUser';
import { eachDayOfInterval, format } from "date-fns";

export default function getArrivalManualSchedule() {
    return useQuery({
        queryKey: ["arrival_manual_schedule"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                const { data: gate } = await supabase
                    .from("arrival_manual_schedule")
                    .select(`*`);
                return gate;
            }
            return [];
        }
    });
}

export async function submitScheduleArrival(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const user_id = data?.session?.user.id;
    const userDet = await getUserDetail(user_id);
    const today = new Date().toISOString();

    if (!user_id) throw new Error("User not authenticated.");

    try {
        const schedulePromises = datas.map(async (entry) => {
            if (!entry.aircraft_model) throw new Error("The Aircraft Model can not be empty");
            if (!entry.schedule_type) throw new Error("The Schedule Type can not be empty");
            if (!entry.airline_code_iata) throw new Error("The Airline Code can not be empty");
            if (!entry.flight_number) throw new Error("The Flight Number can not be empty");
            if (!entry.a_ori_iata1) throw new Error("The Origin can not be empty");
            if (!entry.a_des_iata) throw new Error("The Destination Station can not be empty");
            if (!entry.start_effective_date) throw new Error("The Start Date can not be empty");
            if (!entry.end_effective_date) throw new Error("The End Date can not be empty");
            if (!entry.aircraft_types) throw new Error("The Aircraft Type can not be empty");

            if (entry.id) {
                // **UPDATE** existing record
                const { data: existingData, error: fetchError } = await supabase
                    .from("arrival_manual_schedule")
                    .select("id")
                    .eq("id", entry.id);

                if (fetchError) {
                    console.error("Error fetching existing data:", fetchError);
                    return;
                }

                if (existingData.length > 0) {
                    const updatePromises = existingData.map(async (updateData) => {
                        const { error: updateError } = await supabase
                            .from("arrival_manual_schedule")
                            .update({
                                aircraft_model: entry.aircraft_model,
                                schedule_type: entry.schedule_type,
                                aircraft_types: entry.aircraft_types,
                                airline_code_iata: entry.airline_code_iata,
                                airline_code_icao: entry.airline_code_icao,
                                airline_name: entry.airline_name,
                                a_ori_iata1: entry.a_ori_iata1,
                                a_ori_iata2: entry.a_ori_iata2,
                                a_ori_iata3: entry.a_ori_iata3,
                                a_ori_iata4: entry.a_ori_iata4,
                                a_des_iata: entry.a_des_iata,
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
                            .eq("id", updateData.id)
                            .select();

                        if (updateError) {
                            console.error("Error updating record:", updateError);
                            throw new Error(updateError.message);
                        }
                    });

                    await Promise.all(updatePromises);

                    //UPDATE SCHEDULE TABLE
                    if(updatePromises){
                        const selectedDays ={
                            Monday: entry.monday,
                            Tuesday: entry.tuesday,
                            Wednesday: entry.wednesday,
                            Thursday: entry.thursday,
                            Friday: entry.friday,
                            Saturday: entry.saturday,
                            Sunday: entry.sunday,
                        }
        
                        const dayIndexes = {
                            Sunday: 0,
                            Monday: 1,
                            Tuesday: 2,
                            Wednesday: 3,
                            Thursday: 4,
                            Friday: 5,
                            Saturday: 6,
                        };
                    
                        // Get the selected days as an array of indexes
                        const activeDays = Object.entries(selectedDays)
                        .filter(([_, isSelected]) => isSelected)
                        .map(([day]) => dayIndexes[day]);
                    
                        // Generate all dates within the range
                        const allDates = eachDayOfInterval({
                        start: new Date(entry.start_effective_date,),
                        end: new Date(entry.end_effective_date,),
                        });
                    
                        // Filter dates that match selected days
                        const filteredDates = allDates.filter(date => activeDays.includes(date.getDay()));
                        const { data: existingSchedule, error: fetchScheduleError } = await supabase
                                .from("arrival_manual_flight_schedule")
                                .select("id")
                                .eq("flight_number", entry.flight_number)
                                .eq("a_ori_iata1", entry.a_ori_iata1)
                                .eq("a_des_iata", entry.a_des_iata)
    

                        if (fetchScheduleError || !existingSchedule) {
                            console.error("Error fetching flight schedule:", fetchScheduleError);
                            throw new Error("Flight schedule record not found");
                        }
                        // Generate flight schedule with STD
                        const flightSchedule = filteredDates.map(date => ({
                            flight_date: format(date, "yyyy-MM-dd"),
                            flight_status: "scheduled",
                            d_origin_iata: entry.d_origin_iata,
                            a_des_iata: entry.a_des_iata,
                            d_origin_icao: entry.d_origin_icao,
                            d_flight_std: format(date, "yyyy-MM-dd") + " " + entry.flight_time,
                            d_flight_etd: format(date, "yyyy-MM-dd") + " " + entry.flight_time,
                            airline_name: entry.airline_name,
                            airline_iata: entry.airline_code_iata,
                            airline_icao: entry.airline_code_icao,
                            flight_number: entry.flight_number,
                            flight_number_iata: entry.airline_code_iata+entry.flight_number,
                            aircraft_type_iata: entry.aircraft_types,
                            schedule_type: entry.schedule_type,
                            aircraft_model: entry.aircraft_model,
                            modified_by: userDet.display_name,
                            modified_at: today,
                        }));
                        
                        for(const dailySchedule of existingSchedule){
                            const { error: updateScheduleError } = await supabase
                                .from("arrival_manual_flight_schedule")
                                .update(flightSchedule)
                                .eq("id", dailySchedule.id)

                            if (updateScheduleError) {
                                console.error("Error updating daily schedule:", updateScheduleError);
                                throw new Error(updateScheduleError.message);
                            }
                            return flightSchedule;
                        }
                    }
                    
                }
            } else {
                // **INSERT** new record
                const { data: insertedData, error: insertError } = await supabase
                    .from("arrival_manual_schedule")
                    .insert({
                        aircraft_model: entry.aircraft_model,
                        schedule_type: entry.schedule_type,
                        aircraft_types: entry.aircraft_types,
                        airline_code_iata: entry.airline_code_iata,
                        airline_code_icao: entry.airline_code_icao,
                        airline_name: entry.airline_name,
                        a_ori_iata1: entry.a_ori_iata1,
                        a_ori_iata2: entry.a_ori_iata2,
                        a_ori_iata3: entry.a_ori_iata3,
                        a_ori_iata4: entry.a_ori_iata4,
                        a_des_iata: entry.a_des_iata,
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
                    })
                    .select();

                if (insertError) {
                    console.error("Error inserting record:", insertError);
                    throw new Error(insertError.message);
                }

                //INSERT DAILY FLIGHT SCHEDULE
                if(insertedData){
                    const selectedDays ={
                        Monday: entry.monday,
                        Tuesday: entry.tuesday,
                        Wednesday: entry.wednesday,
                        Thursday: entry.thursday,
                        Friday: entry.friday,
                        Saturday: entry.saturday,
                        Sunday: entry.sunday,
                    }
 
                    const dayIndexes = {
                        Sunday: 0,
                        Monday: 1,
                        Tuesday: 2,
                        Wednesday: 3,
                        Thursday: 4,
                        Friday: 5,
                        Saturday: 6,
                    };
             
                    // Get the selected days as an array of indexes
                    const activeDays = Object.entries(selectedDays)
                    .filter(([_, isSelected]) => isSelected)
                    .map(([day]) => dayIndexes[day]);
             
                    // Generate all dates within the range
                    const allDates = eachDayOfInterval({
                    start: new Date(entry.start_effective_date,),
                    end: new Date(entry.end_effective_date,),
                    });
             
                    // Filter dates that match selected days
                    const filteredDates = allDates.filter(date => activeDays.includes(date.getDay()));
             
                    // Generate flight schedule with STD
                    const flightSchedule = filteredDates.map(date => ({
                        flight_date: format(date, "yyyy-MM-dd"),
                        flight_status: "scheduled",
                        d_origin_iata: entry.a_ori_iata1,
                        a_des_iata: entry.d_des_iata1,
                        d_origin_icao: entry.d_origin_icao,
                        a_des_sta: format(date, "yyyy-MM-dd") + " " + entry.flight_time,
                        a_des_eta: format(date, "yyyy-MM-dd") + " " + entry.flight_time,
                        airline_name: entry.airline_name,
                        airline_iata: entry.airline_code_iata,
                        airline_icao: entry.airline_code_icao,
                        flight_number: entry.flight_number,
                        flight_number_iata: entry.airline_code_iata+entry.flight_number,
                        aircraft_type_iata: entry.aircraft_types,
                        schedule_type: entry.schedule_type,
                        aircraft_model: entry.aircraft_model,
                        created_by: userDet.display_name,
                    }));
                    // console.log(flightSchedule);
                    const { error: insertScheduleError } = await supabase
                    .from("arrival_manual_flight_schedule")
                    .insert(flightSchedule)
                 
                    if (insertScheduleError) {
                        console.error("Error inserting record:", insertScheduleError);
                        throw new Error(insertScheduleError.message);
                    }
                    return flightSchedule;
                }
            }
        });

        await Promise.all(schedulePromises);
    } catch (error) {
        console.error("Error processing schedule:", error);
        throw error;
    }
}

// export async function submitScheduleArrival(datas) {
//     const supabase = createClient();
//     const { data } = await supabase.auth.getSession();
//     const user_id = data?.session?.user.id;
//     const userDet = await getUserDetail(user_id);
//     const today = new Date().toISOString();

//     if (!data.session?.user) return null;
    
//     if (!user_id) throw new Error("User not authenticated.");
    
//     try {
//         for (const entry of datas) {
//             if(!entry.aircraft_model) throw new Error("The Aircraft Model can not be empty");
//             if(!entry.schedule_type) throw new Error("The Schedule Type can not be empty");
//             if(!entry.airline_code_iata) throw new Error("The Airline Code can not be empty");
//             if(!entry.flight_number) throw new Error("The Flight Number can not be empty");
//             if(!entry.a_ori_iata1) throw new Error("The Destination can not be empty");
//             if(!entry.a_des_iata) throw new Error("The Origin Station can not be empty");
//             if(!entry.start_effective_date) throw new Error("The Start Date can not be empty"); //still have bug on receive the date
//             if(!entry.end_effective_date) throw new Error("The End Date can not be empty"); //still have bug on receive the date
//             if(!entry.aircraft_types) throw new Error("The Aircraft Type can not be empty");
            
//             if (entry.id) {
//                 // **UPDATE** existing record
//                 const { data: existingData, error: fetchError } = await supabase
//                     .from("arrival_manual_schedule")
//                     .select("id")
//                     .eq("id", entry.id)
    
//                 if (fetchError) {
//                     console.error("Error fetching existing data:", fetchError);
//                     continue; // Skip to the next entry if error occurs
//                 }
    
//                 if (existingData) {
//                     for(const updateData of existingData){
//                         // Perform update
//                         const { error: updateError, data: updated } = await supabase
//                         .from("arrival_manual_schedule")
//                         .update({
//                             aircraft_model: entry.aircraft_model,
//                             schedule_type: entry.schedule_type,
//                             aircraft_types: entry.aircraft_types,
//                             airline_code_iata: entry.airline_code_iata,
//                             airline_code_icao: entry.airline_code_icao,
//                             airline_name: entry.airline_name,
//                             a_ori_iata1: entry.a_ori_iata1,
//                             a_ori_iata2: entry.a_ori_iata2,
//                             a_ori_iata3: entry.a_ori_iata3,
//                             a_ori_iata4: entry.a_ori_iata4,
//                             a_des_iata: entry.a_des_iata,
//                             flight_number: entry.flight_number,
//                             monday: entry.monday,
//                             tuesday: entry.tuesday,
//                             wednesday: entry.wednesday,
//                             thursday: entry.thursday,
//                             friday: entry.friday,
//                             saturday: entry.saturday,
//                             sunday: entry.sunday,
//                             remark: entry.remark,
//                             start_effective_date: entry.start_effective_date,
//                             end_effective_date: entry.end_effective_date,
//                             flight_time: entry.flight_time,
//                             modified_by: userDet.display_name,
//                             modified_at: today,
//                         })
//                         .eq("id", updateData.id)
//                         .select();

//                     if (updateError) {
//                         console.error("Error updating record:", updateError);
//                         throw new Error(updateError.message);
//                     }

//                     //UPDATE SCHEDULE TABLE
//                     if(updated){
//                         const selectedDays ={
//                             Monday: entry.monday,
//                             Tuesday: entry.tuesday,
//                             Wednesday: entry.wednesday,
//                             Thursday: entry.thursday,
//                             Friday: entry.friday,
//                             Saturday: entry.saturday,
//                             Sunday: entry.sunday,
//                         }
        
//                         const dayIndexes = {
//                             Sunday: 0,
//                             Monday: 1,
//                             Tuesday: 2,
//                             Wednesday: 3,
//                             Thursday: 4,
//                             Friday: 5,
//                             Saturday: 6,
//                         };
                    
//                         // Get the selected days as an array of indexes
//                         const activeDays = Object.entries(selectedDays)
//                         .filter(([_, isSelected]) => isSelected)
//                         .map(([day]) => dayIndexes[day]);
                    
//                         // Generate all dates within the range
//                         const allDates = eachDayOfInterval({
//                         start: new Date(entry.start_effective_date,),
//                         end: new Date(entry.end_effective_date,),
//                         });
                    
//                         // Filter dates that match selected days
//                         const filteredDates = allDates.filter(date => activeDays.includes(date.getDay()));
//                         const { data: existingSchedule, error: fetchScheduleError } = await supabase
//                                 .from("arrival_manual_flight_schedule")
//                                 .select("id")
//                                 .eq("flight_number", entry.flight_number)
//                                 .eq("d_origin_iata", entry.d_ori_iata)
//                                 .eq("a_des_iata", entry.d_des_iata1)
    

//                         if (fetchScheduleError || !existingSchedule) {
//                             console.error("Error fetching flight schedule:", fetchScheduleError);
//                             throw new Error("Flight schedule record not found");
//                         }
//                         // Generate flight schedule with STD
//                         const flightSchedule = filteredDates.map(date => ({
//                             flight_date: format(date, "yyyy-MM-dd"),
//                             flight_status: "scheduled",
//                             d_origin_iata: entry.a_ori_iata1,
//                             a_des_iata: entry.d_des_iata1,
//                             d_origin_icao: entry.d_origin_icao,
//                             a_des_sta: format(date, "yyyy-MM-dd") + " " + entry.flight_time,
//                             a_des_eta: format(date, "yyyy-MM-dd") + " " + entry.flight_time,
//                             airline_name: entry.airline_name,
//                             airline_iata: entry.airline_code_iata,
//                             airline_icao: entry.airline_code_icao,
//                             flight_number: entry.flight_number,
//                             aircraft_type_iata: entry.aircraft_types,
//                             schedule_type: entry.schedule_type,
//                             aircraft_model: entry.aircraft_model,
//                             modified_by: userDet.display_name,
//                             modified_at: today,
//                         }));
                        
//                         for(const dailySchedule of existingSchedule){
//                             const { error: updateScheduleError } = await supabase
//                                 .from("arrival_manual_flight_schedule")
//                                 .update(flightSchedule)
//                                 .eq("id", dailySchedule.id)
        
//                                 if (updateScheduleError) {
//                                     console.error("Error updating record:", updateScheduleError);
//                                     throw new Error(updateScheduleError.message);
//                                 }
//                                 return flightSchedule;
//                         }
                       
//                     }
//                     }
                    
//                 }
//             } else {
//                 // **INSERT** new record
//                 const { error: insertError, data: inserted } = await supabase
//                     .from("arrival_manual_schedule")
//                     .insert({
//                         aircraft_model: entry.aircraft_model,
//                         schedule_type: entry.schedule_type,
//                         aircraft_types: entry.aircraft_types,
//                         airline_code_iata: entry.airline_code_iata,
//                         airline_code_icao: entry.airline_code_icao,
//                         airline_name: entry.airline_name,
//                         a_ori_iata1: entry.a_ori_iata1,
//                         a_ori_iata2: entry.a_ori_iata2,
//                         a_ori_iata3: entry.a_ori_iata3,
//                         a_ori_iata4: entry.a_ori_iata4,
//                         a_des_iata: entry.a_des_iata,
//                         flight_number: entry.flight_number,
//                         monday: entry.monday,
//                         tuesday: entry.tuesday,
//                         wednesday: entry.wednesday,
//                         thursday: entry.thursday,
//                         friday: entry.friday,
//                         saturday: entry.saturday,
//                         sunday: entry.sunday,
//                         remark: entry.remark,
//                         start_effective_date: entry.start_effective_date,
//                         end_effective_date: entry.end_effective_date,
//                         flight_time: entry.flight_time,
//                         created_by: userDet.display_name,
//                         created_at: today,
//                     })
//                     .select();
    
//                 if (insertError) {
//                     console.error("Error inserting record:", insertError);
//                     throw new Error(insertError.message);
//                 }

//                 //INSERT TO SCHEDULE TABLE
//                 if(inserted){
//                     const selectedDays ={
//                         Monday: entry.monday,
//                         Tuesday: entry.tuesday,
//                         Wednesday: entry.wednesday,
//                         Thursday: entry.thursday,
//                         Friday: entry.friday,
//                         Saturday: entry.saturday,
//                         Sunday: entry.sunday,
//                     }
    
//                     const dayIndexes = {
//                         Sunday: 0,
//                         Monday: 1,
//                         Tuesday: 2,
//                         Wednesday: 3,
//                         Thursday: 4,
//                         Friday: 5,
//                         Saturday: 6,
//                     };
                
//                     // Get the selected days as an array of indexes
//                     const activeDays = Object.entries(selectedDays)
//                     .filter(([_, isSelected]) => isSelected)
//                     .map(([day]) => dayIndexes[day]);
                
//                     // Generate all dates within the range
//                     const allDates = eachDayOfInterval({
//                     start: new Date(entry.start_effective_date,),
//                     end: new Date(entry.end_effective_date,),
//                     });
                
//                     // Filter dates that match selected days
//                     const filteredDates = allDates.filter(date => activeDays.includes(date.getDay()));
                
//                     // Generate flight schedule with STD
//                     const flightSchedule = filteredDates.map(date => ({
//                     flight_date: format(date, "yyyy-MM-dd"),
//                     flight_status: "scheduled",
//                     d_origin_iata: entry.a_ori_iata1,
//                     a_des_iata: entry.d_des_iata1,
//                     d_origin_icao: entry.d_origin_icao,
//                     a_des_sta: format(date, "yyyy-MM-dd") + " " + entry.flight_time,
//                     a_des_eta: format(date, "yyyy-MM-dd") + " " + entry.flight_time,
//                     airline_name: entry.airline_name,
//                     airline_iata: entry.airline_code_iata,
//                     airline_icao: entry.airline_code_icao,
//                     flight_number: entry.flight_number,
//                     flight_number_iata: entry.airline_code_iata+entry.flight_number,
//                     aircraft_type_iata: entry.aircraft_types,
//                     schedule_type: entry.schedule_type,
//                     aircraft_model: entry.aircraft_model,
//                     created_by: userDet.display_name,
//                     created_at: today,
//                     }));
//                     // console.log(flightSchedule);

//                     const { error: insertScheduleError } = await supabase
//                     .from("arrival_manual_flight_schedule")
//                     .insert(flightSchedule)

                    
//                     if (insertScheduleError) {
//                         console.error("Error inserting record:", insertScheduleError);
//                         throw new Error(insertScheduleError.message);
//                     }
//                     return flightSchedule;
//                 }
//             }
//         }
//     } catch (error) {
//         throw error;
//     }
// }

export async function deleteArrivalManualSchedule(datas) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
        // Update the profile with the provided data
        for (const entry of datas) {
            
            if (entry.id) {
                // **UPDATE** existing record
                const { error } = await supabase
                .from("arrival_manual_schedule")
                .delete()
                .eq('id', entry.id);

                    if (error) {
                        console.error("Error updating record:", error);
                        throw new Error(error.message);
                    }
            }

            
        }
    }
    return [];
}