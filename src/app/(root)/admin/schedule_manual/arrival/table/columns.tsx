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
import useUser from '@/app/hook/useUser';

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

export type ArrivalManualSchedules = {
    flight_date: string | null;
    flight_time: string | null;
    d_origin_name: string | null;
    d_ori_iata: string | null;
    a_des_name: string | null;
    a_des_iata: string | null;
    d_flight_std: string | null;
    airline_name: string | null;
    airline_code_iata: string | null;
    airline_code_icao: string | null;
    flight_number: string | null;
    a_ori_iata1: string | null;
    a_ori_iata2: string | null;
    a_ori_iata3: string | null;
    a_ori_iata_4: string | null;
    monday: boolean | null;
    tuesday: boolean | null;
    wednesday: boolean | null;
    thursday: boolean | null;
    friday: boolean | null;
    saturday: boolean | null;
    sunday: boolean | null;
    start_effective_date: Date | null;
    end_effective_date: Date | null;
    aircraft_types: string | null;
    remark: string | null;
    aircraft_model: string | null;
    schedule_type: string | null;
}

export const columns: ColumnDef<ArrivalManualSchedules>[] = [
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
        accessorKey: "airline_name",
        header: "Airline Name",
        cell: ({ row }) => {
            const [airline_name, setAirlineName] = React.useState(row.original.airline_name);
            
            // Track the quantity change in the state
            const handleAirlineNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setAirlineName(String(e.target.value));
                row.original.airline_name = String(e.target.value); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span>{row.original.airline_name}</span>
                );
            }else{
                return (
                    <Input
                        value={airline_name || ""}
                        onChange={handleAirlineNameChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary"
                    />
                );
            }
            
        },
    },    
    {
        accessorKey: "airline_code_iata",
        header: "Airline Name IATA",
        cell: ({ row }) => {
            const [airline_code_iata, setAirlineNameIATA] = React.useState(row.original.airline_code_iata);
            
            // Track the quantity change in the state
            const handleAirlineNameIATAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setAirlineNameIATA(String(e.target.value));
                row.original.airline_code_iata = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.airline_code_iata}</span>
                );
            }else{
                return (
                    <Input
                        maxLength={2}
                        value={airline_code_iata || ""}
                        onChange={handleAirlineNameIATAChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },   
    {
        accessorKey: "airline_code_icao",
        header: "Airline Name ICAO",
        cell: ({ row }) => {
            const [airline_code_icao, setAirlineNameICAO] = React.useState(row.original.airline_code_icao);
            
            // Track the quantity change in the state
            const handleAirlineNameICAOChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setAirlineNameICAO(String(e.target.value));
                row.original.airline_code_icao = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.airline_code_icao}</span>
                );
            }else{
                return (
                    <Input
                        maxLength={3}
                        value={airline_code_icao || ""}
                        onChange={handleAirlineNameICAOChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },   
    {
        accessorKey: "flight_number",
        header: "Flight Number",
        cell: ({ row }) => {
            const [flight_number, setFlightNumber] = React.useState(row.original.flight_number);
            
            // Track the quantity change in the state
            const handleFlightNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setFlightNumber(String(e.target.value));
                row.original.flight_number = String(e.target.value.toUpperCase()); // Update row data
            };

            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.flight_number}</span>
                );
            }else{
                return (
                    <Input
                        maxLength={4}
                        value={flight_number || ""}
                        onChange={handleFlightNumberChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
    {
        accessorKey: "start_effective_date",
        header: "Start Effective Date",
        cell: ({ row }) => {
            // Convert row.original.start_date to a Date object (handle null & invalid cases)
            const initialDate = row.original.start_effective_date ? new Date(row.original.start_effective_date) : null;
            const [start_effective_date, setStartDate] = React.useState<Date | null>(initialDate);
    
            const handleDateChange = (date: Date | undefined) => {
                if (date) {
                    setStartDate(date);
                    row.original.start_effective_date = date; // 🔹 Persist date in row data
                }
            };
    
            if (!row.getIsSelected?.()) {
                return (
                    <span>
                        {start_effective_date ? format(start_effective_date, "yyyy-MM-dd") : "No Date"}
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
                                    !start_effective_date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {start_effective_date ? format(start_effective_date, "yyyy-MM-dd") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={start_effective_date}
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
        accessorKey: "end_effective_date",
        header: "End Effective Date",
        cell: ({ row }) => {
            // Convert row.original.start_date to a Date object (handle null & invalid cases)
            const initialDate = row.original.end_effective_date ? new Date(row.original.end_effective_date) : null;
            const [end_effective_date, setEndDate] = React.useState<Date | null>(initialDate);
    
            const handleDateChange = (date: Date | undefined) => {
                if (date) {
                    setEndDate(date);
                    row.original.end_effective_date = date; // 🔹 Persist date in row data
                }
            };
    
            if (!row.getIsSelected?.()) {
                return (
                    <span>
                        {end_effective_date ? format(end_effective_date, "yyyy-MM-dd") : "No Date"}
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
                                    !end_effective_date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {end_effective_date ? format(end_effective_date, "yyyy-MM-dd") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={end_effective_date}
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
        accessorKey: "flight_time",
        header: "Flight Time",
        cell: ({ row }) => {
            const [flight_time, setFlightTime] = React.useState(row.original.flight_time);
            
            // Track the quantity change in the state
            const handleFlightTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setFlightTime(String(e.target.value));
                row.original.flight_time = String(e.target.value); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.flight_time}</span>
                );
            }else{
                return (
                    <Input
                        type='time'
                        value={flight_time || ""}
                        onChange={handleFlightTimeChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary"
                    />
                );
            }
            
        },
    },
    {
        accessorKey: "aircraft_types",
        header: "Aircraft Type",
        cell: ({ row }) => {
            const [aircraft_types, setAircraftType] = React.useState(row.original.aircraft_types);
            
            // Track the quantity change in the state
            const handleAircraftTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setAircraftType(String(e.target.value));
                row.original.aircraft_types = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.aircraft_types}</span>
                );
            }else{
                return (
                    <Input
                        value={aircraft_types || ""}
                        onChange={handleAircraftTypeChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
    // {
    //     accessorKey: "a_des_iata",
    //     header: "Destination",
    //     cell: ({ row }) => {
    //         const [a_des_iata, setDesIATA] = React.useState(row.original.a_des_iata);
            
    //         // Track the quantity change in the state
    //         const handleDesIATAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //             setDesIATA(String(e.target.value));
    //             row.original.a_des_iata = String(e.target.value.toUpperCase()); // Update row data
    //         };
    //         if(!row.getIsSelected?.()){
    //             return (
    //                 <span className='uppercase'>{row.original.a_des_iata}</span>
    //             );
    //         }else{
    //             return (
    //                 <Input
    //                     value={a_des_iata || ""}
    //                     onChange={handleDesIATAChange}
    //                     disabled={!row.getIsSelected()} // Allow editing only when selected
    //                     className="w-fit border-primary uppercase"
    //                 />
    //             );
    //         }
            
    //     },
    // },
    {
            accessorKey: "a_des_iata",
            header: "Destination",
            cell: ({ row }) => {
              const [a_des_iata, setDesIATA] = React.useState(row.original.a_des_iata || ""); // Initial value
              const { data } = useUser();
              const originStation = data?.master_station.station_code;
          
              // Update state only when the component mounts or if originStation changes
              React.useEffect(() => {
                if (!row.original.a_des_iata && originStation) {
                    setDesIATA(originStation);
                  row.original.a_des_iata = originStation; // Ensuring row data is updated
                }
              }, [originStation, row.original]); // Depend on `originStation` and `row.original`
          
              const handleDestinationIATAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value;
                setDesIATA(newValue);
                row.original.a_des_iata = newValue; // Update row data
              };
          
              return row.getIsSelected?.() ? (
                <Input
                  value={a_des_iata}
                  onChange={handleDestinationIATAChange}
                  className="w-fit border-grey-100 uppercase"
                />
              ) : (
                <span className="uppercase">{a_des_iata}</span>
              );
            },
    },     
    {
        accessorKey: "a_ori_iata1",
        header: "Origin 1",
        cell: ({ row }) => {
            const [a_ori_iata1, setOriIATA1] = React.useState(row.original.a_ori_iata1);
            
            // Track the quantity change in the state
            const handleOriIATA1 = (e: React.ChangeEvent<HTMLInputElement>) => {
                setOriIATA1(String(e.target.value));
                row.original.a_ori_iata1 = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.a_ori_iata1}</span>
                );
            }else{
                return (
                    <Input
                        value={a_ori_iata1 || ""}
                        onChange={handleOriIATA1}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
    {
        accessorKey: "a_ori_iata2",
        header: "Origin 2",
        cell: ({ row }) => {
            const [a_ori_iata2, setOriIATA2] = React.useState(row.original.a_ori_iata2);
            
            // Track the quantity change in the state
            const handleOriIATAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setOriIATA2(String(e.target.value));
                row.original.a_ori_iata2 = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.a_ori_iata2}</span>
                );
            }else{
                return (
                    <Input
                        value={a_ori_iata2 || ""}
                        onChange={handleOriIATAChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
    {
        accessorKey: "a_ori_iata3",
        header: "Origin 3",
        cell: ({ row }) => {
            const [a_ori_iata3, setOriIATA3] = React.useState(row.original.a_ori_iata3);
            
            // Track the quantity change in the state
            const handleOriIATA3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
                setOriIATA3(String(e.target.value));
                row.original.a_ori_iata3 = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.a_ori_iata3}</span>
                );
            }else{
                return (
                    <Input
                        value={a_ori_iata3 || ""}
                        onChange={handleOriIATA3Change}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
    {
        accessorKey: "a_ori_iata4",
        header: "Origin 4",
        cell: ({ row }) => {
            const [a_ori_iata_4, setOriIATA4] = React.useState(row.original.a_ori_iata_4);
            
            // Track the quantity change in the state
            const handleOriIATA4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
                setOriIATA4(String(e.target.value));
                row.original.a_ori_iata_4 = String(e.target.value.toUpperCase()); // Update row data
            };
            if(!row.getIsSelected?.()){
                return (
                    <span className='uppercase'>{row.original.a_ori_iata_4}</span>
                );
            }else{
                return (
                    <Input
                        value={a_ori_iata_4 || ""}
                        onChange={handleOriIATA4Change}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary uppercase"
                    />
                );
            }
            
        },
    },
   // ✅ "All Days" Checkbox (Forces Table to Re-render)
  {
    id: "All",
    header: "All Days",
    cell: ({ row, table }) => {
      const isSelected = row.getIsSelected?.() ?? false;
      const [isAllChecked, setIsAllChecked] = useState(
        daysOfWeek.every((day) => row.original[day.id] ?? false)
      );
      const [, forceUpdate] = useState(0); // Force re-render state

      useEffect(() => {
        setIsAllChecked(daysOfWeek.every((day) => row.original[day.id] ?? false));
      }, [row.original]);

      const handleAllCheckedChange = (value: boolean) => {
        daysOfWeek.forEach((day) => (row.original[day.id] = value));
        row._valuesCache = { ...row.original }; // 🔹 Forces Table Update

        setIsAllChecked(value);
        forceUpdate((prev) => prev + 1); // 🔹 Force Re-render
        table.setRowSelection({ ...table.getState().rowSelection }); // 🔹 Re-trigger Table Render
      };

      return (
        <Checkbox
          disabled={!isSelected}
          checked={isAllChecked}
          onCheckedChange={(value) => handleAllCheckedChange(!!value)}
          aria-label="Select all days"
        />
      );
    },
  },

  // ✅ Individual Day Checkboxes (Forces Table to Re-render)
  ...daysOfWeek.map((day) => ({
    id: day.id,
    header: day.label,
    cell: ({ row, table }) => {
      const isSelected = row.getIsSelected?.() ?? false;
      const [checked, setChecked] = useState(row.original[day.id] ?? false);
      const [, forceUpdate] = useState(0); // Force re-render state

      useEffect(() => {
        setChecked(row.original[day.id] ?? false);
      }, [row.original[day.id]]);

      const handleChange = (value: boolean) => {
        row.original[day.id] = value;
        setChecked(value);

        // ✅ If any day is unchecked, uncheck "All"
        const allChecked = daysOfWeek.every((d) => row.original[d.id]);
        row.original.All = allChecked;

        row._valuesCache = { ...row.original }; // 🔹 Forces Table Update
        forceUpdate((prev) => prev + 1); // 🔹 Force Re-render
        table.setRowSelection({ ...table.getState().rowSelection }); // 🔹 Re-trigger Table Render
      };

      return (
        <Checkbox
          disabled={!isSelected}
          checked={checked}
          onCheckedChange={(value) => handleChange(!!value)}
          aria-label={`Select ${day.label}`}
        />
      );
    },
  })),
  
    {
        id: "remark",
        header: "Remark",
        cell: ({ row }) => {
            const [remark, setRemark] = React.useState(row.original.remark);
            
            // Track the quantity change in the state
            const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setRemark(String(e.target.value));
                row.original.remark = String(e.target.value); // Update row data
            };

            if(!row.getIsSelected?.()){
                return (
                    <span>{row.original.remark}</span>
                );
            }else{
                return (
                    <Input
                        value={remark || ""}
                        onChange={handleRemarkChange}
                        disabled={!row.getIsSelected()} // Allow editing only when selected
                        className="w-fit border-primary"
                    />
                );
            }
            
        },
    },
];
