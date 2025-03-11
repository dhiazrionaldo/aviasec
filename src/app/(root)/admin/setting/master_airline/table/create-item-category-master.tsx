import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {CirclePlus, Loader2} from "lucide-react"
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

export const maxDuration = 60;

export function CreateAirline() {
    const [airlineName, setairlineName] = useState('');
    const [airlineCodeIata, setairlineCodeIata] = useState('');
    const [airlineCodeIcao, setairlineCodeIcao] = useState('');
    const [isLoading, setLoading] = React.useState(false);
    const supabase = createClient()
    const {isFetching, data} = useUser();      
    const queryClient = useQueryClient();

    async function createCompanyMaster(body: { airlineName: string; airlineCodeIata: string; airlineCodeIcao: string; created_by: string}) {
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
        airlineName: airlineName, 
        airlineCodeIata: airlineCodeIata, 
        airlineCodeIcao: airlineCodeIcao, 
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
