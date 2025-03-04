"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  isRowSelected,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CirclePlus, Loader2, Save } from "lucide-react";
import { submitTerminalPairing } from "@/app/hook/terminal_setting/terminal_merge";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableData, setTableData] = useState<TData[]>(data);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowsToAdd, setRowsToAdd] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, rowSelection },
  });

  const handleAddRows = () => {
    const newRows = Array.from({ length: rowsToAdd }, () => ({
      id: null,
      station_id: null,
      terminal_id: null,
      gate_id: null,
      parking_id: null,
    })) as TData[];
    setTableData([...tableData, ...newRows]);
    setIsDialogOpen(false);
  };

  const handleSubmit = async() => {
    setLoading(true)
    try {
      // Send the data to your API or backend function
      const response = await submitTerminalPairing(tableData);

      if (response) {
        toast.success("Success submitting data!");
      } else {
        toast.error("Failed to submit data.");
      }
    } catch (error) {
      toast.error(error)
    } finally{
      setLoading(false)
      setRowSelection({});  // 🔹 Reset selection after submission
    }
  };

  return (
    <>
      <div className="flex md:flex-row grid md:grid-cols-5 gap-3 items-center py-4">
        <Input
          placeholder="Search Station..."
          value={(table.getColumn("station_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("station_id")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
        <Input
          placeholder="Search Terminal..."
          value={(table.getColumn("terminal_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("terminal_id")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
        <Input
          placeholder="Search Boarding Gate..."
          value={(table.getColumn("gate_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("gate_id")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
        <Input
          placeholder="Search Parking Stand..."
          value={(table.getColumn("parking_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("parking_id")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
        <div className="flex gap-4">
        <Button className="bg-blue-700 hover:bg-blue-900" disabled={loading} onClick={() => setIsDialogOpen(true)}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CirclePlus size={15} />}
          Add Rows
        </Button>

        <Button disabled={loading} onClick={handleSubmit}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={15} />}
          Submit
        </Button>
        </div>        
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Rows</DialogTitle>
          </DialogHeader>
          <Input
            type="number"
            min="1"
            value={rowsToAdd}
            onChange={(e) => setRowsToAdd(parseInt(e.target.value) || 1)}
          />
          <DialogFooter>
            <Button onClick={handleAddRows}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
// "use client"

// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import React from "react";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       sorting,
//       columnFilters,
//     }
//   })

//   //handle add rows
  

//   return (
//     <>
//       <div className="flex md:flex-row grid md:grid-cols-4 gap-3 items-center py-4">
//         <Input
//           placeholder="Search Station..."
//           value={(table.getColumn("station_id")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("station_id")?.setFilterValue(event.target.value)
//           }
//           className="max-w mr-2"
//         />
//         <Input
//           placeholder="Search Terminal..."
//           value={(table.getColumn("terminal_id")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("terminal_id")?.setFilterValue(event.target.value)
//           }
//           className="max-w mr-2"
//         />
//         <Input
//           placeholder="Search Boarding Gate..."
//           value={(table.getColumn("gate_id")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("gate_id")?.setFilterValue(event.target.value)
//           }
//           className="max-w mr-2"
//         />
//         <Input
//           placeholder="Search Parking Stand..."
//           value={(table.getColumn("parking_id")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("parking_id")?.setFilterValue(event.target.value)
//           }
//           className="max-w mr-2"
//         />
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="flex-1 text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </>
//   )
// }
