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
import { createStation } from '@/app/hook/setting/station'

export const maxDuration = 60;

export function CreateStation() {
    const [stationName, setStationName] = useState('');
    const [stationCode, setStationCode] = useState('');
    const [isLoading, setLoading] = React.useState(false);
    const supabase = createClient()
    const {isFetching, data} = useUser();      
    const queryClient = useQueryClient();

    async function createStationMaster(body: { station_name: string; station_code: string; created_by: string}) {
      setLoading(true);
      
      try {
        const vendors = await createStation(body); // Call editProfiles with the row data
        queryClient.invalidateQueries({queryKey: ["station_master"]}); 
        queryClient.invalidateQueries({queryKey: ["terminal_pairing_master"]}); 
        queryClient.invalidateQueries({queryKey: ["station"]}); 
        
  
        toast.success('Success')
        setLoading(false)
        
      } catch (error) {
        setLoading(false);
        console.error('Error editing:', error);
        toast.error(`Failed to edit item: ${error}`);
      }
    }
    

    const handleSave = async () => {
      
        const datas = {
        station_name: stationName,
        station_code: stationCode,
        created_by: data?.display_name || '', 
        stationName: stationName, 
        };

      await createStationMaster(datas)
    };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button  className="text-white"><CirclePlus className="mr-2 h-6 w-6" />Add new</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Station</SheetTitle>
          <SheetDescription>
            Create your station settings here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stationName" className="text-right">
              Station Name
            </Label>
            <Input id="stationName" 
                   value={stationName}
                   onChange={(e) => setStationName(e.target.value)} 
                   className="col-span-3" 
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stationCode" className="text-right">
              Station Code
            </Label>
            <Input id="stationCode" 
                   value={stationCode}
                   onChange={(e) => setStationCode(e.target.value)} 
                   className="col-span-3" 
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
