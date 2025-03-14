"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  RowSelection,
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
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CirclePlus, EllipsisIcon, Loader2, Save, Trash2Icon } from "lucide-react";
import { deleteDepartureManualSchedule, submitScheduleDeparture } from "@/app/hook/manual_schedule/manual_schedule";
import { Label } from "@/components/ui/label";
import { useQueryClient } from '@tanstack/react-query';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import useUser from "@/app/hook/useUser";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useSelectedRow } from "../../selected-row-provider"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  airlinesData: [];
}

export function DataTable<TData, TValue>({ columns, data, airlinesData }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableData, setTableData] = useState<TData[]>(data);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [IsDialogOpen4, setIsDialogOpen4] = useState(false);
  const [rowsToAdd, setRowsToAdd] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [aircraftModel, setAircraftModel] = useState(""); 
  const [scheduleType, setScheduleType] = useState("");    
  const queryClient = useQueryClient();
  const  users  = useUser();
  const [isAuth, setAuth] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  // const { setSelectedRows } = useSelectedRow();
  const [open, setOpen] = useState(false);

  useEffect(() => {
      if (users) {
          setAuth(true);
          setAdmin(users.data?.master_role?.role_name === "superadmin");
      }
  }, [users]);

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

  
  // ✅ State to Store Input Values
  const [newRowData, setNewRowData] = useState({
    airline_name: "",
    airline_code_iata: "",
    flight_number: "",
    aircraft_types: "",
    flight_time: "",
    d_ori_iata: "",
    d_des_iata1: "",
    d_des_iata2: "",
    d_des_iata3: "",
    d_des_iata4: "",
  });

  // ✅ Handle Input Changes & Console Log
  const handleInputChange = (key, value) => {
    setNewRowData((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Handle Row Addition
  const handleAddRows = () => {
    if (!Array.isArray(airlinesData)) {
      console.error("airlinesData is not an array:", airlinesData);
      return;
    }
  
    const newRows = Array.from({ length: rowsToAdd }, () => ({
      ...newRowData,
    }));
  
    setTableData([...tableData, ...newRows]);
    setIsDialogOpen(false);
  };
  
  const handleSubmit = async() => {
    setLoading(true)
    try {
      const selectedRowData = table.getSelectedRowModel().rows.map(row => ({
        ...row.original,
        aircraft_model: aircraftModel,
        schedule_type: scheduleType,
        // start_effective_date: row.start_effective_date,
        // end_effective_date: row.end_effective_date,
      }));
      
      // Send the data to your API or backend function
      await submitScheduleDeparture(selectedRowData);
      queryClient.invalidateQueries({queryKey: ["departure_manual_schedule"]}); 
      queryClient.invalidateQueries({queryKey: ["departure_manual_flight_schedule"]}); 
      
      toast.success("Success submitting data!");
      
    } catch (error) {
      console.log(error);
      toast.error(error.message || "System Error: Unable to submit data");
      // setTimeout(() => {
      //   window.location.reload();  
      // }, 3000);
      
    } finally{
      setLoading(false)
      setRowSelection({});  // 🔹 Reset selection after submission
      setIsDialogOpen2(false);
    }
  };

  const handleDelete = async() => {
    setLoading(true)
    try {
      const selectedRowData = table.getSelectedRowModel().rows.map(row => ({
        ...row.original,
        aircraft_model: aircraftModel,
        schedule_type: scheduleType,
        // start_effective_date: row.start_effective_date,
        // end_effective_date: row.end_effective_date,
      }));
      // const dataToSubmit = Array.isArray(tableData)
      //   ? tableData.map((item) => ({
      //       ...item, // Spread existing item properties
      //       aircraft_model: aircraftModel,
      //       schedule_type: scheduleType,
      //       start_effective_date: item.start_effective_date ? new Date(item.start_effective_date).toDateString().split("T")[0] : null,
      //       end_effective_date: item.end_effective_date ? new Date(item.end_effective_date).toDateString().split("T")[0] : null,
      //     }))
      //   : [
      //       {
      //         ...tableData, // Handle case where tableData is an object
      //         aircraft_model: aircraftModel,
      //         schedule_type: scheduleType,
      //         start_effective_date: item.start_effective_date ? new Date(item.start_effective_date).toString().split("T")[0] : null,
      //         end_effective_date: item.end_effective_date ? new Date(item.end_effective_date).toString().split("T")[0] : null,
      //       },
      //     ];
      // Send the data to your API or backend function
      await deleteDepartureManualSchedule(selectedRowData);
      queryClient.invalidateQueries({queryKey: ["departure_manual_schedule"]}); 
      queryClient.invalidateQueries({queryKey: ["departure_manual_flight_schedule"]}); 
      
      toast.success("Success delete data!");
      
    } catch (error) {
      console.log(error);
      toast.error(error.message || "System Error: Unable to submit data");
      // setTimeout(() => {
      //   window.location.reload();  
      // }, 2000);
      
    } finally{
      setLoading(false)
      setRowSelection({});  // 🔹 Reset selection after submission
      setIsDialogOpen4(false);
    }
  };

  const handleRemoveRow = (index: number) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
  };
  
  return (
    <>
      <div className="flex md:flex-row grid md:grid-cols-7 gap-3 items-center py-4">
        <Input
          placeholder="Search IATA Airline Code..."
          value={(table.getColumn("airline_code_iata")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("airline_code_iata")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
        <Input
          placeholder="Search Flight Number..."
          value={(table.getColumn("flight_number")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("flight_number")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
        <Input
          placeholder="Search Destination 1..."
          value={(table.getColumn("d_des_iata1")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("d_des_iata1")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
        <Input
          placeholder="Search Destination 2..."
          value={(table.getColumn("d_des_iata2")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("d_des_iata2")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
        <Input
          placeholder="Search Destination 3..."
          value={(table.getColumn("d_des_iata3")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("d_des_iata3")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
        <Input
          placeholder="Search Destination 4..."
          value={(table.getColumn("d_des_iata4")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("d_des_iata4")?.setFilterValue(event.target.value)
          }
          className="max-w mr-2"
        />
         <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="md:max-w-[40px] sm:w-full"><EllipsisIcon /></Button>
          </PopoverTrigger>
          <PopoverContent className="grid w-fit gap-3">
            <h3 className="space-y-5"><strong>Action</strong></h3>
            <Separator />
            <Button className="bg-blue-700 hover:bg-blue-900" disabled={loading} onClick={() => setIsDialogOpen(true)}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CirclePlus size={15} />}
              Add Rows
            </Button>

            <Button disabled={loading || Object.keys(rowSelection).length === 0} onClick={() => setIsDialogOpen2(true)}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={15} />}
              Submit
            </Button>
            {isAuth && isAdmin ? (
              <>          
              <Button className="bg-red-700 hover:bg-red-900" disabled={loading || Object.keys(rowSelection).length === 0} onClick={() => setIsDialogOpen4(true)}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2Icon size={15} />}
                Delete
              </Button>
              </>
            ): (
              <></>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border">
        <Table className="whitespace-nowrap">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(index)}>
                      <Trash2Icon size={15} />
                    </Button>
                  </TableCell>
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
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {/* Dialog Section */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Rows</DialogTitle>
            <DialogDescription className="font-thin text-xs">Fill with number of row you want to add</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-5">
            {/* ✅ AIRLINE COMBOBOX */}
            <div className="col-span-2 space-y-2">
              <Label className="font-semibold">Select Airline</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {newRowData.airline_name || "Select Airline"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="select airline..."/>
                    <CommandList>
                      <CommandEmpty>No Airline Found</CommandEmpty>
                      <CommandGroup>
                        {airlinesData.map((a) => (
                          <CommandItem
                            key={a.id}
                            value={a.airline_name}
                            onSelect={() => {
                              handleInputChange("airline_name", a.airline_name);
                              handleInputChange("airline_code_iata", a.airline_code_iata);
                              handleInputChange("airline_code_icao", a.airline_code_icao);
                              setOpen(false);
                            }}
                          >
                            {a.airline_name}
                            {newRowData.airline_code_iata === a.airline_code_iata && (
                              <Check className="ml-auto opacity-100" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

            </div>

            <div className="col-span-2 space-y-2">
              {/* ✅ INPUT FIELDS */}
              <Label className="font-semibold">Flight Number</Label>
              <Input className="uppercase" onChange={(e) => handleInputChange("flight_number", e.target.value.toUpperCase())} />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label className="font-semibold">Aircraft Type</Label>
              <Input className="uppercase" onChange={(e) => handleInputChange("aircraft_types", e.target.value.toUpperCase())} />
            </div>
          
            <div className="col-span-2 space-y-2">
              <Label className="font-semibold">Flight Time</Label>
              <Input type="time" onChange={(e) => handleInputChange("flight_time", e.target.value)} />
            </div>
            {/* <div className="col-span-2 space-y-2">        
              <Label className="font-semibold">Origin IATA</Label>
              <Input className='uppercase' onChange={(e) => handleInputChange("d_ori_iata", e.target.value.toUpperCase())} />
            </div> */}
            <div className="col-span-2 space-y-2">
              <Label className="font-semibold">Destination IATA 1</Label>
              <Input className='uppercase' onChange={(e) => handleInputChange("d_des_iata1", e.target.value.toUpperCase())} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="font-semibold">Destination IATA 2</Label>
              <Input className='uppercase' onChange={(e) => handleInputChange("d_des_iata2", e.target.value.toUpperCase())} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="font-semibold">Destination IATA 3</Label>
              <Input className='uppercase' onChange={(e) => handleInputChange("d_des_iata3", e.target.value.toUpperCase())} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="font-semibold">Destination IATA 4</Label>
              <Input className='uppercase' onChange={(e) => handleInputChange("d_des_iata4", e.target.value.toUpperCase())} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="font-semibold">Rows to Add</Label>
              <Input
                type="number"
                min="1"
                value={rowsToAdd}
                onChange={(e) => setRowsToAdd(parseInt(e.target.value))}
              />
            </div>
          
          </div>
          
          <DialogFooter>
            <Button onClick={handleAddRows}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Rows</DialogTitle>
            <DialogDescription className="font-thin text-xs">Fill with number of row you want to add</DialogDescription>
          </DialogHeader>
          <Input
            type="number"
            min="1"
            value={rowsToAdd}
            onChange={(e) => setRowsToAdd(parseInt(e.target.value))}
          />
          <DialogFooter>
            <Button onClick={handleAddRows}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
        <DialogContent  className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Confirmation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="aircraft_model" className="text-right">
              Aircraft Model
            </Label>
            <Select onValueChange={(value) => setAircraftModel(value)} >
              <SelectTrigger className="w-full col-span-3">
                <SelectValue placeholder="Select a aircraft model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Aircraft Model</SelectLabel>
                  <SelectItem value="passenger">Passenger</SelectItem>
                  <SelectItem value="freighter">Freighter</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schedule_type" className="text-right">
              Schedule Type
            </Label>
            <Select onValueChange={(value) => setScheduleType(value)}>
              <SelectTrigger className="w-full col-span-3">
                <SelectValue placeholder="Choose the schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Schedule Type</SelectLabel>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="hajj">Hajj</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={loading} onClick={handleSubmit}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={15} />}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <AlertDialog open={IsDialogOpen4} onOpenChange={setIsDialogOpen4}>
        {loading ? (
        <AlertDialogContent>
            <AlertDialogHeader className="item-center">
                <AlertDialogTitle>Deleting...</AlertDialogTitle>
                <Loader2 className="animate-spin" />
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        ) : (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your data
                    and remove your data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button  onClick={handleDelete} className="text-white bg-red-700 hover:bg-red-900">Continue</Button>
            </AlertDialogFooter>
        </AlertDialogContent>
        )}
        </AlertDialog>
    </>
  );
}