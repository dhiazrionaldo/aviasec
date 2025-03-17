import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Check, ChevronsUpDown, CirclePlus, Loader2} from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import toast from 'react-hot-toast'
import createClient from '@/utils/supabase/client'
import useUser from '@/app/hook/useUser'
import { useQueryClient } from '@tanstack/react-query'
import { createAirlineMaster } from '@/app/hook/setting/airline'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";

export const maxDuration = 60;

export function CreateAirline({ master_terminal }) {
    const [airlineName, setairlineName] = useState('');
    const [airlineCodeIata, setairlineCodeIata] = useState('');
    const [airlineCodeIcao, setairlineCodeIcao] = useState('');
    const [operatedTerminal, setOperatedTerminal] = useState('');
    const [terminalName, setTerminalName] = useState('');
    const [isLoading, setLoading] = React.useState(false);
    const supabase = createClient();
    const [open, setOpen] = useState(false);
    const {isFetching, data} = useUser();      
    const queryClient = useQueryClient();
    
    const handleInputChange = (operatedTerminal) => {
      console.log(operatedTerminal)
    };
    async function createCompanyMaster(body: { airline_name: string; airline_code_iata: string; airline_code_icao: string; terminal_id: string; created_by: string; }) {
      setLoading(true);
      
      try {
        const vendors = await createAirlineMaster(body); // Call editProfiles with the row data
        queryClient.invalidateQueries({queryKey: ["airline_master"]}); 
        queryClient.invalidateQueries({queryKey: ["profile"]}); 
        queryClient.invalidateQueries({queryKey: ["departure_manual_flight_schedule"]}); 
        queryClient.invalidateQueries({queryKey: ["departure_manual_schedule"]}); 
        queryClient.invalidateQueries({queryKey: ["arrival_manual_flight_schedule"]}); 
        queryClient.invalidateQueries({queryKey: ["arrival_manual_schedule"]}); 
        
  
        toast.success('Success')
        setLoading(false)
        
      } catch (error) {
        setLoading(false);
        console.error('Error editing:', error);
        toast.error(`Failed to edit: ${error}`);
      }
    }
    

    const handleSave = async () => {
      
        const datas = {
        airline_name: airlineName,
        airline_code_iata: airlineCodeIata,
        airline_code_icao: airlineCodeIcao,
        created_by: data?.display_name || '', 
        // airlineName: airlineName, 
        terminal_id: operatedTerminal
        // airlineCodeIata: airlineCodeIata, 
        // airlineCodeIcao: airlineCodeIcao, 
        };
        

      await createCompanyMaster(datas)
    };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button  className="text-white"><CirclePlus className="mr-2 h-6 w-6" />Add new</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create new Airline</SheetTitle>
          <SheetDescription>
            Create your airline settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="airlineName" className="text-right">
              Airline Name
            </Label>
            <Input id="airlineName" 
                   value={airlineName}
                   onChange={(e) => setairlineName(e.target.value)} 
                   className="col-span-3" 
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="airlineCodeIata" className="text-right">
              Airline Code IATA
            </Label>
            <Input id="airlineCodeIata" 
                   maxLength={2}
                   value={airlineCodeIata}
                   onChange={(e) => setairlineCodeIata(e.target.value.toUpperCase())} 
                   className="col-span-3 uppercase" 
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="airlineCodeIcao" className="text-right">
              Airline Code ICAO
            </Label>
            <Input id="airlineCodeIcao" 
                   maxLength={3}
                   value={airlineCodeIcao}
                   onChange={(e) => setairlineCodeIcao(e.target.value.toUpperCase())} 
                   className="col-span-3 uppercase" 
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="operatedTerminal" className="text-right">
              Operated Terminal
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between col-span-3">
                    {terminalName || "Select Operated Terminal..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="select airline..."/>
                    <CommandList>
                      <CommandEmpty>No Airline Found</CommandEmpty>
                      <CommandGroup>
                        {master_terminal.map((a) => (
                          <CommandItem
                            key={a.id}
                            value={a.id}
                            onSelect={() => {
                              setOperatedTerminal(a.id)
                              setTerminalName(a.terminal)
                              setOpen(false);
                            }}
                          >
                            {a.terminal}
                            {master_terminal.terminal === a.terminal && (
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
        </div>
        <SheetFooter>
          {/* <SheetClose asChild> */}
            <>
                {isLoading ? (
                    <Button disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>
                ):(
                    <Button className="text-white" type="submit" onClick={handleSave}>Save changes</Button>
                )}
            </>
          {/* </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
