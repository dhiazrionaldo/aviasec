/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import { getRoles, getCompany, editProfiles, getStation } from '@/app/hook/setting/profile'; // Import hooks
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

export const maxDuration = 60;

export type userSetting = {
  company_id: number | null;
  created_at: string | null;
  display_name: string | null;
  email: string | null;
  id: string | null;
  image_url: string | null;
  modified_at: string | null;
  modified_by: string | null;
  role_id: number | null;
  station_id: number | null;
  employee_id: string | null;
};

export const columns: ColumnDef<userSetting>[] = [
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
        cell: ({ row }) => (
            <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "display_name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Display Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "employee_id",
        header: "Employee Id",
        cell: ({ row }) => {
            const [editableEmployeeId, setEditableEmployeeId] = React.useState(row.original.employee_id);
            
            // Track the quantity change in the state
            const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setEditableEmployeeId(String(e.target.value));
                row.original.employee_id = String(e.target.value); // Update row data
            };
    
            return (
                <Input
                    type="number"
                    value={editableEmployeeId || ""}
                    onChange={handleEmployeeIdChange}
                    disabled={!row.getIsSelected()} // Allow editing only when selected
                    className="w-fit border-primary"
                />
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role_id",
        header: "Role",
        cell: ({ row }) => {
            const { data: role } = getRoles(); // Fetch roles
            const [selectedRole, setSelectedRole] = useState(row.original.role_id || null);
            
            return (
                <Select
                    value={selectedRole ? (Array.isArray(role) ? role.find((role) => role.id === row.original.role_id)?.role_name || undefined : undefined) : undefined}
                    onValueChange={(value) => {
                        const selected = Array.isArray(role) ? role.find((role) => role.role_name === value) : null;
                        if (selected) {
                            row.original.role_id = selected.id;
                            setSelectedRole(selected.id);
                        }
                    }}
                    disabled={!row.getIsSelected()} // Allow editing only when selected
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.isArray(role) && role.map((role) => (
                            <SelectItem
                                key={role.id}
                                value={role.role_name || ''}
                            >
                                {role.role_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        },
    },
    {
        accessorKey: "company_id",
        header: "Company",
        cell: ({ row }) => {
            const { data: companies } = getCompany(); // Fetch companies
            const [selectedCompany, setSelectedCompany] = useState(row.original.company_id || null);

            return (
                <Select
                    value={selectedCompany ? (Array.isArray(companies) ? companies.find(company => company?.id === row.original.company_id)?.company_name || undefined : undefined) : undefined}
                    onValueChange={(value) => {
                        const selected = Array.isArray(companies) ? companies.find((company) => company?.company_name === value) : null;
                        if (selected) {
                            row.original.company_id = selected.id;
                            setSelectedCompany(selected.id);
                        }
                    }}
                    disabled={!row.getIsSelected()} // Allow editing only when selected
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choose user company" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.isArray(companies) && companies.map((company) => (
                            <SelectItem
                                key={company?.id}
                                value={company?.company_name || ''}
                            >
                                {company?.company_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        },
    },
    {
        accessorKey: "station_id",
        header: "Station",
        cell: ({ row }) => {
            const { data: stations } = getStation(); // Fetch companies
            const [selectedStation, setSelectedStation] = useState(row.original.station_id || null);

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
        id: "actions",
        header: "actions",
        cell: ({ row }) => {
            const rowData = row.original;
            const queryClient = useQueryClient();

            const handleSubmit = async () => {
                try {
                    const updatedUser = await editProfiles(rowData); // Call editProfiles with the row data
                    queryClient.invalidateQueries({queryKey: ["profile"]}); // Invalidate the profile query to refresh data
                    queryClient.invalidateQueries({queryKey: ["user"]}); // Invalidate the profile query to refresh data
                    console.log("Profile updated:", updatedUser);
                    toast.success('sukses');
                } catch (error) {
                    console.error("Error updating profile:", error);
                    toast.error(`error occured: ${error}`)
                }
            };

            return (
                <div>
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            )
        },
    },
];
