/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from '@/components/ui/badge';
import { getGate, getParkingStand, getTerminal } from '@/app/hook/terminal_setting/terminal_merge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const maxDuration = 60;

// export type DepartureManualSchedules = {
//   flight_date: string | null;
//   flight_status: string | null;
//   d_origin_name: string | null;
//   d_origin_iata: string | null;
//   d_origin_icao: string | null;
//   d_origin_terminal: string | null;
//   d_origin_delay: number | null;
//   d_flight_std: string | null;
//   d_flight_etd: string | null;
//   d_flight_atd: string | null;
//   d_flight_runway: string | null;
//   d_parking_stand: string | null;
//   a_des_name: string | null;
//   a_des_iata: string | null;
//   a_des_icao: string | null;
//   a_des_terminal: string | null;
//   a_des_gate: string | null;
//   a_des_baggage: string | null;
//   a_des_sta: string | null;
//   a_des_eta: string | null;
//   a_des_ata: string | null;
//   a_des_runway: string | null;
//   a_parking_stand: string | null;
//   airline_name: string | null;
//   airline_iata: string | null;
//   airline_icao: string | null;
//   flight_number: string | null;
//   flight_number_iata: string | null;
//   flight_number_icao: string | null;
//   codeshared: string | null;
//   aircraft_registration: string | null;
//   aircraft_type_iata: string | null;
//   aircraft_type_icao: string | null;
//   aircraft_type_icao24: string | null;
//   live_position_update: string | null;
//   live_latitude: string | null;
//   live_longitude: string | null;
//   live_altitude: string | null;
//   live_direction: string | null;
//   live_speed_horizontal: string | null;
//   live_speed_vertical: string | null;
//   live_isground: string | null;
// };

// Define days of the week
const daysOfWeek = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
];

export type DepartureManualFlightSchedules = {
    id:number | null;
    created_at: string | null;
    modified_at: string | null;
    created_by: string | null;
    modified_by: string | null;
    flight_date: Date | null;
    flight_status: string | null;
    d_origin_name: string | null;
    d_origin_iata: string | null;
    d_origin_icao: string | null;
    d_origin_terminal: string | null;
    d_origin_gate: string | null;
    d_origin_delay: string | null;
    d_flight_std: Date | null;
    d_flight_etd: Date | null;
    d_flight_atd: Date | null;
    d_flight_e_runway: Date | null;
    d_flight_a_runway: Date | null;
    a_des_name: string | null;
    a_des_iata: string | null;
    a_des_icao: string | null;
    a_des_terminal: string | null;
    a_des_gate: string | null;
    a_des_baggage: string | null;
    a_des_sta: Date | null;
    a_des_eta: Date | null;
    a_des_ata: Date | null;
    a_des_e_runway: Date | null;
    a_des_a_runway: Date | null;
    airline_name: string | null;
    airline_iata: string | null;
    airline_icao: string | null;
    flight_number: string | null;
    flight_number_iata: string | null;
    flight_number_icao: string | null;
    codeshared: string | null;
    aircraft_registration: string | null;
    aircraft_type_iata: string | null;
    aircraft_type_icao: string | null;
    aircraft_type_icao24: string | null;
    live_position_update: string | null;
    live_latitude: string | null;
    live_longitude: string | null;
    live_altitude: string | null;
    live_direction: string | null;
    live_speed_horizontal: string | null;
    live_speed_vertical: string | null;
    live_isground: string | null;
    a_parking_stand: string | null;
    d_parking_stand: string | null;
    schedule_type: string | null;
    aircraft_model: string | null;

}

