/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
// import { getRoles, getCompany, editProfiles } from '@/app/hook/setting/profile'; // Import hooks
import { useQueryClient } from '@tanstack/react-query';
import { DeleteTerminalMaster } from './delete-item-category-master';
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {EditTerminalMaster} from '@/app/(root)/admin/setting/master_terminal/table/edit-item-category-master'
export const maxDuration = 60;

export type terminal = {
    id: number;
    terminal: string | null;
    created_at: string;
    created_by: string | null;
}

export const columns: ColumnDef<terminal>[] = [
    {
        accessorKey: "terminal",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Terminal
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: "Create Date",
        cell: ({row}) =>{
            const dateValue = row.getValue('created_at');

            const date = new Date(row.getValue('created_at'));
                
            // Check if dateValue is null or undefined
                if (dateValue === '1/1/1970, 7:00:00 AM') {
                
                return <div></div>; // Return an empty string or div when null
            }
            // Define an array of month abbreviations
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            // Extract day, month, and year
            const day = String(date.getDate()).padStart(2, '0');
            const month = monthNames[date.getMonth()]; // Get month abbreviation
            const year = date.getFullYear();

            // Format as dd mm yyyy
            const formattedDate = `${day} ${month} ${year}`;

            return <div>{formattedDate}</div>
        }
    },  
    {
        accessorKey: "created_by",
        header: "Created By"
    }, 
    {
        accessorKey: "modified_at",
        header: "Modified Date",
        cell: ({row}) =>{
            const dateValue = row.getValue('modified_at');

            const date = new Date(row.getValue('modified_at'));
                
            // Check if dateValue is null or undefined
                if (dateValue === '1/1/1970, 7:00:00 AM') {
                
                return <div></div>; // Return an empty string or div when null
            }
            // Define an array of month abbreviations
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            // Extract day, month, and year
            const day = String(date.getDate()).padStart(2, '0');
            const month = monthNames[date.getMonth()]; // Get month abbreviation
            const year = date.getFullYear();

            // Format as dd mm yyyy
            const formattedDate = `${day} ${month} ${year}`;

            return <div>{formattedDate}</div>
        }
    },   
    {
        accessorKey: "modified_by",
        header: "Modified By"
    }, 
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const rowData = row.original;
            const queryClient = useQueryClient();

            const [isSheetOpen, setSheetOpen] = useState(false);
            const [isDialogOpen, setDialogOpen] = useState(false);
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                <Button className='text-white gap-5' variant='ghost' onClick={() => setSheetOpen(true)}><Pencil size={18} />Edit </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Button className="text-white gap-5" variant="ghost" onClick={() => setDialogOpen(true)}><Trash2 size={18} color="#cf0202"/>Delete</Button>
                </DropdownMenuItem>
                </DropdownMenuContent>
                <EditTerminalMaster stockMaster={rowData} isOpen={isSheetOpen} onOpenChange={setSheetOpen} />
                <DeleteTerminalMaster id={rowData.id} isOpen={isDialogOpen} onOpenChange={setDialogOpen}/>
            </DropdownMenu>
            )
        },
    },
];
