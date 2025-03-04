/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import { getRoles, getCompany, editProfiles, getStation } from '@/app/hook/setting/profile'; 
import { editTerminalPairing, createTerminalPairing, deleteTerminalPairing, getGate, getParkingStand, getTerminal } from '@/app/hook/terminal_setting/terminal_merge'; 
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

export const maxDuration = 60;

export type terminalPairingSetting = {
  company_id: number | null;
  created_at: string | null;
  created_by: string | null;
  id: string | null;
  image_url: string | null;
  modified_at: string | null;
  modified_by: string | null;
  parking_id: number | null;
  station_id: number | null;
  gate_id: string | null;
  terminal_id: string | null;
  master_terminal: {
    id: number | null;
    terminal: string | null;
  }
  master_station: {
    id: number | null;
    station_code: string | null;
    station_name: string | null;
  }
  master_gate: {
    id: number | null;
    gate: string | null;
  }
  master_parking_stand: {
    id: number | null;
    parking_stand: number | null;
  }
};

export const columns: ColumnDef<terminalPairingSetting>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => {
          if (!row) return null; // Prevents error if row is undefined
      
          return (
            <Checkbox
              checked={row.getIsSelected?.() ?? false} // Ensure safe access
              onCheckedChange={(value) => row.toggleSelected?.(!!value)}
              aria-label="Select row"
              className="translate-y-[2px]"
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
    },      
    {
        accessorKey: "station_id",
        header: "Station",
        accessorFn: (row) => row.master_station?.station_code,
        cell: ({ row }) => {
            const { data: stations } = getStation(); // Fetch companies
            const [selectedStation, setSelectedStation] = useState(row.original.station_id || null);
            if (!row) return null; 
            return (
                <Select
                    value={selectedStation ? (Array.isArray(stations) ? stations.find(station => station?.id === row.original.station_id)?.station_code || undefined : undefined) : undefined}
                    onValueChange={(value) => {
                        const selected = Array.isArray(stations) ? stations.find((station) => station?.station_code === value) : null;
                        if (selected) {
                            row.original.station_id = selected.id;
                            setSelectedStation(selected.id);
                        }
                    }}
                    disabled={!row.getIsSelected()} // Allow editing only when selected
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choose user station" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.isArray(stations) && stations.map((station) => (
                            <SelectItem
                                key={station?.id}
                                value={station?.station_code || ''}
                            >
                                {station?.station_code}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        },
    },
    {
        accessorKey: "terminal_id",
        header: "Terminal",
        accessorFn: (row) => row.master_terminal?.terminal,
        cell: ({ row }) => {
            const { data: terminals } = getTerminal(); // Fetch companies
            const [selectedTerminal, setSelectedTerminal] = useState(row.original.terminal_id || null);
            if (!row) return null; 
            return (
                <Select
                    value={selectedTerminal ? (Array.isArray(terminals) ? terminals.find(terminal => terminal?.id === row.original.terminal_id)?.terminal || undefined : undefined) : undefined}
                    onValueChange={(value) => {
                        const selected = Array.isArray(terminals) ? terminals.find((terminal) => terminal?.terminal === value) : null;
                        if (selected) {
                            row.original.terminal_id = selected.id;
                            setSelectedTerminal(selected.id);
                        }
                    }}
                    disabled={!row.getIsSelected()} // Allow editing only when selected
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choose user station" />
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
        },
    },
    {
        accessorKey: "gate_id",
        header: "Boarding Gate",
        accessorFn: (row) => row.master_gate?.gate,
        cell: ({ row }) => {
            const { data: gates } = getGate(); // Fetch companies
            const [selectedGate, setSelectedGate] = useState(row.original.gate_id || null);
            if (!row) return null; 
            return (
                <Select
                    value={selectedGate ? (Array.isArray(gates) ? gates.find(gate => gate?.id === row.original.gate_id)?.gate || undefined : undefined) : undefined}
                    onValueChange={(value) => {
                        const selected = Array.isArray(gates) ? gates.find((gate) => gate?.gate === value) : null;
                        if (selected) {
                            row.original.gate_id = selected.id;
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
        },
    },
    {
        accessorKey: "parking_id",
        header: "Parking Stand",
        accessorFn: (row) => row.master_parking_stand?.parking_stand,
        cell: ({ row }) => {
            const { data: parking_stands } = getParkingStand(); // Fetch companies
            const [selectedParkingStand, setSelectedParkingStand] = useState(row.original.parking_id || null);
            if (!row) return null; 
            return (
                <Select
                    value={selectedParkingStand ? (Array.isArray(parking_stands) ? parking_stands.find(parking => parking?.id === row.original.parking_id)?.parking_stand || undefined : undefined) : undefined}
                    onValueChange={(value) => {
                        const selected = Array.isArray(parking_stands) ? parking_stands.find((parking) => parking?.parking_stand === value) : null;
                        if (selected) {
                            row.original.parking_id = selected.id;
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
        },
    },
    {
        id: "remark",
        header: "Remark",
        cell: ({ row }) => {
            const [remark, setRemark] = React.useState(row.original.remark);
            
            // Track the quantity change in the state
            const handleOrderQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setRemark(String(e.target.value));
                row.original.remark = String(e.target.value); // Update row data
            };
    
            return (
                <Input
                    value={remark || ""}
                    onChange={handleOrderQtyChange}
                    disabled={!row.getIsSelected()} // Allow editing only when selected
                    className="w-fit border-primary"
                />
            );
        },
    },
];