export const columns: ColumnDef<DepartureManualFlightSchedules>[] = [
    // Row Selection Checkbox (This enables row editing)
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected?.() ?? false}
              onCheckedChange={(value) => row.toggleSelected?.(!!value)}
              aria-label="Select row for editing"
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
    }, 
    {
        accessorKey: "flight_status",
        header: "Flight Status",
        cell:({row}) => {
            const status = new String(row.original.flight_status)
            if(status == 'scheduled'){
                return <div><Badge className='text-white bg-blue-700 hover:bg-blue-900 uppercase'>scheduled</Badge></div>
            }else if(status == 'cancelled'){
                return <div><Badge className='text-white bg-red-700 hover:bg-red-900 uppercase'>cancelled</Badge></div>
            }else if(status == 'active'){
                return <div><Badge className='text-white bg-indigo-700 hover:bg-indigo-900 uppercase'>active</Badge></div>
            }else if(status == 'landed'){
                return <div><Badge className='text-white bg-green-700 hover:bg-green-900 uppercase'>landed</Badge></div>
            }else if(status == 'incident'){
                return <div><Badge className='text-white bg-rose-700 hover:bg-rose-900 uppercase'>incident</Badge></div>
            }else if(status == 'diverted'){
                return <div><Badge className='text-white bg-amber-700 hover:bg-amber-900 uppercase'>diverted</Badge></div>
            }
        }
    },
    {
        accessorKey: "airline_name",
        header: "Airline Name",
        cell: ({ row }) => {
            return (
                <span>{row.original.airline_name}</span>
            );
            // const [airline_name, setAirlineName] = React.useState(row.original.airline_name);
            
            // // Track the quantity change in the state
            // const handleAirlineNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            //     setAirlineName(String(e.target.value));
            //     row.original.airline_name = String(e.target.value); // Update row data
            // };
            // if(!row.getIsSelected?.()){
            //     return (
            //         <span>{row.original.airline_name}</span>
            //     );
            // }else{
            //     return (
            //         <Input
            //             value={airline_name || ""}
            //             onChange={handleAirlineNameChange}
            //             disabled={!row.getIsSelected()} // Allow editing only when selected
            //             className="w-fit border-primary"
            //         />
            //     );
            // }
            
        },
    },    
    {
        accessorKey: "airline_iata",
        header: "Airline Code IATA",
        cell: ({ row }) => {
            // const [airline_iata, setAirlineNameIATA] = React.useState(row.original.airline_iata);
            return (
                <span className='uppercase'>{row.original.airline_iata}</span>
            );
            // Track the quantity change in the state
            // const handleAirlineNameIATAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            //     setAirlineNameIATA(String(e.target.value));
            //     row.original.airline_iata = String(e.target.value.toUpperCase()); // Update row data
            // };
            // if(!row.getIsSelected?.()){
            //     return (
            //         <span className='uppercase'>{row.original.airline_iata}</span>
            //     );
            // }else{
            //     return (
            //         <Input
            //             value={airline_iata || ""}
            //             onChange={handleAirlineNameIATAChange}
            //             disabled={!row.getIsSelected()} // Allow editing only when selected
            //             className="w-fit border-primary uppercase"
            //         />
            //     );
            // }
            
        },
    },   
    {
        accessorKey: "airline_icao",
        header: "Airline Code ICAO",
        cell: ({ row }) => {
            return (
                <span className='uppercase'>{row.original.airline_icao}</span>
            );
            // const [airline_icao, setAirlineNameICAO] = React.useState(row.original.airline_icao);
            
            // // Track the quantity change in the state
            // const handleAirlineNameICAOChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            //     setAirlineNameICAO(String(e.target.value));
            //     row.original.airline_icao = String(e.target.value.toUpperCase()); // Update row data
            // };
            // if(!row.getIsSelected?.()){
            //     return (
            //         <span className='uppercase'>{row.original.airline_icao}</span>
            //     );
            // }else{
            //     return (
            //         <Input
            //             value={airline_icao || ""}
            //             onChange={handleAirlineNameICAOChange}
            //             disabled={!row.getIsSelected()} // Allow editing only when selected
            //             className="w-fit border-primary uppercase"
            //         />
            //     );
            // }
            
        },
    },   
    {
        accessorKey: "flight_number_iata",
        header: "Flight Number",
        cell: ({ row }) => {

            return (
                <span className='uppercase'>{row.original.flight_number_iata}</span>
            );
            // const [flight_number_iata, setFlightNumber] = React.useState(row.original.flight_number_iata);
            
            // // Track the quantity change in the state
            // const handleFlightNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            //     setFlightNumber(String(e.target.value));
            //     row.original.flight_number_iata = String(e.target.value.toUpperCase()); // Update row data
            // };

            // if(!row.getIsSelected?.()){
            //     return (
            //         <span className='uppercase'>{row.original.flight_number_iata}</span>
            //     );
            // }else{
            //     return (
            //         <Input
            //             value={flight_number_iata || ""}
            //             onChange={handleFlightNumberChange}
            //             disabled={!row.getIsSelected()} // Allow editing only when selected
            //             className="w-fit border-primary uppercase"
            //         />
            //     );
            // }
            
        },
    },
    {
        accessorKey: "aircraft_type_iata",
        header: "Aircraft Type",
        cell: ({ row }) => {
            const [aircraft_type_iata, setAircraftRegistration] = React.useState(row.original.aircraft_type_iata);
            
            // Track the quantity change in the state
            const handleAircraftRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setAircraftRegistration(String(e.target.value));
                row.original.aircraft_type_iata = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.aircraft_type_iata}</span>
                );
            }else{
                return (
                    <Input
                        value={aircraft_type_iata || ""}
                        onChange={handleAircraftRegistrationChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
    {
        accessorKey: "aircraft_registration",
        header: "Aircraft Registration",
        cell: ({ row }) => {
            const [aircraft_registration, setAircraftRegistration] = React.useState(row.original.aircraft_registration);
            
            // Track the quantity change in the state
            const handleAircraftTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setAircraftRegistration(String(e.target.value));
                row.original.aircraft_registration = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.aircraft_registration}</span>
                );
            }else{
                return (
                    <Input
                        value={aircraft_registration || ""}
                        onChange={handleAircraftTypeChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
    {
        accessorKey: "d_origin_iata",
        header: "Origin",
        cell: ({ row }) => {
            const [d_origin_iata, setOriginIATA] = React.useState(row.original.d_origin_iata);
            
            // Track the quantity change in the state
            const handleOriginIATAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setOriginIATA(String(e.target.value));
                row.original.d_origin_iata = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.d_origin_iata}</span>
                );
            }else{
                return (
                    <Input
                        value={d_origin_iata || ""}
                        onChange={handleOriginIATAChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
    {
        accessorKey: "a_des_iata",
        header: "Destination 1",
        cell: ({ row }) => {
            const [a_des_iata, setDesIATA1] = React.useState(row.original.a_des_iata);
            
            // Track the quantity change in the state
            const handleDesIATA1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
                setDesIATA1(String(e.target.value));
                row.original.a_des_iata = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.a_des_iata}</span>
                );
            }else{
                return (
                    <Input
                        value={a_des_iata || ""}
                        onChange={handleDesIATA1Change}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
    {
        accessorKey: "d_origin_terminal",
        header: "Terminal",
        cell: ({ row }) => {
            const { data: terminals } = getTerminal(); // Fetch companies
            const [selectedTerminal, setSelectedTerminal] = useState(row.original.d_origin_terminal || null);
            if (!row) return null; 
            if(!row.getIsSelected?.()){
                return (
                    <span>{row.original.d_origin_terminal}</span>
                );
            }else {
                return (
                    <Select
                        value={selectedTerminal ? (Array.isArray(terminals) ? terminals.find(terminal => terminal?.id === row.original.d_origin_terminal)?.terminal || undefined : undefined) : undefined}
                        onValueChange={(value) => {
                            const selected = Array.isArray(terminals) ? terminals.find((terminal) => terminal?.terminal === value) : null;
                            if (selected) {
                                row.original.d_origin_terminal = selected.id;
                                setSelectedTerminal(selected.id);
                            }
                        }}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose terminal" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.isArray(terminals) && terminals.map((terminal) => (
                                <SelectItem
                                    key={terminal?.id}
                                    value={terminal?.terminal || ''}
                                >
                                    {terminal?.terminal}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }
        },
    },
    {
        accessorKey: "d_origin_gate",
        header: "Boarding Gate",
        cell: ({ row }) => {
            const { data: gates } = getGate(); // Fetch companies
            const [selectedGate, setSelectedGate] = useState(row.original.d_origin_gate || null);
            if (!row) return null; 
            if(!row.getIsSelected?.()){
                return (
                    <span>{row.original.d_origin_terminal}</span>
                );
            }else {
                return (
                    <Select
                        value={selectedGate ? (Array.isArray(gates) ? gates.find(gate => gate?.id === row.original.d_origin_gate)?.gate || undefined : undefined) : undefined}
                        onValueChange={(value) => {
                            const selected = Array.isArray(gates) ? gates.find((gate) => gate?.gate === value) : null;
                            if (selected) {
                                row.original.d_origin_gate = selected.id;
                                setSelectedGate(selected.id);
                            }
                        }}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose user station" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.isArray(gates) && gates.map((gate) => (
                                <SelectItem
                                    key={gate?.id}
                                    value={gate?.gate || ''}
                                >
                                    {gate?.gate}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }
            
        },
    },
    {
        accessorKey: "d_parking_stand",
        header: "Parking Stand",
        cell: ({ row }) => {
            const { data: parking_stands } = getParkingStand(); // Fetch companies
            const [selectedParkingStand, setSelectedParkingStand] = useState(row.original.d_parking_stand || null);
            if (!row) return null;
            if(!row.getIsSelected?.()){
                return (
                    <span>{row.original.d_origin_terminal}</span>
                );
            }else { 
                return (
                    <Select
                        value={selectedParkingStand ? (Array.isArray(parking_stands) ? parking_stands.find(parking => parking?.id === row.original.d_parking_stand)?.parking_stand || undefined : undefined) : undefined}
                        onValueChange={(value) => {
                            const selected = Array.isArray(parking_stands) ? parking_stands.find((parking) => parking?.parking_stand === value) : null;
                            if (selected) {
                                row.original.d_parking_stand = selected.id;
                                setSelectedParkingStand(selected.id);
                            }
                        }}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose user station" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.isArray(parking_stands) && parking_stands.map((parking) => (
                                <SelectItem
                                    key={parking?.id}
                                    value={parking?.parking_stand || ''}
                                >
                                    {parking?.parking_stand}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }
        },
    },
    {
        accessorKey: "flight_date",
        header: "Flight Date",
        cell: ({ row }) => {
            const flight_date = row.original.flight_date;
            // Convert row.original.start_date to a Date object (handle null & invalid cases)
            // const initialDate = row.original.flight_date ? new Date(row.original.flight_date) : null;
            // const [flight_date, setStartDate] = React.useState<Date | null>(initialDate);
    
            // const handleDateChange = (date: Date | undefined) => {
            //     if (date) {
            //         setStartDate(date);
            //         row.original.flight_date = date; // 🔹 Persist date in row data
            //     }
            // };
    
            if (!row.getIsSelected?.()) {
                return (
                    <span>
                        {flight_date ? format(flight_date, "yyyy-MM-dd") : "No Date"}
                    </span>
                );
            } else {
                return (
                    <span>
                        {flight_date ? format(flight_date, "yyyy-MM-dd") : "No Date"}
                    </span>
                );
                // return (
                //     <Popover>
                //         <PopoverTrigger asChild>
                //             <Button
                //                 variant={"outline"}
                //                 className={cn(
                //                     "w-fit justify-start text-left font-normal",
                //                     !flight_date && "text-muted-foreground"
                //                 )}
                //             >
                //                 <CalendarIcon />
                //                 {flight_date ? format(flight_date, "yyyy-MM-dd") : <span>Pick a date</span>}
                //             </Button>
                //         </PopoverTrigger>
                //         <PopoverContent className="w-auto p-0" align="start">
                //             <Calendar
                //                 mode="single"
                //                 selected={flight_date}
                //                 onSelect={handleDateChange} // 🔹 Persist date selection
                //                 initialFocus
                //             />
                //         </PopoverContent>
                //     </Popover>
                // );
            }
        },
    },
    {
        accessorKey: "d_flight_std",
        header: "STD",
        cell: ({ row }) => {
            // Convert row.original.start_date to a Date object (handle null & invalid cases)
            const initialDate = row.original.d_flight_std ? new Date(row.original.d_flight_std) : null;
            const [d_flight_std, setEndDate] = React.useState<Date | null>(initialDate);
    
            const handleDateChange = (date: Date | undefined) => {
                if (date) {
                    setEndDate(date);
                    row.original.d_flight_std = date; // 🔹 Persist date in row data
                }
            };
    
            if (!row.getIsSelected?.()) {
                return (
                    <span>
                        {/* {d_flight_std ? format(d_flight_std, "PPpp") : "No Date"} */}
                        {d_flight_std ? format(d_flight_std, "hh:mm:ss") : "No Date"}
                    </span>
                );
            } else {
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-fit justify-start text-left font-normal",
                                    !d_flight_std && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {d_flight_std ? format(d_flight_std, "Pp") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={d_flight_std}
                                onSelect={handleDateChange} // 🔹 Persist date selection
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );
            }
        },
    },    
    {
        accessorKey: "d_flight_etd",
        header: "ETD",
        cell: ({ row }) => {
            // Convert row.original.start_date to a Date object (handle null & invalid cases)
            const initialDate = row.original.d_flight_etd ? new Date(row.original.d_flight_etd) : null;
            const [d_flight_etd, setEndDate] = React.useState<Date | null>(initialDate);
    
            const handleDateChange = (date: Date | undefined) => {
                if (date) {
                    setEndDate(date);
                    row.original.d_flight_etd = date; // 🔹 Persist date in row data
                }
            };
    
            if (!row.getIsSelected?.()) {
                return (
                    <span>
                        {/* {d_flight_etd ? format(d_flight_etd, "PPpp") : "No Date"} */}
                        {d_flight_etd ? format(d_flight_etd, "hh:mm:ss") : "No Date"}
                    </span>
                );
            } else {
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-fit justify-start text-left font-normal",
                                    !d_flight_etd && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {d_flight_etd ? format(d_flight_etd, "Pp") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={d_flight_etd}
                                onSelect={handleDateChange} // 🔹 Persist date selection
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );
            }
        },
    },
    {
        accessorKey: "d_flight_atd",
        header: "ATD",
        cell: ({ row }) => {
            // Convert row.original.start_date to a Date object (handle null & invalid cases)
            const initialDate = row.original.d_flight_atd ? new Date(row.original.d_flight_atd) : null;
            const [d_flight_atd, setEndDate] = React.useState<Date | null>(initialDate);
    
            const handleDateChange = (date: Date | undefined) => {
                if (date) {
                    setEndDate(date);
                    row.original.d_flight_atd = date; // 🔹 Persist date in row data
                }
            };
    
            if (!row.getIsSelected?.()) {
                return (
                    <span>
                        {/* {d_flight_atd ? format(d_flight_atd, "PPpp") : "No Date"} */}
                        {d_flight_atd ? format(d_flight_atd, "hh:mm:ss") : "No Date"}
                    </span>
                );
            } else {
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-fit justify-start text-left font-normal",
                                    !d_flight_atd && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {d_flight_atd ? format(d_flight_atd, "Pp") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={d_flight_atd}
                                onSelect={handleDateChange} // 🔹 Persist date selection
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );
            }
        },
    },
    
//     {
//         id: "d_origin_terminal",
//         header: "Terminal",
//         cell: ({ row }) => {
//             const [d_origin_terminal, setOriginTerminal] = React.useState(row.original.d_origin_terminal);
            
//             // Track the quantity change in the state
//             const handleOriginTerminal = (e: React.ChangeEvent<HTMLInputElement>) => {
//                 setOriginTerminal(String(e.target.value));
//                 row.original.d_origin_terminal = String(e.target.value.toUpperCase()); // Update row data
//             };
//             if(!row.getIsSelected?.()){
//                 return (
//                     <span className='uppercase'>{row.original.d_origin_terminal}</span>
//                 );
//             }else{
//                 return (
//                     <Input
//                         value={d_origin_terminal || ""}
//                         onChange={handleOriginTerminal}
//                         disabled={!row.getIsSelected()} // Allow editing only when selected
//                         className="w-fit border-primary uppercase"
//                     />
//                 );
//             }
            
//         },
//     },
//     {
//         id: "d_origin_gate",
//         header: "Boarding Gate",
//         cell: ({ row }) => {
//             const [d_origin_gate, setBoardingGate] = React.useState(row.original.d_origin_gate);
            
//             // Track the quantity change in the state
//             const handleBoardingGateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//                 setBoardingGate(String(e.target.value));
//                 row.original.d_origin_gate = String(e.target.value.toUpperCase()); // Update row data
//             };
//             if(!row.getIsSelected?.()){
//                 return (
//                     <span className='uppercase'>{row.original.d_origin_gate}</span>
//                 );
//             }else{
//                 return (
//                     <Input
//                         value={d_origin_gate || ""}
//                         onChange={handleBoardingGateChange}
//                         disabled={!row.getIsSelected()} // Allow editing only when selected
//                         className="w-fit border-primary uppercase"
//                     />
//                 );
//             }
            
//         },
//     },
// {
//     id: "d_parking_stand",
//     header: "Parking Stand",
//     cell: ({ row }) => {
//         const [d_parking_stand, setFlightTime] = React.useState(row.original.d_parking_stand);
        
//         // Track the quantity change in the state
//         const handleParkingStandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//             console.log(d_parking_stand);
//             setFlightTime(String(e.target.value));
//             row.original.d_parking_stand = String(e.target.value); // Update row data
//         };
//         if(!row.getIsSelected?.()){
//             return (
//                 <span className='uppercase'>{row.original.d_parking_stand}</span>
//             );
//         }else{
//             return (
//                 <Input
//                     value={d_parking_stand || ""}
//                     onChange={handleParkingStandChange}
//                     disabled={!row.getIsSelected()} // Allow editing only when selected
//                     className="w-fit border-primary"
//                 />
//             );
//         }
        
//     },
// },
//     {
//         id: "d_des_iata4",
//         header: "Destination 4",
//         cell: ({ row }) => {
//             const [d_des_iata4, setDesIATA4] = React.useState(row.original.d_des_iata4);
            
//             // Track the quantity change in the state
//             const handleDesIATA4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
//                 setDesIATA4(String(e.target.value));
//                 row.original.d_des_iata4 = String(e.target.value.toUpperCase()); // Update row data
//             };
//             if(!row.getIsSelected?.()){
//                 return (
//                     <span className='uppercase'>{row.original.d_des_iata4}</span>
//                 );
//             }else{
//                 return (
//                     <Input
//                         value={d_des_iata4 || ""}
//                         onChange={handleDesIATA4Change}
//                         disabled={!row.getIsSelected()} // Allow editing only when selected
//                         className="w-fit border-primary uppercase"
//                     />
//                 );
//             }
            
//         },
//     },
//    // ✅ "All Days" Checkbox (Forces Table to Re-render)
//   {
//     id: "All",
//     header: "All Days",
//     cell: ({ row, table }) => {
//       const isSelected = row.getIsSelected?.() ?? false;
//       const [isAllChecked, setIsAllChecked] = useState(
//         daysOfWeek.every((day) => row.original[day.id] ?? false)
//       );
//       const [, forceUpdate] = useState(0); // Force re-render state

//       useEffect(() => {
//         setIsAllChecked(daysOfWeek.every((day) => row.original[day.id] ?? false));
//       }, [row.original]);

//       const handleAllCheckedChange = (value: boolean) => {
//         daysOfWeek.forEach((day) => (row.original[day.id] = value));
//         row._valuesCache = { ...row.original }; // 🔹 Forces Table Update

//         setIsAllChecked(value);
//         forceUpdate((prev) => prev + 1); // 🔹 Force Re-render
//         table.setRowSelection({ ...table.getState().rowSelection }); // 🔹 Re-trigger Table Render
//       };

//       return (
//         <Checkbox
//           disabled={!isSelected}
//           checked={isAllChecked}
//           onCheckedChange={(value) => handleAllCheckedChange(!!value)}
//           aria-label="Select all days"
//         />
//       );
//     },
//   },

//   // ✅ Individual Day Checkboxes (Forces Table to Re-render)
//   ...daysOfWeek.map((day) => ({
//     id: day.id,
//     header: day.label,
//     cell: ({ row, table }) => {
//       const isSelected = row.getIsSelected?.() ?? false;
//       const [checked, setChecked] = useState(row.original[day.id] ?? false);
//       const [, forceUpdate] = useState(0); // Force re-render state

//       useEffect(() => {
//         setChecked(row.original[day.id] ?? false);
//       }, [row.original[day.id]]);

//       const handleChange = (value: boolean) => {
//         row.original[day.id] = value;
//         setChecked(value);

//         // ✅ If any day is unchecked, uncheck "All"
//         const allChecked = daysOfWeek.every((d) => row.original[d.id]);
//         row.original.All = allChecked;

//         row._valuesCache = { ...row.original }; // 🔹 Forces Table Update
//         forceUpdate((prev) => prev + 1); // 🔹 Force Re-render
//         table.setRowSelection({ ...table.getState().rowSelection }); // 🔹 Re-trigger Table Render
//       };

//       return (
//         <Checkbox
//           disabled={!isSelected}
//           checked={checked}
//           onCheckedChange={(value) => handleChange(!!value)}
//           aria-label={`Select ${day.label}`}
//         />
//       );
//     },
//   })),
  
//     {
//         id: "remark",
//         header: "Remark",
//         cell: ({ row }) => {
//             const [remark, setRemark] = React.useState(row.original.remark);
            
//             // Track the quantity change in the state
//             const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//                 setRemark(String(e.target.value));
//                 row.original.remark = String(e.target.value); // Update row data
//             };

//             if(!row.getIsSelected?.()){
//                 return (
//                     <span>{row.original.remark}</span>
//                 );
//             }else{
//                 return (
//                     <Input
//                         value={remark || ""}
//                         onChange={handleRemarkChange}
//                         disabled={!row.getIsSelected()} // Allow editing only when selected
//                         className="w-fit border-primary"
//                     />
//                 );
//             }
            
//         },
//     },
];
